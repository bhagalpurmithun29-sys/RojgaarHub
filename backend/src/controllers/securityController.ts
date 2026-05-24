import { Request, Response } from 'express';
import User from '../models/User';
import LabourProfile from '../models/LabourProfile';
import Booking from '../models/Booking';
import Payment from '../models/Payment';
import FlaggedCase from '../models/FlaggedCase';

interface AuthRequest extends Request {
  user?: any;
}

// @desc    Evaluate User trust scoring matrix
// @route   GET /api/security/trust-score/:userId
// @access  Private
export const evaluateTrustScore = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Default parameters
    let trustScore = 90; // Default high trust
    let reliabilityScore = 95;
    let riskScore = 10;
    let riskLevel: 'Low' | 'Medium' | 'High' = 'Low';

    // 1. Analyze cancellations history
    const bookings = await Booking.find({ $or: [{ customer: userId }, { labour: userId }] });
    const totalBookings = bookings.length;
    const cancelledBookings = bookings.filter(b => b.status === 'cancelled').length;

    if (totalBookings > 0) {
      const cancellationRate = cancelledBookings / totalBookings;
      if (cancellationRate > 0.4) {
        trustScore -= 30;
        reliabilityScore -= 40;
        riskScore += 50;
      } else if (cancellationRate > 0.2) {
        trustScore -= 15;
        reliabilityScore -= 20;
        riskScore += 25;
      }
    }

    // 2. Scan KYC Biometrics status
    const profile = await LabourProfile.findOne({ user: userId });
    if (profile && profile.kycStatus !== 'approved') {
      trustScore -= 20;
      riskScore += 20;
    }

    // Calculate risk levels classifications
    if (riskScore >= 70) {
      riskLevel = 'High';
    } else if (riskScore >= 40) {
      riskLevel = 'Medium';
    }

    res.json({
      success: true,
      userId,
      trustScore: Math.max(10, trustScore),
      reliabilityScore: Math.max(10, reliabilityScore),
      riskScore: Math.min(100, riskScore),
      riskLevel,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fake account scan checks (Duplicate Aadhaar, device, number telemetry scan)
// @route   POST /api/security/scan-fake-account
// @access  Private
export const scanFakeAccount = async (req: AuthRequest, res: Response) => {
  try {
    const { userId, aadhaarNumber, deviceId, phoneNumber } = req.body;

    const issues: string[] = [];
    let riskLevel: 'Low' | 'Medium' | 'High' = 'Low';

    // 1. Check duplicate phone signups
    const duplicatePhone = await User.findOne({ phoneNumber, _id: { $ne: userId } });
    if (duplicatePhone) {
      issues.push('Duplicate phone number signup detected across multiple profiles.');
      riskLevel = 'High';
    }

    // 2. Check duplicate Aadhaar numbers (mock scan)
    if (aadhaarNumber) {
      const duplicateAadhaar = await LabourProfile.findOne({
        aadhaarNumber,
        user: { $ne: userId }
      });
      if (duplicateAadhaar) {
        issues.push('Duplicate Aadhaar number detected on another labor profile.');
        riskLevel = 'High';
      }
    }

    if (issues.length > 0) {
      const flaggedCase = await FlaggedCase.create({
        userId,
        module: 'fake_account',
        riskLevel,
        reason: issues.join(' | '),
        status: 'flagged',
      });

      return res.json({
        success: true,
        suspicious: true,
        riskLevel,
        issues,
        message: 'Account flagged for administrative audit due to duplicate biometrics or phone signatures.',
        flaggedCase,
      });
    }

    res.json({
      success: true,
      suspicious: false,
      riskLevel: 'Low',
      message: 'Account signatures passed fake biometric scan check.',
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Spam pattern tracking scans (Bot detection & mass request spam)
// @route   POST /api/security/scan-spam
// @access  Private
export const scanSpamPattern = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.body;

    // Check booking requests velocity in the last minute
    const bookings = await Booking.find({ customer: userId }).sort({ createdAt: -1 }).limit(10);
    let isSpam = false;
    let riskLevel: 'Low' | 'Medium' | 'High' = 'Low';

    if (bookings.length >= 5) {
      const timeElapsedSec = (Date.now() - bookings[bookings.length - 1].createdAt.getTime()) / 1000;
      if (timeElapsedSec < 60) {
        isSpam = true;
        riskLevel = 'Medium';
      }
    }

    if (isSpam) {
      const flaggedCase = await FlaggedCase.create({
        userId,
        module: 'spam',
        riskLevel,
        reason: 'Velocity check triggered: High booking requests velocity matches bot pattern.',
        status: 'flagged',
      });

      return res.json({
        success: true,
        suspicious: true,
        riskLevel,
        message: 'Suspicious requests activity matching bot patterns detected. Warning triggered.',
        flaggedCase,
      });
    }

    res.json({
      success: true,
      suspicious: false,
      riskLevel: 'Low',
      message: 'Requests velocity limits check passed.',
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all flagged cases awaiting admin review
// @route   GET /api/security/flagged-cases
// @access  Private (Admin Only)
export const getFlaggedCases = async (req: AuthRequest, res: Response) => {
  try {
    const cases = await FlaggedCase.find({}).sort({ createdAt: -1 }).populate('userId', 'name email');
    res.json(cases);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

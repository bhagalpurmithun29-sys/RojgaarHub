import { Request, Response } from 'express';
import User, { UserRole } from '../models/User';
import LabourProfile from '../models/LabourProfile';
import Booking, { BookingStatus } from '../models/Booking';
import Payment from '../models/Payment';
import AuditLog from '../models/AuditLog';
import FeatureFlag from '../models/FeatureFlag';
import CmsPage from '../models/CmsPage';

interface AuthRequest extends Request {
  user?: any;
}

// @desc    Get complete aggregated platform statistics
// @route   GET /api/admin/stats
// @access  Private (Admin)
export const getSystemStats = async (req: AuthRequest, res: Response) => {
  try {
    const totalCustomers = await User.countDocuments({ role: UserRole.CUSTOMER });
    const totalLabourers = await User.countDocuments({ role: UserRole.LABOUR });
    const totalContractors = await User.countDocuments({ role: UserRole.CONTRACTOR });
    
    const activeBookings = await Booking.countDocuments({ 
      status: { $nin: [BookingStatus.COMPLETED, BookingStatus.CANCELLED, BookingStatus.REJECTED] } 
    });

    const payments = await Payment.find({});
    const platformRevenue = payments
      .filter(p => p.paymentStatus === 'success')
      .reduce((sum, p) => sum + (p.platformFee || 0), 0);

    const pendingKyc = await LabourProfile.find({ kycStatus: 'pending' }).populate('user', 'name email');

    // Retrieve from database
    const featureFlags = await FeatureFlag.find({});
    const cmsPages = await CmsPage.find({});
    const auditLogs = await AuditLog.find({}).sort({ createdAt: -1 }).limit(20).populate('adminId', 'name email');

    res.json({
      stats: {
        totalCustomers,
        totalLabourers,
        totalContractors,
        activeBookings,
        platformRevenue,
      },
      pendingKyc,
      featureFlags,
      cmsPages,
      auditLogs,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Suspend or Delete a User
// @route   PUT /api/admin/users/:id/status
// @access  Private (Admin)
export const updateUserStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'active', 'suspended', 'deleted'

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.status = status;
    await user.save();

    // Log action to persistent AuditLog collection
    await AuditLog.create({
      adminId: req.user._id,
      action: 'USER_STATUS_CHANGE',
      targetUser: user._id,
      details: `Changed status of User ID ${id} to '${status}'.`,
    });

    res.json({
      success: true,
      message: `User profile status updated to '${status}' successfully.`,
      user,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Approve or Reject Labour/Contractor KYC Biometrics
// @route   PUT /api/admin/kyc/:profileId
// @access  Private (Admin)
export const approveKYC = async (req: AuthRequest, res: Response) => {
  try {
    const { profileId } = req.params;
    const { status } = req.body; // 'approved' or 'rejected'

    const profile = await LabourProfile.findById(profileId);
    if (!profile) {
      return res.status(404).json({ message: 'Labour profile not found' });
    }

    profile.kycStatus = status;
    await profile.save();

    // Log action to persistent AuditLog collection
    await AuditLog.create({
      adminId: req.user._id,
      action: 'KYC_VERIFICATION',
      targetUser: profile.user,
      details: `KYC verification status of profile ID ${profileId} updated to '${status}'.`,
    });

    res.json({
      success: true,
      message: `KYC verification successfully mark as '${status}'.`,
      profile,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle platform Feature Flag variables
// @route   PUT /api/admin/feature-flags
// @access  Private (Admin)
export const toggleFeatureFlag = async (req: AuthRequest, res: Response) => {
  try {
    const { flagName, value } = req.body;

    let flag = await FeatureFlag.findOne({ key: flagName });
    if (!flag) {
      flag = new FeatureFlag({
        key: flagName,
        isEnabled: value,
        updatedBy: req.user._id,
      });
    } else {
      flag.isEnabled = value;
      flag.updatedBy = req.user._id;
    }
    await flag.save();

    // Log Action to persistent AuditLog collection
    await AuditLog.create({
      adminId: req.user._id,
      action: 'FEATURE_FLAG_TOGGLE',
      details: `Toggle feature flag '${flagName}' to ${value}.`,
    });

    res.json({
      success: true,
      message: `Feature flag '${flagName}' successfully configured to ${value}.`,
      featureFlag: flag,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update system CMS content entries
// @route   PUT /api/admin/cms
// @access  Private (Admin)
export const updateCMS = async (req: AuthRequest, res: Response) => {
  try {
    const { key, content } = req.body;

    let page = await CmsPage.findOne({ key });
    if (!page) {
      page = new CmsPage({
        key,
        content,
        updatedBy: req.user._id,
      });
    } else {
      page.content = content;
      page.updatedBy = req.user._id;
    }
    await page.save();

    // Log Action to persistent AuditLog collection
    await AuditLog.create({
      adminId: req.user._id,
      action: 'CMS_UPDATE',
      details: `Updated global system CMS page: ${key}.`,
    });

    res.json({
      success: true,
      message: 'Global system CMS configurations synced successfully.',
      cmsPage: page,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

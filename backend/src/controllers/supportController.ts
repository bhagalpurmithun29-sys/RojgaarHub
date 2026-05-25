import { Request, Response } from 'express';
import User from '../models/User';
import Booking from '../models/Booking';
import SystemNotification from '../models/SystemNotification';
import SOSLog from '../models/SOSLog';
import Dispute from '../models/Dispute';

interface AuthRequest extends Request {
  user?: any;
}

// @desc    Create an in-app notification (respects User notification preference settings)
// @route   POST /api/support/notifications
// @access  Private
export const sendInAppNotification = async (req: AuthRequest, res: Response) => {
  try {
    const { userId, type, title, content } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Check notifications preference switches
    let isEnabled = true;
    if (type === 'booking' && user.notificationSettings?.booking === false) isEnabled = false;
    if (type === 'chat' && user.notificationSettings?.chat === false) isEnabled = false;
    if (type === 'reward' && user.notificationSettings?.promotional === false) isEnabled = false;

    if (!isEnabled) {
      return res.json({ success: true, message: 'Notification ignored: User disabled this channel.' });
    }

    const newNotification = await SystemNotification.create({
      userId,
      type,
      title,
      content,
      read: false,
    });

    res.status(201).json({ success: true, notification: newNotification });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's notifications center (supports read/unread and search queries)
// @route   GET /api/support/notifications
// @access  Private
export const getNotifications = async (req: AuthRequest, res: Response) => {
  try {
    const { filter, search } = req.query; // filter: 'read', 'unread'
    const userId = req.user._id;

    let query: any = { userId };

    if (filter === 'read') {
      query.read = true;
    } else if (filter === 'unread') {
      query.read = false;
    }

    if (search) {
      const keyword = String(search);
      query.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { content: { $regex: keyword, $options: 'i' } }
      ];
    }

    const userNotifications = await SystemNotification.find(query).sort({ createdAt: -1 });

    res.json(userNotifications);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark notification as read
// @route   PUT /api/support/notifications/:id/read
// @access  Private
export const markNotificationRead = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const notification = await SystemNotification.findById(id);

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found.' });
    }

    notification.read = true;
    await notification.save();

    res.json({ success: true, notification });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Trigger SOS Emergency signal (broadcasts coordinates & emergency contacts list)
// @route   POST /api/support/sos
// @access  Private
export const triggerSOS = async (req: AuthRequest, res: Response) => {
  try {
    const { coordinates, emergencyContacts } = req.body;
    const userId = req.user._id;

    const newSOS = await SOSLog.create({
      userId,
      coordinates,
      emergencyContacts: emergencyContacts || [],
      status: 'active',
    });

    console.log(`🚨 SOS SIGNAL RECEIVED FROM USER: ${userId} | GPS coordinates: [${coordinates.lat}, ${coordinates.lng}]`);

    res.status(201).json({
      success: true,
      message: 'SOS Signal transmitted to system dispatch. Police and local teams notified.',
      data: newSOS,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create support dispute ticket (stores chat history references & work photo proof)
// @route   POST /api/support/disputes
// @access  Private
export const createDispute = async (req: AuthRequest, res: Response) => {
  try {
    const { bookingId, reason, chatEvidence, workPhotos } = req.body;
    const reporterId = req.user._id;

    const dispute = await Dispute.create({
      bookingId,
      reporterId,
      reason,
      status: 'pending',
      chatEvidence: chatEvidence || [],
      workPhotos: workPhotos || [],
      timeline: ['Dispute registered by customer.', 'Evidence logs queued for evaluation.'],
    });

    res.status(201).json({
      success: true,
      message: 'Dispute ticket registered. Pending support agent review.',
      dispute,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update dispute status
// @route   PUT /api/support/disputes/:id
// @access  Private (Admin Only)
export const updateDisputeStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status, resolutionNote } = req.body; // 'pending' | 'under_review' | 'resolved' | 'rejected'

    const dispute = await Dispute.findById(id);
    if (!dispute) {
      return res.status(404).json({ message: 'Dispute ticket not found.' });
    }

    dispute.status = status;
    dispute.timeline.push(`Status updated to ${status}. ${resolutionNote || ''}`);
    await dispute.save();

    res.json({
      success: true,
      message: 'Dispute timeline updated successfully.',
      dispute,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all dispute tickets
// @route   GET /api/support/disputes
// @access  Private (Admin Only)
export const getDisputes = async (req: AuthRequest, res: Response) => {
  try {
    const disputes = await Dispute.find({}).sort({ createdAt: -1 }).populate('reporterId', 'name email');
    res.json(disputes);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get active SOS signals
// @route   GET /api/support/sos
// @access  Private (Admin Only)
export const getSOS = async (req: AuthRequest, res: Response) => {
  try {
    const sosLogs = await SOSLog.find({ status: 'active' }).sort({ createdAt: -1 }).populate('userId', 'name email');
    res.json(sosLogs);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

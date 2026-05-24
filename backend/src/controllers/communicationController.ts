import { Request, Response } from 'express';
import Message from '../models/Message';
import Booking, { BookingStatus } from '../models/Booking';
import User from '../models/User';
import BlockList from '../models/BlockList';
import AbuseReport from '../models/AbuseReport';

interface AuthRequest extends Request {
  user?: any;
}

// @desc    Send a message (validates Booking communication limits & executes AI spam/abuse scanning)
// @route   POST /api/communications/messages
// @access  Private
export const sendMessage = async (req: AuthRequest, res: Response) => {
  try {
    const { receiverId, bookingId, content, messageType, mediaUrl } = req.body;
    const senderId = req.user._id;

    // Check if receiver has blocked sender using dynamic database model query
    const hasBlocked = await BlockList.findOne({ blockerId: receiverId, blockedId: senderId });
    if (hasBlocked) {
      return res.status(403).json({ message: 'Access denied: You have been blocked by this user.' });
    }

    // Communication rules check based on Booking Status
    if (bookingId) {
      const booking = await Booking.findById(bookingId);
      if (!booking) {
        return res.status(404).json({ message: 'Booking reference not found.' });
      }

      if (booking.status === BookingStatus.CANCELLED) {
        return res.status(403).json({ message: 'Communication locked: This booking was cancelled.' });
      }

      if (booking.status === BookingStatus.COMPLETED) {
        // Enforce limited completed access window (Mock: allow only within 2 hours of completion)
        const completedAt = booking.updatedAt;
        const hoursElapsed = (Date.now() - completedAt.getTime()) / 1000 / 60 / 60;
        if (hoursElapsed > 2) {
          return res.status(403).json({ message: 'Communication locked: The 2-hour completion messaging window has expired.' });
        }
      }
    }

    // Simulated AI Spam & Abusive Language filter engine
    const abusiveKeywords = ['abuse', 'cheat', 'scam', 'fraud', 'fool', 'stupid', 'idiot'];
    const lowerContent = content.toLowerCase();
    
    let isSpam = false;
    let spamScore = 0;

    abusiveKeywords.forEach((word) => {
      if (lowerContent.includes(word)) {
        isSpam = true;
        spamScore += 30;
      }
    });

    if (lowerContent.includes('pay directly') || lowerContent.includes('offline payment') || lowerContent.includes('+91')) {
      isSpam = true;
      spamScore += 45; // Flags direct off-platform transactions attempts
    }

    const message = await Message.create({
      sender: senderId,
      receiver: receiverId,
      booking: bookingId || null,
      content,
      messageType: messageType || 'text',
      mediaUrl: mediaUrl || '',
      isSpam,
      spamScore,
      read: false,
    });

    res.status(201).json({
      success: true,
      message: isSpam ? 'Message flagged by AI Security Shield scan, pending inspection.' : 'Message delivered.',
      isSpam,
      spamScore,
      data: message,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get chat history between two users
// @route   GET /api/communications/chat/:receiverId
// @access  Private
export const getChatHistory = async (req: AuthRequest, res: Response) => {
  try {
    const { receiverId } = req.params;
    const { searchKeyword } = req.query;
    const senderId = req.user._id;

    let query: any = {
      $or: [
        { sender: senderId, receiver: receiverId, deletedForSender: false },
        { sender: receiverId, receiver: senderId, deletedForEveryone: false },
      ]
    };

    if (searchKeyword) {
      query.content = { $regex: searchKeyword, $options: 'i' };
    }

    const chatHistory = await Message.find(query).sort({ createdAt: 1 });

    res.json(chatHistory);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a message (Delete for me vs Delete for everyone)
// @route   DELETE /api/communications/messages/:id
// @access  Private
export const deleteMessage = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { deleteType } = req.body; // 'me' or 'everyone'
    const userId = req.user._id;

    const message = await Message.findById(id);
    if (!message) {
      return res.status(404).json({ message: 'Message not found.' });
    }

    if (deleteType === 'everyone') {
      if (message.sender.toString() !== userId.toString()) {
        return res.status(403).json({ message: 'Only sender can delete a message for everyone.' });
      }
      message.deletedForEveryone = true;
    } else {
      // Delete for me
      if (message.sender.toString() === userId.toString()) {
        message.deletedForSender = true;
      } else {
        // If current user is receiver
        message.deletedForEveryone = true; // Treats as soft deleted for receiver
      }
    }

    await message.save();

    res.json({
      success: true,
      message: `Message successfully deleted for ${deleteType === 'everyone' ? 'everyone' : 'me'}.`,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Block a user to prevent spam/abuse
// @route   POST /api/communications/block
// @access  Private
export const blockUser = async (req: AuthRequest, res: Response) => {
  try {
    const { targetUserId } = req.body;
    const senderId = req.user._id;

    // Create blocklist record inside database
    const blockEntry = await BlockList.findOneAndUpdate(
      { blockerId: senderId, blockedId: targetUserId },
      { blockerId: senderId, blockedId: targetUserId },
      { upsert: true, new: true }
    );

    res.json({
      success: true,
      message: 'User successfully added to blocked register.',
      data: blockEntry,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Report abusive message
// @route   POST /api/communications/report
// @access  Private
export const reportUser = async (req: AuthRequest, res: Response) => {
  try {
    const { targetUserId, reason, details } = req.body;
    const reporterId = req.user._id;

    const report = await AbuseReport.create({
      reporterId,
      targetUserId,
      reason,
      details: details || '',
    });

    res.json({
      success: true,
      message: 'Abuse report submitted. Admin support queued.',
      data: report,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

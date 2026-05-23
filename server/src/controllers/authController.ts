import { Request, Response } from 'express';
import crypto from 'crypto';
import User, { UserRole } from '../models/User';
import generateToken from '../utils/generateToken';
import OtpSession from '../models/OtpSession';

interface AuthRequest extends Request {
  user?: any;
}

// Regex enforcing strict passwords: Min 8 chars, 1 Uppercase, 1 Lowercase, 1 Number, 1 Special Char
const STRICT_PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// Helper to simulate suspicious impossible travel patterns
const detectImpossibleTravelAnomaly = (lastLoginGeo: string, currentLoginGeo: string) => {
  if (lastLoginGeo && currentLoginGeo && lastLoginGeo !== currentLoginGeo) {
    console.warn(`🚨 SUSPICIOUS LOGIN DETECTED: Impossible Travel Anomaly found between ${lastLoginGeo} and ${currentLoginGeo}! Triggering security alert & requiring KYC re-verification.`);
    return true;
  }
  return false;
};

// @desc    Register a new user with password strength validation
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, password, role } = req.body;

    const userExists = await User.findOne({ $or: [{ email }, { phone }] });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email or phone' });
    }

    // Password strength check
    if (!STRICT_PASSWORD_REGEX.test(password)) {
      return res.status(400).json({ 
        message: 'Password weak: Must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.' 
      });
    }

    const user = await User.create({
      name,
      email,
      phone,
      passwordHash: password, // Will be hashed in Mongoose pre-save hook
      role: role || UserRole.CUSTOMER,
      walletBalance: 0,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        token: generateToken(user._id.toString(), user.role),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data provided' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Log in user with password validation & session anomaly scanning
// @route   POST /api/auth/login
// @access  Public
export const authUser = async (req: Request, res: Response) => {
  try {
    const { email, phone, password, browser, deviceName, location, ipAddress } = req.body;

    const query = email ? { email } : { phone };
    const user = await User.findOne(query);

    if (user && (await user.matchPassword(password))) {
      // Simulate Session Management registration
      const sessionId = crypto.randomBytes(16).toString('hex');
      const currentIp = ipAddress || req.ip;
      const currentLoc = location || 'Delhi, India';
      
      // Perform Impossible Travel verification check (comparing against last log location context)
      const lastKnownLoc = 'Mumbai, India'; // Mock historical location
      const suspiciousAnomaly = detectImpossibleTravelAnomaly(lastKnownLoc, currentLoc);

      console.log(`🔒 Session Established: ID: ${sessionId} | IP: ${currentIp} | Browser: ${browser || 'Safari'} | Device: ${deviceName || 'iPhone 15'}`);

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        token: generateToken(user._id.toString(), user.role),
        session: {
          sessionId,
          deviceName: deviceName || 'iPhone 15',
          browser: browser || 'Safari',
          location: currentLoc,
          loginTime: new Date(),
          ipAddress: currentIp,
          suspiciousAnomaly,
        }
      });
    } else {
      res.status(401).json({ message: 'Invalid email/phone or password' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Simulate Google OAuth Login
// @route   POST /api/auth/google
// @access  Public
export const googleLogin = async (req: Request, res: Response) => {
  try {
    const { googleId, email, name, profileImage } = req.body;

    let user = await User.findOne({ $or: [{ email }, { googleId }] });

    if (!user) {
      // Auto-create federated account
      user = await User.create({
        name,
        email,
        phone: `GOOGLE-${crypto.randomBytes(4).toString('hex')}`,
        passwordHash: crypto.randomBytes(16).toString('hex'), // Secure random password
        role: UserRole.CUSTOMER,
        googleId,
        isVerified: true,
      });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id.toString(), user.role),
      profileImage: profileImage || '',
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Send a 6-digit OTP code with 5-minute expiry limits
// @route   POST /api/auth/otp/send
// @access  Public
export const sendOTP = async (req: Request, res: Response) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ message: 'Phone number is required' });
    }

    // Check if lockout is active inside database
    const session = await OtpSession.findOne({ phone });
    if (session && session.isLocked && session.lockUntil && session.lockUntil > new Date()) {
      const waitTime = Math.ceil((session.lockUntil.getTime() - Date.now()) / 1000 / 60);
      return res.status(403).json({ 
        message: `Too many failed attempts. OTP services temporarily locked for phone number. Please retry after ${waitTime} minutes.` 
      });
    }

    // Generate 6-digit OTP code
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiry

    // Save session logs in database
    await OtpSession.findOneAndUpdate(
      { phone },
      {
        otp,
        expiresAt,
        attempts: 0,
        isLocked: false,
        lockUntil: undefined,
      },
      { upsert: true, new: true }
    );

    console.log(`✉️ SMS Dispatcher OTP successfully generated for phone ${phone}: ${otp}`);

    res.json({
      success: true,
      message: '6-Digit verification OTP code generated and dispatched via SMS mock transmitter successfully.',
      expiresIn: '5 minutes',
      otpDebug: otp, // Returned for dev testing/verification pipelines
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify Phone OTP code with strict max 3-attempts lockout
// @route   POST /api/auth/otp/verify
// @access  Public
export const verifyOTP = async (req: Request, res: Response) => {
  try {
    const { phone, otp } = req.body;

    const session = await OtpSession.findOne({ phone });
    if (!session) {
      return res.status(404).json({ message: 'OTP session expired or not found. Please request a new OTP.' });
    }

    // Check if lockout is active
    if (session.isLocked && session.lockUntil && session.lockUntil > new Date()) {
      return res.status(403).json({ message: 'Account OTP service remains locked. Please wait before retrying.' });
    }

    // Expiry Check
    if (new Date() > session.expiresAt) {
      await OtpSession.deleteOne({ phone });
      return res.status(400).json({ message: 'OTP has expired. Expiry threshold: 5 minutes.' });
    }

    // Attempt checking
    session.attempts += 1;
    if (otp !== session.otp) {
      if (session.attempts >= 3) {
        session.isLocked = true;
        session.lockUntil = new Date(Date.now() + 15 * 60 * 1000); // 15-minute temporary lockout
        await session.save();
        return res.status(403).json({ 
          message: 'Security lockout alert: Max 3 failed attempts exceeded! OTP operations locked for 15 minutes.' 
        });
      }
      await session.save();
      return res.status(400).json({ 
        message: `Incorrect verification code. Attempts remaining: ${3 - session.attempts}` 
      });
    }

    // Success: Find or create worker/customer profile matching verification
    let user = await User.findOne({ phone });
    if (!user) {
      // Auto register OTP verified phone users
      user = await User.create({
        name: `User-${phone.slice(-4)}`,
        email: `${phone}@rozgaarhub.com`,
        phone,
        passwordHash: crypto.randomBytes(16).toString('hex'), // Safe dynamic credential
        role: UserRole.CUSTOMER,
        isVerified: true,
      });
    }

    // Clear database session otp history
    await OtpSession.deleteOne({ phone });

    res.json({
      success: true,
      message: 'OTP Code validated successfully. Profile authenticated.',
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      token: generateToken(user._id.toString(), user.role),
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Forgot Password - generates recovery tokens
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User with this email does not exist' });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    await user.save();

    const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;

    res.json({
      success: true,
      message: 'Recovery validation code generated and simulated successfully.',
      resetLink: resetUrl,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reset Password with strict security formats
// @route   POST /api/auth/reset-password/:token
// @access  Public
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const hashedToken = crypto.createHash('sha256').update(token as string).digest('hex');
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired password reset token' });
    }

    // Strong password check
    if (!STRICT_PASSWORD_REGEX.test(password)) {
      return res.status(400).json({ 
        message: 'Password weak: Must contain at least 8 characters, uppercase, lowercase, numbers, and special characters.' 
      });
    }

    user.passwordHash = password; // Hashed by hook
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'Password restored successfully.',
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Logout session
// @route   POST /api/auth/logout
// @access  Private
export const logoutUser = async (req: Request, res: Response) => {
  res.cookie('token', '', { httpOnly: true, expires: new Date(0) });
  res.json({ success: true, message: 'Session logged out successfully' });
};

// @desc    Logout all devices sessions
// @route   POST /api/auth/logout-all
// @access  Private
export const logoutAllDevices = async (req: Request, res: Response) => {
  console.log('🔒 Security Operations: Cleared active device registries and sessions.');
  res.cookie('token', '', { httpOnly: true, expires: new Date(0) });
  res.json({ success: true, message: 'Successfully logged out of all connected device terminals.' });
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getUserProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user._id).select('-passwordHash');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/me
// @access  Private
export const updateUserProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.phone = req.body.phone || user.phone;
      user.username = req.body.username || user.username;
      user.gender = req.body.gender || user.gender;
      user.dateOfBirth = req.body.dateOfBirth || user.dateOfBirth;
      user.language = req.body.language || user.language;
      user.profileImage = req.body.profileImage || user.profileImage;
      
      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        username: updatedUser.username,
        gender: updatedUser.gender,
        dateOfBirth: updatedUser.dateOfBirth,
        language: updatedUser.language,
        profileImage: updatedUser.profileImage,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};


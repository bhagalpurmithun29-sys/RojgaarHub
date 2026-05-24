"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.forgotPassword = exports.authUser = exports.registerUser = void 0;
const crypto_1 = __importDefault(require("crypto"));
const User_1 = __importDefault(require("../models/User"));
const generateToken_1 = __importDefault(require("../utils/generateToken"));
const registerUser = async (req, res) => {
    try {
        const { name, email, phone, password, role } = req.body;
        const userExists = await User_1.default.findOne({ $or: [{ email }, { phone }] });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const user = await User_1.default.create({
            name,
            email,
            phone,
            passwordHash: password, // Will be hashed in the pre-save hook
            role: role || 'customer',
        });
        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                token: (0, generateToken_1.default)(user._id.toString(), user.role),
            });
        }
        else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.registerUser = registerUser;
const authUser = async (req, res) => {
    try {
        const { email, phone, password } = req.body;
        const query = email ? { email } : { phone };
        const user = await User_1.default.findOne(query);
        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                token: (0, generateToken_1.default)(user._id.toString(), user.role),
            });
        }
        else {
            res.status(401).json({ message: 'Invalid email/phone or password' });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.authUser = authUser;
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User_1.default.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User with this email does not exist' });
        }
        // Generate reset token
        const resetToken = crypto_1.default.randomBytes(20).toString('hex');
        // Hash token and set to resetPasswordToken field in DB
        user.resetPasswordToken = crypto_1.default.createHash('sha256').update(resetToken).digest('hex');
        // Set expire to 10 minutes
        user.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000);
        await user.save();
        // Create reset URL
        const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;
        // Normally we send email, here we simulate it and send reset link back in response for demonstration/testing
        res.json({
            success: true,
            message: 'Password reset link generated and simulated successfully',
            resetLink: resetUrl, // Highly useful for dev debugging
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.forgotPassword = forgotPassword;
const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;
        const hashedToken = crypto_1.default.createHash('sha256').update(token).digest('hex');
        const user = await User_1.default.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: { $gt: new Date() },
        });
        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired password reset token' });
        }
        // Set new password (will be hashed in the pre-save hook)
        user.passwordHash = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();
        res.json({
            success: true,
            message: 'Password reset successfully',
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.resetPassword = resetPassword;

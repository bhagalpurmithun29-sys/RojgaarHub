"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSystemStats = void 0;
const User_1 = __importStar(require("../models/User"));
const LabourProfile_1 = __importDefault(require("../models/LabourProfile"));
const Booking_1 = __importStar(require("../models/Booking"));
const getSystemStats = async (req, res) => {
    try {
        const totalUsers = await User_1.default.countDocuments({ role: User_1.UserRole.CUSTOMER });
        const totalLabourers = await User_1.default.countDocuments({ role: User_1.UserRole.LABOUR });
        const activeBookings = await Booking_1.default.countDocuments({ status: { $nin: [Booking_1.BookingStatus.COMPLETED, Booking_1.BookingStatus.CANCELLED, Booking_1.BookingStatus.REJECTED] } });
        // Simplistic revenue calculation for demo
        const completedBookings = await Booking_1.default.find({ status: Booking_1.BookingStatus.COMPLETED });
        const revenue = completedBookings.reduce((acc, curr) => acc + (curr.totalAmount * 0.1), 0); // Assuming 10% platform fee
        const pendingKyc = await LabourProfile_1.default.find({ kycStatus: 'pending' }).populate('user', 'name');
        res.json({
            stats: {
                totalUsers,
                totalLabourers,
                activeBookings,
                revenue
            },
            pendingKyc
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getSystemStats = getSystemStats;

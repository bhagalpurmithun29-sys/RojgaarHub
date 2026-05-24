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
const mongoose_1 = __importDefault(require("mongoose"));
const User_1 = __importStar(require("../models/User"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const seedAdmin = async () => {
    try {
        const adminEmail = 'admin@rozgaarhub.com';
        const existingAdmin = await User_1.default.findOne({ email: adminEmail });
        if (!existingAdmin) {
            const salt = await bcryptjs_1.default.genSalt(10);
            const passwordHash = await bcryptjs_1.default.hash('Admin@123', salt);
            await User_1.default.create({
                name: 'System Admin',
                email: adminEmail,
                phone: '9999999999',
                passwordHash: passwordHash,
                role: User_1.UserRole.ADMIN,
                isVerified: true,
                walletBalance: 100000
            });
            console.log('✅ Default fixed Admin account seeded successfully: admin@rozgaarhub.com / Admin@123');
        }
    }
    catch (err) {
        console.error(`Admin seeding failed: ${err.message}`);
    }
};
const connectDB = async () => {
    try {
        const conn = await mongoose_1.default.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/rozgaarhub');
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        await seedAdmin();
    }
    catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};
exports.default = connectDB;

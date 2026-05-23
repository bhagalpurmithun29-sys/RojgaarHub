import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export enum UserRole {
  CUSTOMER = 'customer',
  LABOUR = 'labour',
  CONTRACTOR = 'contractor',
  ADMIN = 'admin',
}

export interface IUser extends Document {
  name: string;
  email: string;
  phone: string;
  passwordHash: string;
  role: UserRole;
  isVerified: boolean;
  walletBalance: number;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  googleId?: string;
  profileImage?: string;
  language?: string;
  username?: string;
  gender?: string;
  dateOfBirth?: Date;
  kycStatus?: string;
  trustScore?: number;
  reliabilityScore?: number;
  status?: string;
  statistics?: {
    totalBookings: number;
    activeBookings: number;
    completedBookings: number;
    cancelledBookings: number;
    totalSpent: number;
    favouriteLabourCount: number;
  };
  rating?: number;
  reviewsReceived?: number;
  cancellationRate?: number;
  notificationSettings?: {
    booking: boolean;
    chat: boolean;
    promotional: boolean;
  };
  matchPassword(enteredPassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.CUSTOMER,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    walletBalance: {
      type: Number,
      default: 0,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpire: {
      type: Date,
    },
    googleId: {
      type: String,
      default: '',
    },
    profileImage: {
      type: String,
      default: '',
    },
    username: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other', 'prefer_not_to_say'],
    },
    dateOfBirth: {
      type: Date,
    },
    kycStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    trustScore: {
      type: Number,
      default: 0,
    },
    reliabilityScore: {
      type: Number,
      default: 0,
    },
    language: {
      type: String,
      default: 'en',
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'suspended', 'deleted'],
      default: 'active',
    },
    statistics: {
      totalBookings: { type: Number, default: 0 },
      activeBookings: { type: Number, default: 0 },
      completedBookings: { type: Number, default: 0 },
      cancelledBookings: { type: Number, default: 0 },
      totalSpent: { type: Number, default: 0 },
      favouriteLabourCount: { type: Number, default: 0 },
    },
    rating: {
      type: Number,
      default: 0,
    },
    reviewsReceived: {
      type: Number,
      default: 0,
    },
    cancellationRate: {
      type: Number,
      default: 0,
    },
    notificationSettings: {
      booking: { type: Boolean, default: true },
      chat: { type: Boolean, default: true },
      promotional: { type: Boolean, default: true },
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.matchPassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.passwordHash);
};

// Encrypt password using bcrypt
userSchema.pre('save', async function () {
  if (!this.isModified('passwordHash')) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
});

const User = mongoose.model<IUser>('User', userSchema);
export default User;

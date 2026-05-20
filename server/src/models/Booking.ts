import mongoose, { Document, Schema } from 'mongoose';

export enum BookingStatus {
  REQUESTED = 'requested',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  ASSIGNED = 'assigned',
  ON_THE_WAY = 'on_the_way',
  ARRIVED = 'arrived',
  WORK_STARTED = 'work_started',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export interface IBooking extends Document {
  customer: mongoose.Types.ObjectId;
  labour: mongoose.Types.ObjectId; // Primary assigned labour worker
  labourIds: mongoose.Types.ObjectId[]; // Array support for Multi-Labour and Contractor-Team bookings
  status: BookingStatus;
  bookingType: 'hourly' | 'daily' | 'project' | 'emergency' | 'multi-labour' | 'contractor-team';
  date: Date;
  timeSlot: string;
  address: string;
  totalAmount: number;
  otps: {
    arrivalOTP: string;
    startOTP: string;
    completeOTP: string;
  };
  paymentStatus: 'pending' | 'completed' | 'refunded';
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new Schema<IBooking>(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    labour: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    labourIds: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      }
    ],
    status: {
      type: String,
      enum: Object.values(BookingStatus),
      default: BookingStatus.REQUESTED,
    },
    bookingType: {
      type: String,
      enum: ['hourly', 'daily', 'project', 'emergency', 'multi-labour', 'contractor-team'],
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    timeSlot: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    otps: {
      arrivalOTP: { type: String },
      startOTP: { type: String },
      completeOTP: { type: String },
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'refunded'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

const Booking = mongoose.model<IBooking>('Booking', bookingSchema);
export default Booking;

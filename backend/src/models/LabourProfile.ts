import mongoose, { Document, Schema } from 'mongoose';

export interface ICategoryExperience {
  category: string;
  years: number;
}

export interface IReview {
  reviewerName: string;
  rating: number;
  comment: string;
  date: Date;
}

export interface IBeforeAfter {
  before: string;
  after: string;
}

export interface IProject {
  title: string;
  description: string;
  images: string[];
}

export interface ILabourProfile extends Document {
  user: mongoose.Types.ObjectId;
  profilePhoto?: string;
  name: string;
  phone: string;
  category: string;
  skills: string[];
  experienceYears: number;
  categoryWiseExperience: ICategoryExperience[];
  location: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  serviceAreas: string[];
  workingDays: string[];
  timeSlots: string[];
  hourlyRate?: number;
  dailyRate?: number;
  projectRate?: number;
  languagesKnown: string[];
  ratings: number;
  totalReviews: number;
  reviewsList: IReview[];
  portfolio: string[];
  workPhotos: string[];
  beforeAfterImages: IBeforeAfter[];
  previousProjects: IProject[];
  certificates: string[];
  aadhaarCard?: string;
  panCard?: string;
  jobsCompleted: number;
  responseTime: string;
  cancellationRate: number;
  reliabilityScore: number;
  trustScore: number;
  backgroundScore: number;
  verificationBadge: boolean;
  skillBadges: string[];
  availabilityStatus: boolean;
  kycStatus: 'pending' | 'approved' | 'rejected';
}

const categoryExperienceSchema = new Schema<ICategoryExperience>({
  category: { type: String, required: true },
  years: { type: Number, required: true }
}, { _id: false });

const reviewSchema = new Schema<IReview>({
  reviewerName: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  date: { type: Date, default: Date.now }
}, { _id: false });

const beforeAfterSchema = new Schema<IBeforeAfter>({
  before: { type: String, required: true },
  after: { type: String, required: true }
}, { _id: false });

const projectSchema = new Schema<IProject>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  images: [{ type: String }]
}, { _id: false });

const labourProfileSchema = new Schema<ILabourProfile>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    profilePhoto: {
      type: String,
      default: '',
    },
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    skills: [
      {
        type: String,
      },
    ],
    experienceYears: {
      type: Number,
      required: true,
      default: 0,
    },
    categoryWiseExperience: [categoryExperienceSchema],
    location: {
      address: String,
      city: String,
      state: String,
      zipCode: String,
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },
    serviceAreas: [
      {
        type: String,
      },
    ],
    workingDays: [
      {
        type: String,
      },
    ],
    timeSlots: [
      {
        type: String,
      },
    ],
    hourlyRate: Number,
    dailyRate: Number,
    projectRate: Number,
    languagesKnown: [
      {
        type: String,
      },
    ],
    ratings: {
      type: Number,
      default: 5.0,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    reviewsList: [reviewSchema],
    portfolio: [
      {
        type: String,
      },
    ],
    workPhotos: [
      {
        type: String,
      },
    ],
    beforeAfterImages: [beforeAfterSchema],
    previousProjects: [projectSchema],
    certificates: [
      {
        type: String,
      },
    ],
    aadhaarCard: {
      type: String,
    },
    panCard: {
      type: String,
    },
    jobsCompleted: {
      type: Number,
      default: 0,
    },
    responseTime: {
      type: String,
      default: '15 mins',
    },
    cancellationRate: {
      type: Number,
      default: 0, // percentage
    },
    reliabilityScore: {
      type: Number,
      default: 100, // 0-100
    },
    trustScore: {
      type: Number,
      default: 100, // 0-100
    },
    backgroundScore: {
      type: Number,
      default: 100, // 0-100
    },
    verificationBadge: {
      type: Boolean,
      default: false,
    },
    skillBadges: [
      {
        type: String,
      },
    ],
    availabilityStatus: {
      type: Boolean,
      default: true,
    },
    kycStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

const LabourProfile = mongoose.model<ILabourProfile>('LabourProfile', labourProfileSchema);
export default LabourProfile;

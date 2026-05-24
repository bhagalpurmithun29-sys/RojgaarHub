import { Request, Response } from 'express';
import LabourProfile from '../models/LabourProfile';
import User from '../models/User';

interface AuthRequest extends Request {
  user?: any; // Ideally this should be the IUser interface
}

// @desc    Update or Create Labour Profile
// @route   POST /api/profiles
// @access  Private (Labour/Contractor)
export const upsertProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user._id;
    const {
      category,
      skills,
      experienceYears,
      location,
      serviceAreas,
      hourlyRate,
      dailyRate,
    } = req.body;

    // Validate user role
    if (req.user.role !== 'labour' && req.user.role !== 'contractor') {
      return res.status(403).json({ message: 'Only labour or contractor can create a profile' });
    }

    let profile = await LabourProfile.findOne({ user: userId });

    if (profile) {
      // Update
      profile.category = category || profile.category;
      profile.skills = skills || profile.skills;
      profile.experienceYears = experienceYears || profile.experienceYears;
      profile.location = location || profile.location;
      profile.serviceAreas = serviceAreas || profile.serviceAreas;
      profile.hourlyRate = hourlyRate || profile.hourlyRate;
      profile.dailyRate = dailyRate || profile.dailyRate;

      const updatedProfile = await profile.save();
      res.json(updatedProfile);
    } else {
      // Create
      const newProfile = await LabourProfile.create({
        user: userId,
        category,
        skills,
        experienceYears,
        location,
        serviceAreas,
        hourlyRate,
        dailyRate,
      });
      res.status(201).json(newProfile);
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Labour Profile by User ID
// @route   GET /api/profiles/:id
// @access  Public
export const getProfileById = async (req: Request, res: Response) => {
  try {
    const profile = await LabourProfile.findOne({ user: req.params.id }).populate('user', 'name email phone isVerified');
    
    if (profile) {
      res.json(profile);
    } else {
      res.status(404).json({ message: 'Profile not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Upload KYC Documents
// @route   POST /api/profiles/kyc
// @access  Private (Labour/Contractor)
export const uploadKYC = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user._id;
    const { aadhaarUrl, panUrl } = req.body;
    
    let profile = await LabourProfile.findOne({ user: userId });

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found. Create profile first.' });
    }

    if (aadhaarUrl) profile.aadhaarCard = aadhaarUrl;
    if (panUrl) profile.panCard = panUrl;
    profile.kycStatus = 'pending';
    
    await profile.save();

    res.json({ message: 'KYC documents uploaded successfully. Pending verification.', status: profile.kycStatus, profile });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Search Labour Profiles
// @route   GET /api/profiles/search
// @access  Public
export const searchProfiles = async (req: Request, res: Response) => {
  try {
    const { category, keyword, minExperience } = req.query;

    let query: any = { availabilityStatus: true };

    if (category) {
      query.category = { $regex: category, $options: 'i' };
    }

    if (minExperience) {
      query.experienceYears = { $gte: Number(minExperience) };
    }

    // We can expand this query to include geospatial search for location
    // Currently doing a basic search

    const profiles = await LabourProfile.find(query)
      .populate('user', 'name isVerified')
      .sort({ ratings: -1 }); // Default sort by rating

    res.json(profiles);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

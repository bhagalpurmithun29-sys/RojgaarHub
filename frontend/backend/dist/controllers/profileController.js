"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchProfiles = exports.uploadKYC = exports.getProfileById = exports.upsertProfile = void 0;
const LabourProfile_1 = __importDefault(require("../models/LabourProfile"));
// @desc    Update or Create Labour Profile
// @route   POST /api/profiles
// @access  Private (Labour/Contractor)
const upsertProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const { category, skills, experienceYears, location, serviceAreas, hourlyRate, dailyRate, } = req.body;
        // Validate user role
        if (req.user.role !== 'labour' && req.user.role !== 'contractor') {
            return res.status(403).json({ message: 'Only labour or contractor can create a profile' });
        }
        let profile = await LabourProfile_1.default.findOne({ user: userId });
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
        }
        else {
            // Create
            const newProfile = await LabourProfile_1.default.create({
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
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.upsertProfile = upsertProfile;
// @desc    Get Labour Profile by User ID
// @route   GET /api/profiles/:id
// @access  Public
const getProfileById = async (req, res) => {
    try {
        const profile = await LabourProfile_1.default.findOne({ user: req.params.id }).populate('user', 'name email phone isVerified');
        if (profile) {
            res.json(profile);
        }
        else {
            res.status(404).json({ message: 'Profile not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getProfileById = getProfileById;
// @desc    Upload KYC Documents (Mocked for now)
// @route   POST /api/profiles/kyc
// @access  Private (Labour/Contractor)
const uploadKYC = async (req, res) => {
    try {
        const userId = req.user._id;
        // In a real scenario, handle file uploads (multer) and store in S3/Cloudinary
        // Here we will just update the status to pending
        let profile = await LabourProfile_1.default.findOne({ user: userId });
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found. Create profile first.' });
        }
        profile.kycStatus = 'pending';
        await profile.save();
        res.json({ message: 'KYC documents uploaded successfully. Pending verification.', status: profile.kycStatus });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.uploadKYC = uploadKYC;
// @desc    Search Labour Profiles
// @route   GET /api/profiles/search
// @access  Public
const searchProfiles = async (req, res) => {
    try {
        const { category, keyword, minExperience } = req.query;
        let query = { availabilityStatus: true };
        if (category) {
            query.category = { $regex: category, $options: 'i' };
        }
        if (minExperience) {
            query.experienceYears = { $gte: Number(minExperience) };
        }
        // We can expand this query to include geospatial search for location
        // Currently doing a basic search
        const profiles = await LabourProfile_1.default.find(query)
            .populate('user', 'name isVerified')
            .sort({ ratings: -1 }); // Default sort by rating
        res.json(profiles);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.searchProfiles = searchProfiles;

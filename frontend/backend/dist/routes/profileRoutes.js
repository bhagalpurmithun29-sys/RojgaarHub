"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const profileController_1 = require("../controllers/profileController");
const router = express_1.default.Router();
router.post('/', authMiddleware_1.protect, profileController_1.upsertProfile);
router.post('/kyc', authMiddleware_1.protect, profileController_1.uploadKYC);
router.get('/search', profileController_1.searchProfiles);
router.get('/:id', profileController_1.getProfileById);
exports.default = router;

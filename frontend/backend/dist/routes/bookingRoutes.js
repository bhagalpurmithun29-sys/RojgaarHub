"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const bookingController_1 = require("../controllers/bookingController");
const router = express_1.default.Router();
router.post('/', authMiddleware_1.protect, bookingController_1.createBooking);
router.get('/', authMiddleware_1.protect, bookingController_1.getMyBookings);
router.put('/:id/respond', authMiddleware_1.protect, bookingController_1.respondToBooking);
router.put('/:id/status', authMiddleware_1.protect, bookingController_1.updateBookingStatus);
exports.default = router;

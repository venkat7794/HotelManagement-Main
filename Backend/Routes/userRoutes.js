import express from 'express';
import { registerUser, loginUser, getUserProfile, createBooking, getUserBookings, getAvailableRooms } from '../Controllers/userController.js';
import { authUser } from '../Middlewares/authUser.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', authUser, getUserProfile);
router.post('/bookings', authUser, createBooking);
router.get('/bookings', authUser, getUserBookings);
router.get('/rooms', authUser, getAvailableRooms);
export default router;
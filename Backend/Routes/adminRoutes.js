import express from 'express';
import {
  loginAdmin,
  getAllBookings,
  updateBookingStatus,
  deleteBooking,
  addRoom,
  getAllRooms,
  deleteRoom,
  updateRoom,
  addRoomsBulk,
  getDashboardStats,
} from '../Controllers/adminController.js';
import { authUser } from '../Middlewares/authUser.js';
import { authAdmin } from '../Middlewares/authAdmin.js';
import { uploadRoomImage } from '../utils/upload.js';

const router = express.Router();

router.post('/login', loginAdmin);
router.get('/bookings', authUser, authAdmin, getAllBookings);
router.put('/bookings/status', authUser, authAdmin, updateBookingStatus);
router.delete('/bookings/:bookingId', authUser, authAdmin, deleteBooking);
router.post('/rooms', authUser, authAdmin, uploadRoomImage, addRoom);
router.post('/rooms/bulk', authUser, authAdmin, addRoomsBulk);
router.get('/rooms', authUser, authAdmin, getAllRooms);
router.delete('/rooms/:roomId', authUser, authAdmin, deleteRoom);
router.put('/rooms/:roomId', authUser, authAdmin, uploadRoomImage, updateRoom);
router.get('/dashboard', authUser, authAdmin, getDashboardStats);
export default router;
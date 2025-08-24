import User from '../Models/userModel.js';
import Booking from '../Models/bookingModel.js';
import Room from '../Models/roomModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import FenwickTree from '../utils/fenwicktree.js';

dotenv.config();

let fenwickTree;


export const initializeFenwickTree = async () => {
  try {
    fenwickTree = new FenwickTree(365); 
    const bookings = await Booking.find();
    bookings.forEach((booking) => {
      const checkInDay = new Date(booking.checkIn).getDate();
      fenwickTree.update(checkInDay, 1); 
    });
    console.log('Fenwick Tree initialized with existing bookings');
  } catch (error) {
    console.error('Error initializing Fenwick Tree:', error.message);
  }
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User registered' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id, role: 'user' }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ success: true, message: 'User login successful', token });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const createBooking = async (req, res) => {
  try {
    const { roomId, checkIn, checkOut } = req.body;
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    // Prevent overlapping bookings using actual Date values
    const existingBookings = await Booking.find({
      roomId,
      $or: [
        { checkIn: { $lt: checkOutDate, $gte: checkInDate } },
        { checkOut: { $gt: checkInDate, $lte: checkOutDate } },
        { checkIn: { $lte: checkInDate }, checkOut: { $gte: checkOutDate } },
      ],
    });

    if (existingBookings.length > 0) {
      return res.status(400).json({ message: 'Room is unavailable for the selected dates' });
    }

    const days = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    if (days <= 0) {
      return res.status(400).json({ message: 'Check-out date must be after check-in date' });
    }

    const checkInDay = checkInDate.getDate();
    const demand = fenwickTree ? fenwickTree.getRangeSum(checkInDay, checkInDay) : 0;
    const priceAdjustment = 1 + demand * 0.1; // 10% per booking starting that day
    room.currentPrice = room.basePrice * priceAdjustment;
    const totalPrice = room.currentPrice * days;

    const booking = new Booking({
      userId: req.user.id,
      roomId,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      totalPrice,
      status: 'confirmed',
    });

    await booking.save();

    if (fenwickTree) {
      fenwickTree.update(checkInDay, 1);
    }
    await room.save();

    res.status(201).json({ message: 'Booking created', booking });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id })
      .populate('roomId', 'roomNumber type currentPrice');
    res.status(200).json({ message: 'Bookings retrieved', bookings });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getAvailableRooms = async (req, res) => {
  try {
    const rooms = await Room.find({ isAvailable: true });
    res.status(200).json({ message: 'Available rooms retrieved', rooms });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
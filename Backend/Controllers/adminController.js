import Booking from '../Models/bookingModel.js';
import Room from '../Models/roomModel.js';
import User from '../Models/userModel.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Debug logs (remove in production)
    console.log("Frontend email:", email, "Frontend password:", password);
    console.log("ENV email:", process.env.ADMIN_EMAIL, "ENV password:", process.env.ADMIN_PASSWORD);

    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = jwt.sign({ email, role: 'admin' }, process.env.JWT_SECRET || "defaultSecret", { expiresIn: '1h' });
      return res.json({ success: true, message: 'Admin login successful', token });
    }
    res.status(401).json({ success: false, message: 'Invalid admin credentials' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('userId', 'name email')
      .populate('roomId', 'roomNumber currentPrice');
    res.status(200).json({ success: true, message: 'Bookings retrieved', count: bookings.length, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const addRoomsBulk = async (req, res) => {
  try {
    const { rooms } = req.body;
    if (!Array.isArray(rooms) || rooms.length === 0) {
      return res.status(400).json({ success: false, message: 'Rooms array is required' });
    }

    const allowedTypes = ['single', 'double', 'suite', 'deluxe'];
    const docs = rooms.map((r) => {
      if (!r?.roomNumber || !r?.type || r.basePrice == null || r.capacity == null) {
        throw new Error('Each room must include roomNumber, type, basePrice, capacity');
      }
      if (!allowedTypes.includes(r.type)) {
        throw new Error(`Invalid type: ${r.type}`);
      }
      const basePriceNum = Number(r.basePrice);
      const capacityNum = Number(r.capacity);
      if (Number.isNaN(basePriceNum) || Number.isNaN(capacityNum)) {
        throw new Error('basePrice and capacity must be numbers');
      }
      return {
        roomNumber: String(r.roomNumber),
        type: r.type,
        basePrice: basePriceNum,
        currentPrice: basePriceNum,
        capacity: capacityNum,
        description: r.description || '',
        isAvailable: true,
      };
    });

    const created = await Room.insertMany(docs, { ordered: false });
    res.status(201).json({ success: true, message: 'Rooms added', count: created.length, rooms: created });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const { bookingId, status } = req.body;
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    const validStatuses = ['pending', 'confirmed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    booking.status = status;
    await booking.save();

    if (status === 'cancelled') {
      await Room.findByIdAndUpdate(booking.roomId, { isAvailable: true });
    }

    res.status(200).json({ success: true, message: 'Booking status updated', booking });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({success: false, message: 'Booking not found' });

    await Booking.findByIdAndDelete(bookingId);
    await Room.findByIdAndUpdate(booking.roomId, { isAvailable: true });

    res.status(200).json({ success: true, message: 'Booking deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const addRoom = async (req, res) => {
  try {
    const { roomNumber, type, basePrice, capacity, description } = req.body;
    const imageUrl = req.file ? `/uploads/rooms/${req.file.filename}` : undefined;
    const room = new Room({
      roomNumber,
      type,
      basePrice,
      currentPrice: basePrice,
      capacity,
      description,
      imageUrl,
      isAvailable: true,
    });
    await room.save();
    res.status(201).json({ success: true, message: 'Room added', room });
  } catch (error) {
    res.status(500).json({success: false, message: 'Server error', error: error.message });
  }
};

export const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find();
    res.status(200).json({success: true, message: 'Rooms retrieved', rooms });
  } catch (error) {
    res.status(500).json({success: false, message: 'Server error', error: error.message });
  }
};


export const deleteRoom = async (req, res) => {
    try {
      const { roomId } = req.params;
      const room = await Room.findById(roomId);
      if (!room) return res.status(404).json({ success: false, message: 'Room not found' });
  
      await Room.findByIdAndDelete(roomId);
      res.status(200).json({ success: true, message: 'Room deleted' });
    } catch (error) {
      res.status(500).json({success: false, message: 'Server error', error: error.message });
    }
  };
  
  export const updateRoom = async (req, res) => {
    try {
      const { roomId } = req.params;
      const { roomNumber, type, basePrice, capacity, description } = req.body;
      const room = await Room.findById(roomId);
      if (!room) return res.status(404).json({ success: false, message: 'Room not found' });
  
      room.roomNumber = roomNumber || room.roomNumber;
      room.type = type || room.type;
      room.basePrice = basePrice || room.basePrice;
      room.currentPrice = basePrice || room.currentPrice; 
      room.capacity = capacity || room.capacity;
      room.description = description || room.description;
      if (req.file) {
        room.imageUrl = `/uploads/rooms/${req.file.filename}`;
      }
  
      await room.save();
      res.status(200).json({ success: true, message: 'Room updated', room });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
  };
  
  export const getDashboardStats = async (req, res) => {
    try {
      const totalUsers = await User.countDocuments();
      const totalBookings = await Booking.countDocuments();
      const totalRevenue = await Booking.aggregate([
        { $match: { status: 'confirmed' } },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } },
      ]);
  
      res.status(200).json({
        success: true,
        totalUsers,
        totalBookings,
        totalRevenue: totalRevenue[0]?.total || 0,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
  };
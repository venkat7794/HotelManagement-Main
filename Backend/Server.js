import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/Mongodb.js';
import userRoutes from './Routes/userRoutes.js';
import adminRoutes from './Routes/adminRoutes.js';
import { initializeFenwickTree } from './Controllers/userController.js';
import Room from './Models/roomModel.js';
import path from 'path';

dotenv.config();

const app = express();
const port = process.env.PORT || 5776;

connectDB();

app.use(cors({ 
  origin: ['http://localhost:5173', 'https://hotel-management-frontend-blush.vercel.app'], 
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  credentials: true 
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Serve uploaded images statically
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

// Seed a few rooms on empty DB so frontend has real data to work with
const seedRoomsIfEmpty = async () => {
  try {
    const count = await Room.countDocuments();
    if (count === 0) {
      await Room.insertMany([
        {
          roomNumber: '101',
          type: 'single',
          basePrice: 80,
          currentPrice: 80,
          capacity: 1,
          description: 'Cozy single room with Wi‑Fi and breakfast.',
          isAvailable: true,
        },
        {
          roomNumber: '202',
          type: 'double',
          basePrice: 120,
          currentPrice: 120,
          capacity: 2,
          description: 'Comfortable double room for two guests.',
          isAvailable: true,
        },
        {
          roomNumber: '305',
          type: 'deluxe',
          basePrice: 200,
          currentPrice: 200,
          capacity: 4,
          description: 'Deluxe suite with lounge and city view.',
          isAvailable: true,
        },
      ]);
      console.log('Seeded default rooms');
    }
  } catch (error) {
    console.error('Error seeding rooms:', error.message);
  }
};

app.listen(port, async () => {
  await seedRoomsIfEmpty();
  await initializeFenwickTree();
  console.log(`App is listening on port ${port}`);
});

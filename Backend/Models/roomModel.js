import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema(
  {
    roomNumber: { type: String, required: true, unique: true, trim: true },
    type: { type: String, enum: ['single', 'double', 'suite', 'deluxe'], required: true },
    basePrice: { type: Number, required: true, min: 0 },
    currentPrice: { type: Number, required: true, min: 0 },
    capacity: { type: Number, required: true, min: 1 },
    isAvailable: { type: Boolean, default: true },
    description: { type: String, trim: true },
    imageUrl: { type: String, trim: true },
  },
  { timestamps: true }
);

const Room = mongoose.models.Room || mongoose.model('Room', roomSchema);
export default Room;
import { useState } from 'react';
import { addRoom } from '../../Utils/api';
import Sidebar from '../../Components/Sidebar';
import toast from 'react-hot-toast';

const AddRoom = () => {
  const [roomData, setRoomData] = useState({
    roomNumber: '',
    type: 'single',
    basePrice: '',
    capacity: '',
    description: '',
  });
  const [imageFile, setImageFile] = useState(null);


  const handleChange = (e) => setRoomData({ ...roomData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.entries(roomData).forEach(([key, value]) => formData.append(key, value));
      if (imageFile) {
        formData.append('image', imageFile);
      }
      await addRoom(formData);
      setRoomData({ roomNumber: '', type: 'single', basePrice: '', capacity: '', description: '' });
      setImageFile(null);
      toast.success('Room added successfully!');
    } catch {
      toast.error('Failed to add room');
    }
  };


  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold text-indigo-600 mb-6">Add New Room</h1>
        <div className="max-w-lg mx-auto p-6 bg-white rounded-xl shadow-lg">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-gray-700 font-medium">Room Number</label>
              <input
                type="text"
                name="roomNumber"
                value={roomData.roomNumber}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Type</label>
              <select
                name="type"
                value={roomData.type}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="single">Single</option>
                <option value="double">Double</option>
                <option value="suite">Suite</option>
                <option value="deluxe">Deluxe</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Base Price</label>
              <input
                type="number"
                name="basePrice"
                value={roomData.basePrice}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Capacity</label>
              <input
                type="number"
                name="capacity"
                value={roomData.capacity}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Description</label>
              <textarea
                name="description"
                value={roomData.description}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <button type="submit" className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition">
              Add Room
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default AddRoom;
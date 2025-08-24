import { useState, useEffect } from 'react';
import { getAllRooms, deleteRoom, updateRoom } from '../../Utils/api';
import Sidebar from '../../Components/Sidebar';
import toast from 'react-hot-toast';

const AllRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [editRoom, setEditRoom] = useState(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await getAllRooms();
        setRooms(res.data.rooms);
      } catch {
        toast.error('Failed to load rooms');
      }
    };
    fetchRooms();
  }, []);

  const handleDelete = async (roomId) => {
    try {
      await deleteRoom(roomId);
      setRooms(rooms.filter((room) => room._id !== roomId));
      toast.success('Room deleted');
    } catch {
      toast.error('Failed to delete room');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('roomNumber', editRoom.roomNumber);
      formData.append('type', editRoom.type);
      formData.append('basePrice', editRoom.basePrice);
      formData.append('capacity', editRoom.capacity);
      formData.append('description', editRoom.description || '');
      if (editRoom.imageFile) {
        formData.append('image', editRoom.imageFile);
      }
      const res = await updateRoom(editRoom._id, formData);
      setRooms(rooms.map((room) => (room._id === editRoom._id ? res.data.room : room)));
      setEditRoom(null);
      toast.success('Room updated');
    } catch {
      toast.error('Failed to update room');
    }
  };

  const handleEditChange = (e) => setEditRoom({ ...editRoom, [e.target.name]: e.target.value });

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold text-indigo-600 mb-6">All Rooms</h1>
        <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
          <table className="min-w-full">
            <thead className="bg-indigo-100">
              <tr>
                <th className="p-3 text-left text-indigo-700">Room Number</th>
                <th className="p-3 text-left text-indigo-700">Type</th>
                <th className="p-3 text-left text-indigo-700">Base Price</th>
                <th className="p-3 text-left text-indigo-700">Current Price</th>
                <th className="p-3 text-left text-indigo-700">Capacity</th>
                <th className="p-3 text-left text-indigo-700">Description</th>
                <th className="p-3 text-left text-indigo-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room) => (
                <tr key={room._id} className="border-t">
                  <td className="p-3">{room.roomNumber}</td>
                  <td className="p-3">{room.type}</td>
                  <td className="p-3">${room.basePrice}</td>
                  <td className="p-3">${room.currentPrice}</td>
                  <td className="p-3">{room.capacity}</td>
                  <td className="p-3">{room.description}</td>
                  <td className="p-3">
                    <button
                      onClick={() => setEditRoom(room)}
                      className="mr-2 bg-yellow-500 text-white p-1 rounded-lg hover:bg-yellow-600 transition"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDelete(room._id)}
                      className="bg-red-500 text-white p-1 rounded-lg hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {editRoom && (
          <div className="mt-10 p-6 bg-white rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Update Room</h2>
            <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium">Room Number</label>
                <input
                  type="text"
                  name="roomNumber"
                  value={editRoom.roomNumber}
                  onChange={handleEditChange}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium">Type</label>
                <select
                  name="type"
                  value={editRoom.type}
                  onChange={handleEditChange}
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
                  value={editRoom.basePrice}
                  onChange={handleEditChange}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium">Capacity</label>
                <input
                  type="number"
                  name="capacity"
                  value={editRoom.capacity}
                  onChange={handleEditChange}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div className="col-span-2">
                <label className="block text-gray-700 font-medium">Description</label>
                <textarea
                  name="description"
                  value={editRoom.description}
                  onChange={handleEditChange}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-gray-700 font-medium">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setEditRoom({ ...editRoom, imageFile: e.target.files?.[0] })}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <button type="submit" className="col-span-2 bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition">
                Update Room
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllRooms;
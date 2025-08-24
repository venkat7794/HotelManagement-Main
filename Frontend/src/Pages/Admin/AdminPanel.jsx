import { useState, useEffect } from 'react';
import { getAllBookings, updateBookingStatus, deleteBooking, addRoom } from '../../Utils/api';
import toast from 'react-hot-toast';

const AdminPanel = () => {
  const [bookings, setBookings] = useState([]);
  const [roomData, setRoomData] = useState({
    roomNumber: '',
    type: 'single',
    basePrice: '',
    capacity: '',
    description: '',
  });

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await getAllBookings();
        setBookings(res.data.bookings);
      } catch {
        toast.error('Failed to load bookings');
      }
    };
    fetchBookings();
  }, []);

  const handleStatusChange = async (bookingId, status) => {
    try {
      const res = await updateBookingStatus({ bookingId, status });
      setBookings(bookings.map((b) => (b._id === bookingId ? res.data.booking : b)));
      toast.success('Booking status updated');
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (bookingId) => {
    try {
      await deleteBooking(bookingId);
      setBookings(bookings.filter((b) => b._id !== bookingId));
      toast.success('Booking deleted');
    } catch {
      toast.error('Failed to delete booking');
    }
  };

  const handleRoomChange = (e) => setRoomData({ ...roomData, [e.target.name]: e.target.value });

  const handleAddRoom = async (e) => {
    e.preventDefault();
    try {
      await addRoom(roomData);
      setRoomData({ roomNumber: '', type: 'single', basePrice: '', capacity: '', description: '' });
      toast.success('Room added successfully!');
    } catch {
      toast.error('Failed to add room');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-indigo-600 mb-6">Admin Panel</h1>

      
      <div className="mb-10 p-6 bg-white rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Add New Room</h2>
        <form onSubmit={handleAddRoom} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium">Room Number</label>
            <input
              type="text"
              name="roomNumber"
              value={roomData.roomNumber}
              onChange={handleRoomChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Type</label>
            <select
              name="type"
              value={roomData.type}
              onChange={handleRoomChange}
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
              onChange={handleRoomChange}
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
              onChange={handleRoomChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div className="col-span-2">
            <label className="block text-gray-700 font-medium">Description</label>
            <textarea
              name="description"
              value={roomData.description}
              onChange={handleRoomChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button type="submit" className="col-span-2 bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition">
            Add Room
          </button>
        </form>
      </div>

     
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Manage Bookings</h2>
      <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
        <table className="min-w-full">
          <thead className="bg-indigo-100">
            <tr>
              <th className="p-3 text-left text-indigo-700">User</th>
              <th className="p-3 text-left text-indigo-700">Room</th>
              <th className="p-3 text-left text-indigo-700">Check-In</th>
              <th className="p-3 text-left text-indigo-700">Check-Out</th>
              <th className="p-3 text-left text-indigo-700">Price</th>
              <th className="p-3 text-left text-indigo-700">Status</th>
              <th className="p-3 text-left text-indigo-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking._id} className="border-t">
                <td className="p-3">{booking.userId.name}</td>
                <td className="p-3">{booking.roomId.roomNumber}</td>
                <td className="p-3">{new Date(booking.checkIn).toLocaleDateString()}</td>
                <td className="p-3">{new Date(booking.checkOut).toLocaleDateString()}</td>
                <td className="p-3">${booking.totalPrice}</td>
                <td className="p-3">{booking.status}</td>
                <td className="p-3">
                  <select
                    value={booking.status}
                    onChange={(e) => handleStatusChange(booking._id, e.target.value)}
                    className="p-1 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <button
                    onClick={() => handleDelete(booking._id)}
                    className="ml-2 bg-red-500 text-white p-1 rounded-lg hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPanel;
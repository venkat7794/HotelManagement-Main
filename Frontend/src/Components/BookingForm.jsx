import { useState, useEffect, useContext } from 'react';
import { createBooking, getAvailableRooms } from '../Utils/api';
import { AuthContext } from '../Context/AuthContext';
import roomImage from '../assets/room.jpg';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const BookingForm = () => {
  const navigate=useNavigate();
  const { token } = useContext(AuthContext);
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [formData, setFormData] = useState({ checkIn: '', checkOut: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Build file base from API base (strip trailing /api)
  const apiBase = import.meta.env.VITE_API_BASE_URL || 'https://hotelmanagement-backend-msbf.onrender.com/api';
  const fileBase = apiBase.replace(/\/api\/?$/, '');
  const getRoomImageSrc = (imageUrl) => (imageUrl ? `${fileBase}${imageUrl}` : roomImage);

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getAvailableRooms();
        const fetchedRooms = Array.isArray(res?.data?.rooms) ? res.data.rooms : [];
        setRooms(fetchedRooms);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load rooms');
        toast.error(err.response?.data?.message || 'Failed to load rooms');
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchRooms();
  }, [token]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const validateForm = () => {
    const today = new Date().toISOString().split('T')[0];
    if (formData.checkIn < today) {
      toast.error('Check-in date cannot be in the past');
      return false;
    }
    if (formData.checkOut <= formData.checkIn) {
      toast.error('Check-out date must be after check-in date');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError(null);
    try {
      await createBooking({ roomId: selectedRoom._id, ...formData });
      toast.success('Booking created successfully!');
      setFormData({ checkIn: '', checkOut: '' });
      setSelectedRoom(null); 
      const res = await getAvailableRooms();
      setRooms(res.data.rooms);
      navigate('/my-bookings');
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating booking');
      toast.error(err.response?.data?.message || 'Error creating booking');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg text-center">
        <p className="text-gray-600">Please log in to book a room.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold text-indigo-600 mb-6">Book a Room</h2>
      {loading && <p className="text-gray-600 mb-4">Loading rooms...</p>}
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {!loading && rooms.length === 0 && !error && (
        <p className="text-gray-600 mb-4">No available rooms at the moment.</p>
      )}
      {!selectedRoom ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <div
              key={room._id}
              className="bg-white rounded-xl shadow-lg p-4 cursor-pointer hover:shadow-xl transition"
              onClick={() => setSelectedRoom(room)}
            >
              <img src={getRoomImageSrc(room.imageUrl)} alt={room.roomNumber} className="w-full h-40 object-cover rounded-lg mb-4" />
              <h3 className="text-xl font-bold text-gray-800">{room.roomNumber} - {room.type}</h3>
              <p className="text-gray-600">Price: ${Number(room.currentPrice || room.basePrice || 0).toFixed(2)} / night</p>
              <p className="text-gray-600">Capacity: {room.capacity}</p>
              <p className="text-gray-600">{room.description || 'No description available'}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="max-w-lg mx-auto p-6 bg-white rounded-xl shadow-lg">
          <h3 className="text-2xl font-bold text-indigo-600 mb-4">
            Book Room: {selectedRoom.roomNumber} ({selectedRoom.type})
          </h3>
          <img src={getRoomImageSrc(selectedRoom.imageUrl)} alt={selectedRoom.roomNumber} className="w-full h-48 object-cover rounded-lg mb-6" />
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium">Check-In Date</label>
              <input
                type="date"
                name="checkIn"
                value={formData.checkIn}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                required
                disabled={loading}
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 font-medium">Check-Out Date</label>
              <input
                type="date"
                name="checkOut"
                value={formData.checkOut}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                required
                disabled={loading}
              />
            </div>
            <div className="flex space-x-4">
              <button
                type="submit"
                className="flex-1 bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 transition disabled:bg-gray-400"
                disabled={loading}
              >
                {loading ? 'Booking...' : 'Book Now'}
              </button>
              <button
                type="button"
                onClick={() => setSelectedRoom(null)}
                className="flex-1 bg-gray-500 text-white p-2 rounded-lg hover:bg-gray-600 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default BookingForm;
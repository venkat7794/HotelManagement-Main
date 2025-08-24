import { useState, useEffect, useContext } from 'react';
import { getUserBookings } from '../../Utils/api';
import { AuthContext } from '../../Context/AuthContext';
import toast from 'react-hot-toast';

const UserBookings = () => {
  const { token } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await getUserBookings(token);
        setBookings(res.data.bookings || []);
      } catch {
        toast.error('Failed to load bookings');
      }
    };
    fetchBookings();
  }, [token]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-indigo-600 mb-6">My Bookings</h1>
      <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
        <table className="min-w-full">
          <thead className="bg-indigo-100">
            <tr>
              <th className="p-3 text-left text-indigo-700">Room</th>
              <th className="p-3 text-left text-indigo-700">Check-In</th>
              <th className="p-3 text-left text-indigo-700">Check-Out</th>
              <th className="p-3 text-left text-indigo-700">Price</th>
              <th className="p-3 text-left text-indigo-700">Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking._id} className="border-t">
                <td className="p-3">
                  {booking.roomId?.roomNumber
                    ? `${booking.roomId.roomNumber} (${booking.roomId.type || 'N/A'})`
                    : 'N/A'}
                </td>
                <td className="p-3">{new Date(booking.checkIn).toLocaleDateString()}</td>
                <td className="p-3">{new Date(booking.checkOut).toLocaleDateString()}</td>
                <td className="p-3">${booking.totalPrice?.toFixed(2) || '0.00'}</td>
                <td className="p-3">{booking.status || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserBookings;
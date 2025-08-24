import { useState, useEffect } from 'react';
import { getAllBookings, updateBookingStatus, deleteBooking, getDashboardStats } from '../../Utils/api';
import Sidebar from '../../Components/Sidebar';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({ totalUsers: 0, totalBookings: 0, totalRevenue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [bookingsRes, statsRes] = await Promise.all([getAllBookings(), getDashboardStats()]);
        const validBookings = bookingsRes.data.bookings.filter((b) => b && typeof b === 'object');
        setBookings(validBookings || []);
        setStats(statsRes.data);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
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
      const statsRes = await getDashboardStats();
      setStats(statsRes.data);
    } catch {
      toast.error('Failed to delete booking');
    }
  };

  if (loading) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-6">
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold text-indigo-600 mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="p-6 bg-white rounded-xl shadow-lg">
            <h2 className="text-xl font-bold text-gray-800">Total Users</h2>
            <p className="text-2xl text-indigo-600">{stats.totalUsers}</p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-lg">
            <h2 className="text-xl font-bold text-gray-800">Total Revenue</h2>
            <p className="text-2xl text-indigo-600">${stats.totalRevenue.toFixed(2)}</p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-lg">
            <h2 className="text-xl font-bold text-gray-800">Total Bookings</h2>
            <p className="text-2xl text-indigo-600">{stats.totalBookings}</p>
          </div>
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
              {bookings.map((booking) => (<tr key={booking._id} className="border-t"><td className="p-3">{booking.userId?.name || 'N/A'}</td><td className="p-3">{booking.roomId?.roomNumber || 'N/A'}</td><td className="p-3">{new Date(booking.checkIn).toLocaleDateString()}</td><td className="p-3">{new Date(booking.checkOut).toLocaleDateString()}</td><td className="p-3">${booking.totalPrice?.toFixed(2) || '0.00'}</td><td className="p-3">{booking.status}</td><td className="p-3"><select value={booking.status} onChange={(e) => handleStatusChange(booking._id, e.target.value)} className="p-1 border rounded-lg focus:ring-2 focus:ring-indigo-500"><option value="pending">Pending</option><option value="confirmed">Confirmed</option><option value="cancelled">Cancelled</option></select><button onClick={() => handleDelete(booking._id)} className="ml-2 bg-red-500 text-white p-1 rounded-lg hover:bg-red-600 transition">Delete</button></td></tr>))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
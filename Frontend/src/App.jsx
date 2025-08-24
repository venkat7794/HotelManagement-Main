import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import Home from './Pages/Home';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Bookings from './Pages/User/Bookings';
import Profile from './Pages/User/Profile';
import Dashboard from './Pages/Admin/Dashboard';
import AllRooms from './Pages/Admin/AllRooms';
import AddRoom from './Pages/Admin/AddRoom';
import Contact from './Pages/Contact';
import About from './Pages/About';
import UserBookings from './Pages/User/UserBookings';
import AdminNavbar from './Components/AdminNavbar'; 
const App = () => {
  const location = useLocation();
  const isAuthRoute = location.pathname === '/login' || location.pathname === '/register';
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {!isAuthRoute && !isAdminRoute && <Navbar />}
      {isAdminRoute && <AdminNavbar />}
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/my-bookings" element={<UserBookings />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/rooms" element={<AllRooms />} />
          <Route path="/admin/add-room" element={<AddRoom />} />
        </Routes>
      </div>
      {!isAuthRoute && !isAdminRoute && <Footer />}
    </div>
  );
};

export default App;
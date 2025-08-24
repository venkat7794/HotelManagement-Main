import { useState, useContext, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';
import { getProfile } from '../Utils/api'; 
import { FaChevronDown } from 'react-icons/fa'; 
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profile, setProfile] = useState(null);

  const handleLogout = () => {
    logout();
    localStorage.removeItem('token');
    navigate('/login');
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken && !user) {
      
    }
  }, [user]);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token'); 
      if (token) {
        try {
          const res = await getProfile(token);
          setProfile(res.data);
        } catch (error) {
          toast.error('Failed to load profile');
          handleLogout();
        }
      }
    };
    fetchProfile();
  }, []); 

  return (
    <div className="flex items-center justify-between py-5 mb-5 text-lg bg-white shadow-md">
     
      <h1
        onClick={() => navigate('/')}
        className="cursor-pointer text-2xl font-bold text-gray-800 ml-6 hover:text-indigo-600 transition-colors duration-200"
      >
        Hotels Booking App
      </h1>

     
      <ul className="hidden md:flex gap-6 text-base font-medium">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? 'text-indigo-600 font-semibold' : 'text-gray-600 hover:text-indigo-600 transition-colors duration-200'
          }
        >
          <li className="py-1 cursor-pointer">Home</li>
        </NavLink>
        <NavLink
          to="/bookings"
          className={({ isActive }) =>
            isActive ? 'text-indigo-600 font-semibold' : 'text-gray-600 hover:text-indigo-600 transition-colors duration-200'
          }
        >
          <li className="py-1 cursor-pointer">Book a Room</li>
        </NavLink>
        <NavLink
          to="/contact"
          className={({ isActive }) =>
            isActive ? 'text-indigo-600 font-semibold' : 'text-gray-600 hover:text-indigo-600 transition-colors duration-200'
          }
        >
          <li className="py-1 cursor-pointer">Contact</li>
        </NavLink>
        <NavLink
          to="/about"
          className={({ isActive }) =>
            isActive ? 'text-indigo-600 font-semibold' : 'text-gray-600 hover:text-indigo-600 transition-colors duration-200'
          }
        >
          <li className="py-1 cursor-pointer">About</li>
        </NavLink>
      </ul>

      
      <div className="flex items-center gap-4 mr-6">
        {user && profile ? (
          <div
            className="relative flex items-center gap-2 cursor-pointer group"
            onMouseEnter={() => setIsProfileOpen(true)}
            onMouseLeave={() => setIsProfileOpen(false)}
          >
            
            <span className="text-gray-700 font-medium text-base">
              Hello, {profile.name || 'User'}
            </span>
            <FaChevronDown className="w-3 h-3 text-gray-600" />

            
            {isProfileOpen && (
              <div className="absolute top-0 right-0 z-20 hidden text-base font-medium text-gray-600 pt-14 group-hover:block">
                <div className="flex flex-col gap-4 p-4 rounded min-w-48 bg-stone-100 shadow-lg">
                  <p
                    onClick={() => {
                      navigate('/profile');
                      setIsProfileOpen(false);
                    }}
                    className="cursor-pointer hover:text-black transition-colors duration-200"
                  >
                    Profile Details
                  </p>
                  {user.role !== 'admin' && (
                    <p
                      onClick={() => {
                        navigate('/my-bookings');
                        setIsProfileOpen(false);
                      }}
                      className="cursor-pointer hover:text-black transition-colors duration-200"
                    >
                      My Bookings
                    </p>
                  )}
                  <p
                    onClick={handleLogout}
                    className="cursor-pointer hover:text-black transition-colors duration-200"
                  >
                    Logout
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => navigate('/register')}
            className="hidden px-8 py-3 font-light text-white rounded-full bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200 md:block"
          >
            Create Account
          </button>
        )}

      </div>
    </div>
  );
};

export default Navbar;
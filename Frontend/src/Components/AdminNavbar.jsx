import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';

const AdminNavbar = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white border-b shadow-md sm:px-10">
      <h1 
        className="text-xl font-bold text-blue-600 cursor-pointer"
        onClick={() => navigate("/")}
      >
       Admin Panel
      </h1>
      <button
          onClick={handleLogout}
          className="px-6 py-2 text-sm text-white transition bg-blue-600 rounded-full hover:bg-blue-700"
        >
          Logout
        </button>
    </div>
  );
};

export default AdminNavbar;
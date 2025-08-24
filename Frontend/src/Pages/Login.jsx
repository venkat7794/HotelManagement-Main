import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';
import { loginUser, loginAdmin } from '../Utils/api';
import toast from 'react-hot-toast';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const apiCall = isAdminLogin ? loginAdmin : loginUser;
      const res = await apiCall(formData);

      if (!res?.data?.token) {
        throw new Error(res?.data?.message || 'Invalid credentials');
      }

      // Save token in AuthContext
      login(res.data.token);

      toast.success(`${isAdminLogin ? 'Admin' : 'User'} login successful!`);
      navigate(isAdminLogin ? '/admin/dashboard' : '/');
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || 'Login failed'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full p-8 bg-white rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-indigo-600 mb-6">
          {isAdminLogin ? 'Admin Login' : 'User Login'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              required
              disabled={loading}
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              required
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 transition disabled:bg-gray-400"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="mt-4 text-center text-gray-600">
          {isAdminLogin ? (
            <button
              onClick={() => setIsAdminLogin(false)}
              className="text-indigo-500 underline"
              disabled={loading}
            >
              Switch to User Login
            </button>
          ) : (
            <>
              <button
                onClick={() => setIsAdminLogin(true)}
                className="text-indigo-500 underline"
                disabled={loading}
              >
                Admin Login
              </button>
              <span className="block mt-2">
                New user?{' '}
                <Link to="/register" className="text-indigo-500 underline">
                  Register
                </Link>
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default Login;

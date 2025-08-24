import { useState, useEffect, useContext } from 'react';
import { getProfile } from '../../Utils/api';
import { AuthContext } from '../../Context/AuthContext';
import toast from 'react-hot-toast';

const Profile = () => {
  const { token } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfile(token);
        setProfile(res.data);
      } catch {
        toast.error('Failed to load profile');
      }
    };
    fetchProfile();
  }, [token]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-indigo-600 mb-6">Your Profile</h1>
      {profile ? (
        <div className="p-6 bg-white rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">User Details</h2>
          <p className="text-gray-700"><strong>Name:</strong> {profile.name}</p>
          <p className="text-gray-700"><strong>Email:</strong> {profile.email}</p>
        </div>
      ) : (
        <p className="text-gray-600">Loading profile...</p>
      )}
    </div>
  );
};

export default Profile;
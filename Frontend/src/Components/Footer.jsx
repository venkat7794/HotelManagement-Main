import { FaFacebook, FaTwitter, FaInstagram, FaEnvelope, FaPhone } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gradient from-blue-100 to-green-200 text-black p-5 ml-5">
        <hr className="border-gray-600 mb-6" />
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
       
        <div>
          <h3 className="text-xl font-bold mb-4">Hotels Booking App</h3>
          <p className="text-sm">© {new Date().getFullYear()} Hotel Booking. All rights reserved.</p>
          <p className="text-sm mt-2">Your trusted platform for seamless hotel reservations.</p>
        </div>

       
        <div>
          <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="/" className="hover:text-indigo-300 transition-colors duration-200">
                Home
              </a>
            </li>
            <li>
              <a href="/bookings" className="hover:text-indigo-300 transition-colors duration-200">
                Book a Room
              </a>
            </li>
            <li>
              <a href="/about" className="hover:text-indigo-300 transition-colors duration-200">
                About Us
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:text-indigo-300 transition-colors duration-200">
                Contact
              </a>
            </li>
          </ul>
        </div>

        
        <div>
          <h4 className="text-lg font-semibold mb-4">Get in Touch</h4>
          <p className="text-sm flex items-center justify-center md:justify-start mb-2">
            <FaEnvelope className="mr-2" /> info@hotelbooking.com
          </p>
          <p className="text-sm flex items-center justify-center md:justify-start mb-4">
            <FaPhone className="mr-2" /> +1-234-567-890
          </p>
          <div className="flex justify-center md:justify-start gap-4">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-300 transition-colors duration-200">
              <FaFacebook size={20} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-300 transition-colors duration-200">
              <FaTwitter size={20} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-300 transition-colors duration-200">
              <FaInstagram size={20} />
            </a>
          </div>
        </div>
      </div>

      
      <div className="mt-6 text-center text-xs text-gray-400">
        <p>Designed with ❤️ by the Hotel Booking Team</p>
      </div>
    </footer>
  );
};

export default Footer;
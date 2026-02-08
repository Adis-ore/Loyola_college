import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaEnvelope, FaPhone, FaGraduationCap, FaHeart } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'Directory', path: '/directory' },
    { name: 'Support', path: '/support' },
    { name: 'News', path: '/news' },
  ];

  const resourceLinks = [
    { name: 'Executives', path: '/executives' },
    { name: 'Jobs', path: '/jobs' },
    { name: 'Request Support', path: '/support' },
  ];

  const socialLinks = [
    { icon: FaFacebook, href: '#', label: 'Facebook' },
    { icon: FaTwitter, href: '#', label: 'Twitter' },
    { icon: FaInstagram, href: '#', label: 'Instagram' },
    { icon: FaLinkedin, href: '#', label: 'LinkedIn' },
  ];

  return (
    <footer className="relative bg-gray-900 text-gray-300 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center space-x-3 group mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
                <FaGraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-white font-bold text-xl">Loyola</span>
                <span className="text-emerald-400 font-bold text-xl ml-1">O3</span>
              </div>
            </Link>
            <p className="text-gray-400 leading-relaxed mb-6">
              Connecting and empowering members of Loyola College 2003 graduating set.
              Together we grow, together we succeed.
            </p>
            <div className="flex space-x-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center text-gray-400 hover:bg-emerald-600 hover:text-white transition-all duration-300 hover:-translate-y-1"
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 flex items-center">
              <span className="w-8 h-0.5 bg-emerald-500 mr-3"></span>
              Quick Links
            </h3>
            <ul className="space-y-4">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-emerald-400 transition-colors duration-300 flex items-center group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-emerald-500 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 flex items-center">
              <span className="w-8 h-0.5 bg-emerald-500 mr-3"></span>
              Resources
            </h3>
            <ul className="space-y-4">
              {resourceLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-emerald-400 transition-colors duration-300 flex items-center group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-emerald-500 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 flex items-center">
              <span className="w-8 h-0.5 bg-emerald-500 mr-3"></span>
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="mailto:loyola03set@gmail.com"
                  className="flex items-center text-gray-400 hover:text-emerald-400 transition-colors group"
                >
                  <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center mr-3 group-hover:bg-emerald-600/20 transition-colors">
                    <FaEnvelope className="text-emerald-500" />
                  </div>
                  <span className="text-sm">loyola03set@gmail.com</span>
                </a>
              </li>
              <li>
                <a
                  href="tel:+2347033784765"
                  className="flex items-center text-gray-400 hover:text-emerald-400 transition-colors group"
                >
                  <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center mr-3 group-hover:bg-emerald-600/20 transition-colors">
                    <FaPhone className="text-emerald-500" />
                  </div>
                  <span className="text-sm">+234 703 378 4765</span>
                </a>
              </li>
            </ul>

            {/* Newsletter CTA */}
            <div className="mt-6 p-4 bg-gray-800/50 rounded-2xl border border-gray-700">
              <p className="text-sm text-gray-400 mb-3">Stay connected with us</p>
              <Link
                to="/login"
                className="block w-full py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-center font-semibold rounded-xl hover:shadow-lg hover:shadow-emerald-500/20 transition-all"
              >
                Join Now
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500 flex items-center">
              &copy; {currentYear} Loyola College O3 Set. Made with{' '}
              <FaHeart className="w-4 h-4 text-red-500 mx-1" /> by the community.
            </p>
            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <a href="#" className="hover:text-emerald-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-emerald-400 transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

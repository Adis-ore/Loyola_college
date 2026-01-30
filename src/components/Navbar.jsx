import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiMenu, HiX } from 'react-icons/hi';
import Logo from '../assets/Logo.JPG';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();

  // Optimized scroll listener
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Directory', path: '/directory' },
    { name: 'Support', path: '/support' },
    { name: 'News', path: '/news' },
    { name: 'Executives', path: '/executives' },
    { name: 'Jobs', path: '/jobs' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Spacer - Responsive height to match navbar */}
      <div className="h-20 sm:h-20" />
      
      <nav className={`fixed w-full top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-2xl shadow-xl shadow-emerald-500/5 border-b border-emerald-100/50'
          : 'bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-700'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20 gap-2 sm:gap-4">
            
            {/* Logo Section */}
            <Link to="/" className="flex items-center space-x-2 md:space-x-3 group flex-shrink-0">
              <div className={`relative w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl overflow-hidden transition-all duration-500 group-hover:scale-105 group-hover:rotate-3 shadow-lg ${
                scrolled ? 'shadow-emerald-500/30' : 'shadow-black/20'
              }`}>
                <img
                  src="/Logo.JPG"
                  alt="Loyola O3 Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex flex-col leading-none">
                <div className="flex items-baseline space-x-0.5">
                  <span className={`font-black text-lg md:text-2xl tracking-tight transition-all duration-500 ${
                    scrolled ? 'text-gray-900' : 'text-white'
                  }`}>
                    Loyola
                  </span>
                  <span className={`font-black text-lg md:text-2xl transition-all duration-500 ${
                    scrolled ? 'text-emerald-600' : 'text-emerald-300'
                  }`}>
                    O3
                  </span>
                </div>
                <div className={`h-0.5 w-0 group-hover:w-full transition-all duration-500 mt-0.5 ${
                  scrolled ? 'bg-emerald-500' : 'bg-emerald-300'
                }`} />
              </div>
            </Link>

            {/* Desktop Navigation - Hidden below Large screens */}
            <div className="hidden lg:flex items-center flex-1 justify-center px-4">
              <div className={`flex items-center space-x-1 p-1 rounded-2xl transition-all duration-500 ${
                scrolled ? 'bg-gray-100/80' : 'bg-white/10 backdrop-blur-md border border-white/10'
              }`}>
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`relative px-3 xl:px-4 py-2 rounded-xl text-xs xl:text-sm font-bold transition-all duration-300 group whitespace-nowrap ${
                      isActive(link.path)
                        ? scrolled
                          ? 'text-white bg-emerald-600 shadow-md shadow-emerald-500/20'
                          : 'text-emerald-900 bg-white'
                        : scrolled
                          ? 'text-gray-600 hover:text-emerald-600 hover:bg-white'
                          : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <span className="relative z-10">{link.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Auth Section - Desktop */}
            <div className="hidden lg:flex items-center space-x-3 flex-shrink-0">
              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl border transition-all ${
                    scrolled ? 'bg-gray-50 border-gray-100' : 'bg-white/10 border-white/20'
                  }`}>
                    <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white text-sm font-bold shadow-inner">
                      {user?.name?.charAt(0)}
                    </div>
                    <span className={`text-sm font-bold truncate max-w-[100px] ${scrolled ? 'text-gray-700' : 'text-white'}`}>
                      {user?.name?.split(' ')[0]}
                    </span>
                  </div>
                  <button
                    onClick={logout}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all active:scale-95 ${
                      scrolled
                        ? 'bg-gray-900 text-white hover:bg-gray-800'
                        : 'bg-white text-emerald-800 hover:bg-emerald-50'
                    }`}
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95 shadow-lg ${
                    scrolled
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                      : 'bg-white text-emerald-800 hover:bg-emerald-50 shadow-black/10'
                  }`}
                >
                  Login
                </Link>
              )}
            </div>

            {/* Mobile/Tablet Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle Menu"
              className={`lg:hidden p-2 rounded-xl transition-all active:scale-90 ${
                scrolled
                  ? 'text-gray-700 bg-gray-100'
                  : 'text-white bg-white/10 border border-white/20'
              }`}
            >
              {isOpen ? <HiX size={26} /> : <HiMenu size={26} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        <div className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-[80vh] opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="px-4 pb-6 pt-2">
            <div className={`rounded-2xl p-2 space-y-1 shadow-2xl border ${
              scrolled 
                ? 'bg-white border-gray-100' 
                : 'bg-emerald-800/95 backdrop-blur-xl border-emerald-700'
            }`}>
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block px-4 py-3.5 rounded-xl text-base font-bold transition-all ${
                    isActive(link.path)
                      ? scrolled
                        ? 'bg-emerald-500 text-white shadow-lg'
                        : 'bg-white text-emerald-800'
                      : scrolled
                        ? 'text-gray-600 hover:bg-gray-50'
                        : 'text-white/90 hover:bg-white/10'
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              <div className={`my-2 border-t ${scrolled ? 'border-gray-100' : 'border-white/10'}`} />

              {isAuthenticated ? (
                <div className="space-y-2 p-2">
                  <div className={`flex items-center space-x-3 p-3 rounded-xl ${
                    scrolled ? 'bg-gray-50' : 'bg-white/10'
                  }`}>
                    <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white font-black shadow-lg">
                      {user?.name?.charAt(0)}
                    </div>
                    <div className="flex flex-col">
                      <span className={`text-sm font-bold ${scrolled ? 'text-gray-900' : 'text-white'}`}>
                        {user?.name}
                      </span>
                      <span className={`text-xs ${scrolled ? 'text-gray-500' : 'text-white/60'}`}>
                        Account Active
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={logout}
                    className="w-full py-4 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold transition-all shadow-lg active:scale-[0.98]"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="p-2">
                  <Link
                    to="/login"
                    className="block w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white text-center rounded-xl font-bold transition-all shadow-lg active:scale-[0.98]"
                  >
                    Login to Portal
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
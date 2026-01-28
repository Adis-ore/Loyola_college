import { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { fetchExecutives } from '../services/googleSheetsService';
import { isConfigured } from '../config/googleSheets';
import { ExecutiveCardSkeleton, Skeleton, SkeletonCircle } from '../components/Skeleton';

// Sample executives data - Used when Google Sheets is not configured
const sampleExecutives = [
  {
    id: 1,
    name: 'Chief Emeka Okonkwo',
    position: 'President',
    image: null,
    bio: 'A seasoned business leader with over 20 years of experience in corporate management. Passionate about community development.',
    email: 'president@loyolao3.com',
    phone: '+234 801 000 0001',
    linkedin: '#',
    twitter: '#',
    isPresident: true,
  },
  {
    id: 2,
    name: 'Mrs. Funke Adeyemi',
    position: 'Vice President',
    image: null,
    bio: 'An accomplished medical doctor and healthcare administrator. Committed to improving the welfare of our members.',
    email: 'vp@loyolao3.com',
    phone: '+234 801 000 0002',
    linkedin: '#',
    twitter: '#',
    isPresident: false,
  },
  {
    id: 3,
    name: 'Mr. Chidi Nwosu',
    position: 'General Secretary',
    image: null,
    bio: 'A meticulous legal practitioner known for his organizational skills. Ensures smooth running of all set activities.',
    email: 'secretary@loyolao3.com',
    phone: '+234 801 000 0003',
    linkedin: '#',
    twitter: '#',
    isPresident: false,
  },
  {
    id: 4,
    name: 'Mrs. Aisha Mohammed',
    position: 'Financial Secretary',
    image: null,
    bio: 'A certified accountant with expertise in financial management. Maintains transparent financial records for the set.',
    email: 'finance@loyolao3.com',
    phone: '+234 801 000 0004',
    linkedin: '#',
    twitter: '#',
    isPresident: false,
  },
  {
    id: 5,
    name: 'Mr. Tunde Bakare',
    position: 'Treasurer',
    image: null,
    bio: 'An investment banker with a keen eye for financial growth. Manages and grows the set\'s financial resources.',
    email: 'treasurer@loyolao3.com',
    phone: '+234 801 000 0005',
    linkedin: '#',
    twitter: '#',
    isPresident: false,
  },
  {
    id: 6,
    name: 'Mrs. Ngozi Eze',
    position: 'Welfare Secretary',
    image: null,
    bio: 'A social worker dedicated to member welfare. Coordinates support initiatives and member assistance programs.',
    email: 'welfare@loyolao3.com',
    phone: '+234 801 000 0006',
    linkedin: '#',
    twitter: '#',
    isPresident: false,
  },
  {
    id: 7,
    name: 'Mr. Kunle Afolabi',
    position: 'Publicity Secretary',
    image: null,
    bio: 'A media professional with extensive experience in communications. Manages all public relations for the set.',
    email: 'publicity@loyolao3.com',
    phone: '+234 801 000 0007',
    linkedin: '#',
    twitter: '#',
    isPresident: false,
  },
  {
    id: 8,
    name: 'Mrs. Blessing Obi',
    position: 'Social Secretary',
    image: null,
    bio: 'An event planner extraordinaire. Organizes memorable events and social gatherings for the set.',
    email: 'social@loyolao3.com',
    phone: '+234 801 000 0008',
    linkedin: '#',
    twitter: '#',
    isPresident: false,
  },
];

const Executives = () => {
  const [executives, setExecutives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadExecutives = async () => {
      setLoading(true);
      setError(null);

      try {
        if (isConfigured()) {
          const data = await fetchExecutives();
          setExecutives(data);
        } else {
          setExecutives(sampleExecutives);
        }
      } catch (err) {
        console.error('Error loading executives:', err);
        setError('Failed to load executives. Using sample data.');
        setExecutives(sampleExecutives);
      } finally {
        setLoading(false);
      }
    };

    loadExecutives();
  }, []);

  // Get president and other executives
  const president = executives.find(e => e.isPresident);
  const otherExecutives = executives.filter(e => !e.isPresident);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pt-20">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-800 py-20 relative overflow-hidden">
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Skeleton className="w-64 h-12 mx-auto mb-6 bg-white/20" />
            <Skeleton className="w-96 h-6 mx-auto bg-white/20" />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* President Skeleton */}
          <div className="mb-16">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
              <div className="lg:flex">
                <div className="lg:w-2/5 bg-gradient-to-br from-gray-200 to-gray-300 p-12 flex items-center justify-center">
                  <SkeletonCircle size="xl" className="w-48 h-48" />
                </div>
                <div className="lg:w-3/5 p-12">
                  <Skeleton className="w-32 h-8 rounded-full mb-6" />
                  <Skeleton className="w-3/4 h-10 mb-6" />
                  <Skeleton className="w-full h-4 mb-2" />
                  <Skeleton className="w-full h-4 mb-2" />
                  <Skeleton className="w-2/3 h-4 mb-8" />
                  <div className="space-y-4 mb-8">
                    <Skeleton className="w-48 h-5" />
                    <Skeleton className="w-40 h-5" />
                  </div>
                  <div className="flex gap-4">
                    <SkeletonCircle size="md" />
                    <SkeletonCircle size="md" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Other Executives Skeleton */}
          <div className="text-center mb-12">
            <Skeleton className="w-48 h-10 mx-auto mb-4" />
            <Skeleton className="w-80 h-5 mx-auto" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {Array.from({ length: 7 }).map((_, i) => (
              <ExecutiveCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pt-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-800 py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 animate-fade-in text-shadow-lg">
            Our Executives
          </h1>
          <p className="text-xl md:text-2xl text-indigo-100 max-w-3xl mx-auto leading-relaxed animate-slide-up">
            Meet the dedicated team leading our set forward. They work tirelessly to ensure the growth and welfare of all members.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-50 to-transparent"></div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 mobile-padding">
        {/* President Highlight */}
        {president && (
          <div className="mb-16 animate-scale-in">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2">
              <div className="lg:flex">
                <div className="lg:w-2/5 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 p-12 flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-cyan-400/20 animate-pulse-glow"></div>
                  <div className="relative w-48 h-48 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl animate-float">
                    {president.image ? (
                      <img src={president.image} alt={president.name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <FaUser className="w-24 h-24 text-white drop-shadow-lg" />
                    )}
                  </div>
                </div>
                <div className="lg:w-3/5 p-12">
                  <span className="inline-block px-6 py-2 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 text-sm font-semibold rounded-full mb-6 shadow-sm">
                    {president.position}
                  </span>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                    {president.name}
                  </h2>
                  <p className="text-gray-600 text-lg leading-relaxed mb-8">{president.bio}</p>
                  <div className="space-y-4 mb-8">
                    <a
                      href={`mailto:${president.email}`}
                      className="flex items-center text-gray-700 hover:text-emerald-600 transition-colors duration-300 group"
                    >
                      <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center mr-4 group-hover:bg-emerald-200 transition-colors">
                        <FaEnvelope className="w-5 h-5" />
                      </div>
                      <span className="font-medium">{president.email}</span>
                    </a>
                    <a
                      href={`tel:${president.phone}`}
                      className="flex items-center text-gray-700 hover:text-emerald-600 transition-colors duration-300 group"
                    >
                      <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center mr-4 group-hover:bg-emerald-200 transition-colors">
                        <FaPhone className="w-5 h-5" />
                      </div>
                      <span className="font-medium">{president.phone}</span>
                    </a>
                  </div>
                  <div className="flex gap-4">
                    {president.linkedin && president.linkedin !== '#' && (
                      <a
                        href={president.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-xl"
                      >
                        <FaLinkedin />
                      </a>
                    )}
                    {president.twitter && president.twitter !== '#' && (
                      <a
                        href={president.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 bg-gradient-to-r from-sky-500 to-sky-600 rounded-full flex items-center justify-center text-white hover:from-sky-600 hover:to-sky-700 transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-xl"
                      >
                        <FaTwitter />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Other Executives */}
        {otherExecutives.length > 0 && (
          <>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 animate-fade-in">Executive Council</h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto animate-slide-up">
                Our talented team of leaders working together to achieve excellence.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {otherExecutives.map((exec, index) => (
                <div
                  key={exec.id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 border border-gray-100 overflow-hidden group animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Avatar */}
                  <div className="relative p-8 bg-gradient-to-br from-blue-50 to-indigo-50 flex justify-center">
                    <div className="w-28 h-28 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                      {exec.image ? (
                        <img src={exec.image} alt={exec.name} className="w-full h-full object-cover" />
                      ) : (
                        <FaUser className="w-14 h-14 text-white" />
                      )}
                    </div>
                    <div className="absolute top-4 right-4 w-3 h-3 bg-green-400 rounded-full border-2 border-white shadow-sm"></div>
                  </div>

                  {/* Info */}
                  <div className="p-6 text-center">
                    <span className="inline-block px-4 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 text-xs font-semibold rounded-full mb-3 shadow-sm">
                      {exec.position}
                    </span>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight">{exec.name}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3">
                      {exec.bio}
                    </p>

                    {/* Contact */}
                    <div className="space-y-3 mb-6">
                      <a
                        href={`mailto:${exec.email}`}
                        className="flex items-center justify-center text-sm text-gray-600 hover:text-blue-600 transition-colors duration-300 group/link"
                      >
                        <FaEnvelope className="w-4 h-4 mr-2 text-gray-400 group-hover/link:text-blue-500" />
                        <span className="truncate font-medium">{exec.email}</span>
                      </a>
                      <a
                        href={`tel:${exec.phone}`}
                        className="flex items-center justify-center text-sm text-gray-600 hover:text-blue-600 transition-colors duration-300 group/link"
                      >
                        <FaPhone className="w-4 h-4 mr-2 text-gray-400 group-hover/link:text-blue-500" />
                        <span className="font-medium">{exec.phone}</span>
                      </a>
                    </div>

                    {/* Social */}
                    <div className="flex justify-center gap-3">
                      {exec.linkedin && exec.linkedin !== '#' && (
                        <a
                          href={exec.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-blue-100 hover:text-blue-600 transition-all duration-300 transform hover:scale-110 shadow-sm hover:shadow-md"
                        >
                          <FaLinkedin size={16} />
                        </a>
                      )}
                      {exec.twitter && exec.twitter !== '#' && (
                        <a
                          href={exec.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-sky-100 hover:text-sky-600 transition-all duration-300 transform hover:scale-110 shadow-sm hover:shadow-md"
                        >
                          <FaTwitter size={16} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Executives;

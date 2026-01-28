import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaUsers, FaHandsHelping, FaNewspaper, FaBriefcase, FaArrowRight, FaHeart, FaStar, FaGraduationCap } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi';
import { getHomeStats } from '../services/googleSheetsService';
import { isConfigured } from '../config/googleSheets';
import { Skeleton } from '../components/Skeleton';

// Animated counter hook
const useCountUp = (end, duration = 2000, shouldStart = true) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(0);
  const startTimeRef = useRef(null);

  useEffect(() => {
    if (!shouldStart || end === 0) {
      setCount(end);
      return;
    }

    const animate = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const progress = Math.min((timestamp - startTimeRef.current) / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      countRef.current = Math.floor(easeOutQuart * end);
      setCount(countRef.current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);

    return () => {
      startTimeRef.current = null;
    };
  }, [end, duration, shouldStart]);

  return count;
};

// Format currency for display
const formatCurrency = (amount) => {
  if (amount >= 1000000) {
    return '₦' + (amount / 1000000).toFixed(1) + 'M';
  } else if (amount >= 1000) {
    return '₦' + (amount / 1000).toFixed(0) + 'K';
  }
  return '₦' + amount.toLocaleString('en-NG');
};

const Home = () => {
  const [stats, setStats] = useState({
    memberCount: 0,
    supportCount: 0,
    jobsCount: 0,
    totalPledges: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsLoaded, setStatsLoaded] = useState(false);

  // Fetch live stats
  useEffect(() => {
    const loadStats = async () => {
      setStatsLoading(true);
      try {
        if (isConfigured()) {
          const liveStats = await getHomeStats();
          setStats(liveStats);
        } else {
          // Sample stats for demo
          setStats({
            memberCount: 127,
            supportCount: 8,
            jobsCount: 15,
            totalPledges: 2500000,
          });
        }
      } catch (error) {
        console.error('Error loading stats:', error);
        // Fallback to sample stats
        setStats({
          memberCount: 500,
          supportCount: 50,
          jobsCount: 100,
          totalPledges: 10000000,
        });
      } finally {
        setStatsLoading(false);
        setStatsLoaded(true);
      }
    };

    loadStats();
  }, []);

  // Animated counts
  const memberCount = useCountUp(stats.memberCount, 2000, statsLoaded);
  const supportCount = useCountUp(stats.supportCount, 2000, statsLoaded);
  const jobsCount = useCountUp(stats.jobsCount, 2000, statsLoaded);
  const pledgeCount = useCountUp(stats.totalPledges, 2000, statsLoaded);

  const features = [
    {
      icon: <FaUsers className="w-7 h-7" />,
      title: 'Member Directory',
      description: 'Find and connect with fellow Loyola O3 set members easily.',
      link: '/directory',
      gradient: 'from-blue-500 to-blue-600',
      shadowColor: 'shadow-blue-500/25',
    },
    {
      icon: <FaHandsHelping className="w-7 h-7" />,
      title: 'Support System',
      description: 'Request and vote for support initiatives within our community.',
      link: '/support',
      gradient: 'from-purple-500 to-purple-600',
      shadowColor: 'shadow-purple-500/25',
    },
    {
      icon: <FaNewspaper className="w-7 h-7" />,
      title: 'News Corner',
      description: 'Stay updated with the latest news and announcements.',
      link: '/news',
      gradient: 'from-orange-500 to-red-500',
      shadowColor: 'shadow-orange-500/25',
    },
    {
      icon: <FaBriefcase className="w-7 h-7" />,
      title: 'Job Board',
      description: 'Explore job opportunities shared by our community members.',
      link: '/jobs',
      gradient: 'from-teal-500 to-cyan-500',
      shadowColor: 'shadow-teal-500/25',
    },
  ];

  const statsDisplay = [
    {
      value: statsLoading ? <Skeleton className="w-12 h-8 bg-white/20 mx-auto" /> : memberCount,
      label: 'Members',
      icon: <FaUsers className="w-5 h-5" />,
    },
    {
      value: statsLoading ? <Skeleton className="w-12 h-8 bg-white/20 mx-auto" /> : supportCount,
      label: 'Support Requests',
      icon: <FaHeart className="w-5 h-5" />,
    },
    {
      value: statsLoading ? <Skeleton className="w-12 h-8 bg-white/20 mx-auto" /> : jobsCount,
      label: 'Jobs Posted',
      icon: <FaBriefcase className="w-5 h-5" />,
    },
    {
      value: '20+',
      label: 'Years Strong',
      icon: <FaStar className="w-5 h-5" />,
      static: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-900">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Gradient Orbs */}
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-emerald-500/30 rounded-full blur-3xl animate-blob" />
          <div className="absolute top-1/3 -right-20 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute -bottom-20 left-1/3 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-blob animation-delay-4000" />

          {/* Grid Pattern */}
          <div className="absolute inset-0 pattern-grid opacity-20" />

          {/* Floating Elements */}
          <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-white/20 rounded-full animate-float" />
          <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-emerald-400/30 rounded-full animate-float-delayed" />
          <div className="absolute bottom-1/3 left-1/3 w-5 h-5 bg-teal-400/20 rounded-full animate-float" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8 animate-fade-in">
              <HiSparkles className="w-5 h-5 text-emerald-400 mr-2" />
              <span className="text-emerald-100 text-sm font-medium">Celebrating 20+ Years of Brotherhood</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 animate-slide-up text-shadow-lg">
              Welcome to
              <span className="block mt-2 bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300 bg-clip-text text-transparent">
                Loyola 20O3 Set
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-xl sm:text-2xl text-emerald-100/90 max-w-3xl mx-auto mb-12 animate-slide-up animation-delay-200">
              Connecting, empowering, and supporting members of Loyola College 2003 graduating set.
              <span className="block mt-2 text-emerald-200/70">Together we grow, together we succeed.</span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up animation-delay-300">
              <Link
                to="/directory"
                className="group inline-flex items-center justify-center px-8 py-4 bg-white text-emerald-700 font-semibold rounded-2xl hover:bg-emerald-50 transition-all duration-300 shadow-xl shadow-black/10 hover:shadow-2xl hover:-translate-y-1"
              >
                Browse Directory
                <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/support"
                className="group inline-flex items-center justify-center px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-2xl hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-white/40"
              >
                Request Support
                <FaHandsHelping className="ml-2 group-hover:scale-110 transition-transform" />
              </Link>
            </div>

            {/* Stats in Hero */}
            <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 animate-slide-up animation-delay-400">
              {statsDisplay.map((stat, index) => (
                <div key={index} className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
                  <div className="relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all">
                    <div className="flex justify-center mb-3 text-emerald-300">
                      {stat.icon}
                    </div>
                    <div className="text-3xl sm:text-4xl font-bold text-white mb-1 flex justify-center">
                      {stat.static ? stat.value : (
                        typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value
                      )}
                    </div>
                    <div className="text-emerald-200/70 text-sm font-medium">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#f9fafb"/>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold mb-4">
              Our Platform
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Access all the tools and resources to stay connected with your classmates.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Link
                key={index}
                to={feature.link}
                className="group relative bg-white rounded-3xl p-8 shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 card-hover overflow-hidden"
              >
                {/* Gradient Background on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

                <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white mb-6 shadow-lg ${feature.shadowColor} group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-emerald-700 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{feature.description}</p>
                <span className="inline-flex items-center text-emerald-600 font-semibold group-hover:text-emerald-700">
                  Learn more
                  <FaArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-emerald-50 to-transparent" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-block px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold mb-6">
                About Us
              </span>
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Building Bridges,
                <span className="text-emerald-600"> Creating Legacy</span>
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                The Loyola O3 Set represents the graduating class of 2003 from Loyola College.
                Over the years, we have maintained strong bonds, supporting each other through
                life's journey while giving back to our alma mater.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                This platform serves as our digital home - a place to connect, share opportunities,
                support one another, and celebrate our achievements together.
              </p>
              <Link
                to="/executives"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-emerald-500/30 transition-all duration-300 hover:-translate-y-1"
              >
                Meet Our Executives
                <FaArrowRight className="ml-2" />
              </Link>
            </div>

            <div className="relative">
              {/* Decorative Elements */}
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-emerald-100 rounded-full blur-3xl" />
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-teal-100 rounded-full blur-3xl" />

              <div className="relative grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-3xl p-8 text-white shadow-xl shadow-emerald-500/20">
                    <FaGraduationCap className="w-10 h-10 mb-4" />
                    <h3 className="text-2xl font-bold mb-2">Class of 2003</h3>
                    <p className="text-emerald-100 text-sm">Proud Loyolians</p>
                  </div>
                  <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
                    <div className="text-4xl font-bold text-emerald-600 mb-2">
                      {statsLoading ? (
                        <Skeleton className="w-20 h-10 mx-auto" />
                      ) : (
                        memberCount.toLocaleString()
                      )}
                    </div>
                    <p className="text-gray-600">Active Members</p>
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
                    <div className="text-4xl font-bold text-purple-600 mb-2">
                      {statsLoading ? (
                        <Skeleton className="w-24 h-10 mx-auto" />
                      ) : (
                        formatCurrency(pledgeCount)
                      )}
                    </div>
                    <p className="text-gray-600">Support Pledged</p>
                  </div>
                  <div className="bg-gradient-to-br from-teal-500 to-cyan-500 rounded-3xl p-8 text-white shadow-xl shadow-teal-500/20">
                    <FaHeart className="w-10 h-10 mb-4" />
                    <h3 className="text-2xl font-bold mb-2">United</h3>
                    <p className="text-teal-100 text-sm">In Purpose</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-800" />
        <div className="absolute inset-0 pattern-dots opacity-10" />

        {/* Floating Shapes */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl" />
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-teal-500/20 rounded-full blur-2xl" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 text-shadow">
            Ready to Connect?
          </h2>
          <p className="text-xl text-emerald-100 max-w-2xl mx-auto mb-10">
            Join your fellow Loyola O3 set members and be part of our growing community.
            Together, we achieve more.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/login"
              className="group inline-flex items-center justify-center px-8 py-4 bg-white text-emerald-700 font-bold rounded-2xl hover:bg-emerald-50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1"
            >
              Get Started Now
              <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/news"
              className="inline-flex items-center justify-center px-8 py-4 bg-emerald-500/30 text-white font-semibold rounded-2xl hover:bg-emerald-500/40 transition-all duration-300 border border-white/20"
            >
              Read Latest News
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

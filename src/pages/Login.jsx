import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GOOGLE_SHEETS_CONFIG } from '../config/googleSheets';
import { FaEnvelope, FaLock, FaSpinner, FaGraduationCap, FaArrowLeft, FaEye, FaEyeSlash } from 'react-icons/fa';
import { HiSparkles, HiInformationCircle } from 'react-icons/hi';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isTestingMode } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        navigate('/');
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white">
      {/* Left Side - Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-16 bg-gray-50/50">
        <div className="w-full max-w-md space-y-8">
          
          {/* Top Navigation Row */}
          <div className="flex items-center justify-between mb-4">
            <Link
              to="/"
              className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-emerald-600 transition-colors group"
            >
              <FaArrowLeft className="mr-2 text-xs group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Link>
          </div>

          {/* Header Branding */}
          <div className="text-left">
            <div className="lg:hidden flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <FaGraduationCap className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-black tracking-tight text-gray-900">
                Loyola <span className="text-emerald-600">O3</span>
              </h2>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-3">
              Welcome Back
            </h1>
            <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
              Sign in to your account to stay connected with the 2003 alumni community.
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="flex items-center gap-3 bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm animate-shake">
                <HiInformationCircle className="w-5 h-5 flex-shrink-0" />
                <p className="font-medium">{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-bold text-gray-700 ml-1">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                </div>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 sm:py-4 bg-white border-2 border-gray-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all duration-300 shadow-sm"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label htmlFor="password" className="block text-sm font-bold text-gray-700">
                  Password
                </label>
                <a href="#" className="text-xs font-semibold text-emerald-600 hover:text-emerald-700">
                  Forgot Password?
                </a>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-12 py-3.5 sm:py-4 bg-white border-2 border-gray-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all duration-300 shadow-sm"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-emerald-500 transition-colors"
                >
                  {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </button>
              </div>
              <p className="text-[11px] sm:text-xs text-gray-500 mt-2 flex items-center ml-1">
                <HiSparkles className="w-4 h-4 mr-1 text-emerald-500" />
                Member Tip: Use your registered alumni credentials.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold text-lg hover:bg-emerald-600 hover:shadow-xl hover:shadow-emerald-500/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin mr-3 text-xl" />
                  Verifying...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-widest font-bold">
              <span className="px-4 bg-gray-50/50 text-gray-400">Portal Access</span>
            </div>
          </div>

          {/* Test Credentials - Improved spacing and design */}
          <div className="p-5 bg-white border border-emerald-100 rounded-2xl shadow-sm space-y-2">
            <h3 className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2">
              {isTestingMode ? 'Development Login:' : 'Login Credentials:'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
               <div className="text-sm text-gray-600">
                 <span className="block text-[10px] text-gray-400 font-bold uppercase">Email</span>
                 <code className="text-emerald-700 font-medium">
                   {isTestingMode ? 'test@loyola.com' : 'Your registered email'}
                 </code>
               </div>
               <div className="text-sm text-gray-600">
                 <span className="block text-[10px] text-gray-400 font-bold uppercase">Password</span>
                 <code className="text-emerald-700 font-medium">{GOOGLE_SHEETS_CONFIG.SHARED_PASSWORD}</code>
               </div>
            </div>
          </div>

          <div className="text-center pt-4">
            <p className="text-gray-500 text-sm">
              Problems signing in?{' '}
              <a href="#" className="text-emerald-600 hover:text-emerald-700 font-bold border-b-2 border-emerald-100 hover:border-emerald-600 transition-all">
                Contact Admin
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Decorative Feature Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-900 relative overflow-hidden">
        {/* Dynamic Background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-emerald-600/20 via-transparent to-transparent z-10" />
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl" />
          <div className="absolute inset-0 opacity-[0.03] pattern-grid" />
        </div>

        {/* Content Container */}
        <div className="relative z-20 flex flex-col items-center justify-center w-full p-16 text-center">
          <div className="mb-12">
            <div className="w-20 h-20 bg-emerald-500 rounded-3xl flex items-center justify-center mb-6 shadow-2xl shadow-emerald-500/40 rotate-3 transition-transform hover:rotate-0 duration-500">
              <FaGraduationCap className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-5xl font-black text-white mb-4 tracking-tighter">
              Loyola <span className="text-emerald-400">O3</span>
            </h2>
            <div className="h-1.5 w-20 bg-emerald-500 mx-auto rounded-full" />
          </div>

          <div className="space-y-6 max-w-sm">
            {[
              { title: 'Directory', desc: 'Find and connect with old classmates' },
              { title: 'Support', desc: 'A community that looks out for each other' },
              { title: 'Jobs', desc: 'Exclusive opportunities within the network' }
            ].map((item, idx) => (
              <div key={idx} className="flex gap-4 p-4 rounded-2xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/10 group">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-500 transition-colors">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 group-hover:bg-white" />
                </div>
                <div className="text-left">
                  <h4 className="text-white font-bold">{item.title}</h4>
                  <p className="text-gray-400 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Dynamic Badge */}
          <div className="absolute bottom-12 px-8 py-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-full flex items-center gap-3">
            <div className="flex -space-x-2">
              {[1, 2, 3].map(i => (
                <div key={i} className={`w-6 h-6 rounded-full border-2 border-gray-900 bg-emerald-${i * 100 + 400}`} />
              ))}
            </div>
            <span className="text-white/70 text-xs font-medium tracking-wide uppercase">Join 500+ Alumni</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
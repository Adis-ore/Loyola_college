import { useState, useEffect } from 'react';
import { FaHandsHelping, FaThumbsUp, FaExternalLinkAlt, FaCheckCircle, FaClock, FaUsers, FaSpinner } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { fetchSupportRequestsWithVotes, getUserVotedIds, submitVote } from '../services/googleSheetsService';
import { isConfigured, GOOGLE_SHEETS_CONFIG } from '../config/googleSheets';

// Sample approved support requests - Used when Google Sheets is not configured
const sampleSupportRequests = [
  {
    id: '1',
    title: 'Medical Support for Member',
    description: 'A member needs financial assistance for a medical procedure. Any contribution will go a long way.',
    category: 'Medical',
    requestedBy: 'John A.',
    amount: '₦500,000',
    votes: 45,
    status: 'approved',
    date: '2024-01-10',
  },
  {
    id: '2',
    title: 'Education Scholarship Fund',
    description: 'Support a member\'s child education through university scholarship assistance.',
    category: 'Education',
    requestedBy: 'Mary O.',
    amount: '₦250,000',
    votes: 38,
    status: 'approved',
    date: '2024-01-08',
  },
  {
    id: '3',
    title: 'Business Startup Support',
    description: 'Help a member kickstart their small business with initial capital.',
    category: 'Business',
    requestedBy: 'David N.',
    amount: '₦150,000',
    votes: 27,
    status: 'approved',
    date: '2024-01-05',
  },
  {
    id: '4',
    title: 'Emergency Housing Assistance',
    description: 'A member lost their home due to unforeseen circumstances and needs temporary housing support.',
    category: 'Emergency',
    requestedBy: 'Grace A.',
    amount: '₦300,000',
    votes: 52,
    status: 'approved',
    date: '2024-01-03',
  },
];

const categories = ['All', 'Medical', 'Education', 'Business', 'Emergency', 'Other'];

const Support = () => {
  const { user } = useAuth();
  const [supportRequests, setSupportRequests] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [votedItems, setVotedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [votingId, setVotingId] = useState(null);
  const [error, setError] = useState(null);

  // Google Form URL for requesting support
  const GOOGLE_FORM_URL = GOOGLE_SHEETS_CONFIG.FORMS.SUPPORT_REQUEST || 'https://docs.google.com/forms/d/e/YOUR_FORM_ID/viewform';

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        if (isConfigured()) {
          // Fetch support requests with vote counts
          const requests = await fetchSupportRequestsWithVotes();
          setSupportRequests(requests);

          // Fetch user's voted items if logged in
          if (user?.email) {
            const userVotes = await getUserVotedIds(user.email);
            setVotedItems(userVotes);
          }
        } else {
          // Use sample data in development
          setSupportRequests(sampleSupportRequests);
        }
      } catch (err) {
        console.error('Error loading support requests:', err);
        setError('Failed to load support requests. Using sample data.');
        setSupportRequests(sampleSupportRequests);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user?.email]);

  const handleVote = async (id) => {
    if (votedItems.includes(String(id))) return;
    if (!user?.email) {
      setError('Please log in to vote');
      return;
    }

    setVotingId(id);

    try {
      if (isConfigured()) {
        // Submit vote to Google Sheets
        const result = await submitVote(id, user.email);

        if (result.success) {
          // Update local state
          setSupportRequests((prev) =>
            prev.map((request) =>
              request.id === id ? { ...request, votes: request.votes + 1 } : request
            )
          );
          setVotedItems((prev) => [...prev, String(id)]);
        } else {
          setError(result.message);
        }
      } else {
        // Local voting for development
        setSupportRequests((prev) =>
          prev.map((request) =>
            request.id === id ? { ...request, votes: request.votes + 1 } : request
          )
        );
        setVotedItems((prev) => [...prev, String(id)]);
      }
    } catch (err) {
      console.error('Error submitting vote:', err);
      setError('Failed to submit vote. Please try again.');
    } finally {
      setVotingId(null);
    }
  };

  const filteredRequests =
    selectedCategory === 'All'
      ? supportRequests
      : supportRequests.filter((r) => r.category === selectedCategory);

  const sortedRequests = [...filteredRequests].sort((a, b) => b.votes - a.votes);

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-800 to-purple-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-white text-center mb-4">
            Support Center
          </h1>
          <p className="text-purple-100 text-center max-w-2xl mx-auto">
            Request support from the community or vote for causes you believe in.
            Together, we can make a difference.
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl text-sm flex justify-between items-center">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="text-red-600 hover:text-red-800">
              &times;
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Request Support CTA */}
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-2xl p-8 mb-12 text-center">
          <FaHandsHelping className="w-12 h-12 text-white mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Need Support?</h2>
          <p className="text-emerald-100 mb-6 max-w-xl mx-auto">
            Submit a support request and let the community help. All requests are reviewed
            by the admin before being published.
          </p>
          <a
            href={GOOGLE_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-8 py-4 bg-white text-emerald-700 font-semibold rounded-lg hover:bg-emerald-50 transition-colors shadow-lg"
          >
            Request Support
            <FaExternalLinkAlt className="ml-2 w-4 h-4" />
          </a>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Support Requests Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <FaCheckCircle className="text-emerald-500 mr-2" />
            Approved Support Requests
          </h2>
          <p className="text-gray-600 mb-6">
            Vote for the causes you support. Higher votes help prioritize support allocation.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <FaSpinner className="w-12 h-12 text-purple-500 animate-spin mb-4" />
            <p className="text-gray-600 font-medium">Loading support requests...</p>
          </div>
        ) : sortedRequests.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sortedRequests.map((request, index) => (
              <div
                key={request.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100"
              >
                {/* Rank Badge */}
                {index < 3 && (
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold mb-4 ${
                    index === 0 ? 'bg-yellow-100 text-yellow-700' :
                    index === 1 ? 'bg-gray-100 text-gray-700' :
                    'bg-orange-100 text-orange-700'
                  }`}>
                    #{index + 1} Most Voted
                  </div>
                )}

                {/* Category */}
                <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full mb-3">
                  {request.category}
                </span>

                {/* Title and Description */}
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {request.title}
                </h3>
                <p className="text-gray-600 mb-4">{request.description}</p>

                {/* Meta Info */}
                <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                  <span className="flex items-center">
                    <FaUsers className="mr-1" />
                    {request.requestedBy}
                  </span>
                  <span className="flex items-center">
                    <FaClock className="mr-1" />
                    {request.date}
                  </span>
                  <span className="font-semibold text-emerald-600">
                    {request.amount}
                  </span>
                </div>

                {/* Vote Section */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center text-gray-600">
                    <FaThumbsUp className="mr-2 text-purple-500" />
                    <span className="font-semibold">{request.votes} votes</span>
                  </div>
                  <button
                    onClick={() => handleVote(request.id)}
                    disabled={votedItems.includes(String(request.id)) || votingId === request.id}
                    className={`px-6 py-2 rounded-lg font-medium transition-colors flex items-center ${
                      votedItems.includes(String(request.id))
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-purple-600 text-white hover:bg-purple-700'
                    }`}
                  >
                    {votingId === request.id ? (
                      <>
                        <FaSpinner className="animate-spin mr-2" />
                        Voting...
                      </>
                    ) : votedItems.includes(String(request.id)) ? (
                      'Voted'
                    ) : (
                      'Vote'
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl">
            <FaHandsHelping className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No support requests in this category
            </h3>
            <p className="text-gray-500">Check back later or select a different category</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Support;

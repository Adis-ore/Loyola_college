import { useState, useEffect } from 'react';
import { FaHandsHelping, FaThumbsUp, FaExternalLinkAlt, FaCheckCircle, FaClock, FaUsers, FaSpinner, FaTimes, FaComment, FaMoneyBillWave } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { fetchSupportRequestsWithVotes, getUserVotedIds, submitVote } from '../services/googleSheetsService';
import { isConfigured, GOOGLE_SHEETS_CONFIG } from '../config/googleSheets';
import { SupportCardSkeleton } from '../components/Skeleton';

// Sample approved support requests - Used when Google Sheets is not configured
const sampleSupportRequests = [
  {
    id: '1',
    title: 'Medical Support for Member',
    description: 'A member needs financial assistance for a medical procedure. Any contribution will go a long way.',
    category: 'Medical',
    requestedBy: 'John A.',
    amount: '₦500,000',
    votes: 3,
    totalPledged: 150000,
    status: 'approved',
    date: '2024-01-10',
    comments: [
      { userName: 'Mary O.', comment: 'I will support with 50,000 naira', pledgeAmount: 50000, timestamp: '2024-01-12T10:00:00Z' },
      { userName: 'David N.', comment: 'Count me in for 100,000', pledgeAmount: 100000, timestamp: '2024-01-11T15:30:00Z' },
    ],
  },
  {
    id: '2',
    title: 'Education Scholarship Fund',
    description: 'Support a member\'s child education through university scholarship assistance.',
    category: 'Education',
    requestedBy: 'Mary O.',
    amount: '₦250,000',
    votes: 2,
    totalPledged: 75000,
    status: 'approved',
    date: '2024-01-08',
    comments: [
      { userName: 'Grace A.', comment: 'Happy to contribute 75,000', pledgeAmount: 75000, timestamp: '2024-01-09T09:00:00Z' },
    ],
  },
  {
    id: '3',
    title: 'Business Startup Support',
    description: 'Help a member kickstart their small business with initial capital.',
    category: 'Business',
    requestedBy: 'David N.',
    amount: '₦150,000',
    votes: 1,
    totalPledged: 30000,
    status: 'approved',
    date: '2024-01-05',
    comments: [],
  },
];

const categories = ['All', 'Medical', 'Education', 'Business', 'Emergency', 'Other'];

// Format currency
const formatCurrency = (amount) => {
  if (!amount || amount === 0) return '₦0';
  return '₦' + amount.toLocaleString('en-NG');
};

// Vote Modal Component
const VoteModal = ({ isOpen, onClose, request, user, onSubmit, isSubmitting }) => {
  const [comment, setComment] = useState('');
  const [pledgeAmount, setPledgeAmount] = useState('');
  const [error, setError] = useState('');

  if (!isOpen || !request) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!comment.trim()) {
      setError('Please add a comment about your support');
      return;
    }

    const pledge = pledgeAmount ? parseFloat(pledgeAmount.replace(/,/g, '')) : 0;
    onSubmit(request.id, comment, pledge);
  };

  const handlePledgeChange = (e) => {
    // Allow only numbers and commas
    const value = e.target.value.replace(/[^0-9,]/g, '');
    setPledgeAmount(value);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-purple-700 p-6 rounded-t-2xl">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-bold text-white">Support This Request</h3>
              <p className="text-purple-100 text-sm mt-1">{request.title}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* User Info */}
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-sm text-gray-500 mb-1">Supporting as:</p>
            <p className="font-semibold text-gray-900">{user?.name || 'Member'}</p>
            <p className="text-sm text-gray-600">{user?.email}</p>
          </div>

          {/* Comment Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Your Message of Support <span className="text-red-500">*</span>
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="e.g., I will support with 50,000 naira. Wishing you a quick recovery!"
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none resize-none"
              required
            />
          </div>

          {/* Pledge Amount Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Pledge Amount (Optional)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">₦</span>
              <input
                type="text"
                value={pledgeAmount}
                onChange={handlePledgeChange}
                placeholder="0"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              This is a pledge amount you intend to contribute. The admin will contact you for actual payment.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isSubmitting ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                Submitting...
              </>
            ) : (
              <>
                <FaThumbsUp className="mr-2" />
                Confirm Support
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

// Comments Section Component
const CommentsSection = ({ comments, totalPledged }) => {
  const [showAll, setShowAll] = useState(false);

  if (!comments || comments.length === 0) {
    return (
      <div className="mt-4 pt-4 border-t border-gray-100">
        <p className="text-sm text-gray-400 italic">No support messages yet. Be the first to support!</p>
      </div>
    );
  }

  const displayComments = showAll ? comments : comments.slice(0, 2);

  return (
    <div className="mt-4 pt-4 border-t border-gray-100">
      {/* Total Pledged */}
      {totalPledged > 0 && (
        <div className="bg-emerald-50 rounded-lg px-4 py-2 mb-4 flex items-center justify-between">
          <span className="text-sm text-emerald-700 font-medium">Total Pledged:</span>
          <span className="text-lg font-bold text-emerald-600">{formatCurrency(totalPledged)}</span>
        </div>
      )}

      {/* Comments */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-gray-700 flex items-center">
          <FaComment className="mr-2 text-purple-500" />
          Support Messages ({comments.length})
        </h4>

        {displayComments.map((comment, index) => (
          <div key={index} className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="font-semibold text-gray-900 text-sm">{comment.userName}</span>
                {comment.pledgeAmount > 0 && (
                  <span className="text-emerald-600 font-medium text-sm ml-2">
                    pledged {formatCurrency(comment.pledgeAmount)}
                  </span>
                )}
              </div>
              <span className="text-xs text-gray-400">
                {new Date(comment.timestamp).toLocaleDateString()}
              </span>
            </div>
            <p className="text-gray-600 text-sm mt-1">{comment.comment}</p>
          </div>
        ))}

        {comments.length > 2 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-sm text-purple-600 hover:text-purple-700 font-medium"
          >
            {showAll ? 'Show less' : `View all ${comments.length} messages`}
          </button>
        )}
      </div>
    </div>
  );
};

const Support = () => {
  const { user } = useAuth();
  const [supportRequests, setSupportRequests] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [votedItems, setVotedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Google Form URL for requesting support
  const GOOGLE_FORM_URL = GOOGLE_SHEETS_CONFIG.FORMS?.SUPPORT_REQUEST || 'https://docs.google.com/forms/d/e/YOUR_FORM_ID/viewform';

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        if (isConfigured()) {
          // Fetch support requests with vote counts, pledges, and comments
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

  const handleOpenModal = (request) => {
    if (!user?.email) {
      setError('Please log in to support this request');
      return;
    }
    if (votedItems.includes(String(request.id))) {
      setError('You have already supported this request');
      return;
    }
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRequest(null);
  };

  const handleSubmitVote = async (requestId, comment, pledgeAmount) => {
    if (!user?.email) {
      setError('Please log in to vote');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      if (isConfigured()) {
        // Submit vote with comment and pledge to Google Sheets
        const result = await submitVote(
          requestId,
          user.email,
          user.name || 'Member',
          comment,
          pledgeAmount
        );

        if (result.success) {
          // Update local state
          setSupportRequests((prev) =>
            prev.map((request) =>
              request.id === requestId
                ? {
                    ...request,
                    votes: request.votes + 1,
                    totalPledged: (request.totalPledged || 0) + pledgeAmount,
                    comments: [
                      {
                        userName: user.name || 'Member',
                        comment: comment,
                        pledgeAmount: pledgeAmount,
                        timestamp: new Date().toISOString(),
                      },
                      ...(request.comments || []),
                    ],
                  }
                : request
            )
          );
          setVotedItems((prev) => [...prev, String(requestId)]);
          setSuccessMessage('Thank you for your support! The admin will contact you for payment details.');
          handleCloseModal();

          // Clear success message after 5 seconds
          setTimeout(() => setSuccessMessage(null), 5000);
        } else {
          setError(result.message);
        }
      } else {
        // Local voting for development
        setSupportRequests((prev) =>
          prev.map((request) =>
            request.id === requestId
              ? {
                  ...request,
                  votes: request.votes + 1,
                  totalPledged: (request.totalPledged || 0) + pledgeAmount,
                  comments: [
                    {
                      userName: user?.name || 'Test User',
                      comment: comment,
                      pledgeAmount: pledgeAmount,
                      timestamp: new Date().toISOString(),
                    },
                    ...(request.comments || []),
                  ],
                }
              : request
          )
        );
        setVotedItems((prev) => [...prev, String(requestId)]);
        setSuccessMessage('Your support has been recorded! (Demo mode)');
        handleCloseModal();
        setTimeout(() => setSuccessMessage(null), 5000);
      }
    } catch (err) {
      console.error('Error submitting vote:', err);
      setError('Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
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
            Request support from the community or pledge your support for causes you believe in.
            Together, we can make a difference.
          </p>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-sm flex justify-between items-center">
            <span className="flex items-center">
              <FaCheckCircle className="mr-2" />
              {successMessage}
            </span>
            <button onClick={() => setSuccessMessage(null)} className="text-emerald-600 hover:text-emerald-800">
              &times;
            </button>
          </div>
        </div>
      )}

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
            Submit a support request and let the community help. Your request will appear here for members to support.
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
            Support Requests
          </h2>
          <p className="text-gray-600 mb-6">
            Support the causes you believe in by pledging your contribution. Higher support helps prioritize requests.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <SupportCardSkeleton key={i} />
            ))}
          </div>
        ) : sortedRequests.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                    #{index + 1} Most Supported
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
                    Goal: {request.amount}
                  </span>
                </div>

                {/* Vote Section */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center text-gray-600">
                      <FaThumbsUp className="mr-2 text-purple-500" />
                      <span className="font-semibold">{request.votes} supporters</span>
                    </div>
                    {request.totalPledged > 0 && (
                      <div className="flex items-center text-emerald-600">
                        <FaMoneyBillWave className="mr-1" />
                        <span className="font-semibold">{formatCurrency(request.totalPledged)}</span>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => handleOpenModal(request)}
                    disabled={votedItems.includes(String(request.id))}
                    className={`px-6 py-2 rounded-lg font-medium transition-colors flex items-center ${
                      votedItems.includes(String(request.id))
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-purple-600 text-white hover:bg-purple-700'
                    }`}
                  >
                    {votedItems.includes(String(request.id)) ? (
                      <>
                        <FaCheckCircle className="mr-2" />
                        Supported
                      </>
                    ) : (
                      <>
                        <FaHandsHelping className="mr-2" />
                        Support
                      </>
                    )}
                  </button>
                </div>

                {/* Comments Section */}
                <CommentsSection
                  comments={request.comments}
                  totalPledged={request.totalPledged}
                />
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

      {/* Vote Modal */}
      <VoteModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        request={selectedRequest}
        user={user}
        onSubmit={handleSubmitVote}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default Support;

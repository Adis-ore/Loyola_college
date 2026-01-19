import { useState } from 'react';
import { FaNewspaper, FaCalendar, FaUser, FaChevronRight, FaSearch } from 'react-icons/fa';

// Sample news data - In production, this comes from Google Sheets
const sampleNews = [
  {
    id: 1,
    title: 'Annual Reunion 2024 - Save the Date!',
    excerpt: 'Mark your calendars for our upcoming annual reunion. This year promises to be the biggest gathering yet with exciting activities planned.',
    content: 'We are excited to announce our Annual Reunion 2024! This year, we will be gathering at Lagos Continental Hotel on December 15th, 2024. The event will feature networking sessions, awards ceremony, and a grand dinner. Early bird registration is now open.',
    author: 'Executive Committee',
    date: '2024-01-15',
    category: 'Events',
    image: null,
    featured: true,
  },
  {
    id: 2,
    title: 'New Executive Council Elected',
    excerpt: 'Congratulations to our newly elected executive council members who will serve for the 2024-2026 term.',
    content: 'The election results are in! We congratulate all newly elected executive council members. The new team will be inaugurated next month and has already begun planning exciting initiatives for our set.',
    author: 'Electoral Committee',
    date: '2024-01-12',
    category: 'Announcement',
    image: null,
    featured: false,
  },
  {
    id: 3,
    title: 'Scholarship Fund Reaches ₦10 Million',
    excerpt: 'Thanks to generous contributions from members, our scholarship fund has reached a significant milestone.',
    content: 'Our collective efforts have paid off! The Loyola O3 Set Scholarship Fund has reached ₦10 million. This fund will support the education of deserving students from our alma mater. Applications for the next batch of scholarships will open in February.',
    author: 'Welfare Committee',
    date: '2024-01-10',
    category: 'Achievement',
    image: null,
    featured: true,
  },
  {
    id: 4,
    title: 'Monthly Virtual Meetup - January Edition',
    excerpt: 'Join us for our monthly virtual meetup where we catch up with members around the world.',
    content: 'Our first virtual meetup of 2024 is scheduled for January 25th at 8 PM WAT. The Zoom link will be shared via our WhatsApp group. This month, we will be featuring a special presentation from one of our members in the diaspora.',
    author: 'Social Committee',
    date: '2024-01-08',
    category: 'Events',
    image: null,
    featured: false,
  },
  {
    id: 5,
    title: 'Member Spotlight: Dr. Adaeze Nwosu',
    excerpt: 'Celebrating our member who recently received a prestigious medical award.',
    content: 'We are proud to announce that Dr. Adaeze Nwosu, our distinguished member, has received the African Medical Excellence Award for her groundbreaking research in tropical diseases. Congratulations, Dr. Nwosu!',
    author: 'Publicity Committee',
    date: '2024-01-05',
    category: 'Spotlight',
    image: null,
    featured: false,
  },
];

const categories = ['All', 'Events', 'Announcement', 'Achievement', 'Spotlight'];

const News = () => {
  const [news] = useState(sampleNews);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNews, setSelectedNews] = useState(null);

  const filteredNews = news.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredNews = news.filter((item) => item.featured);

  if (selectedNews) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <button
            onClick={() => setSelectedNews(null)}
            className="flex items-center text-emerald-600 hover:text-emerald-700 mb-6"
          >
            &larr; Back to News
          </button>

          <article className="bg-white rounded-2xl shadow-sm p-8">
            <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 text-sm font-medium rounded-full mb-4">
              {selectedNews.category}
            </span>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {selectedNews.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-8">
              <span className="flex items-center">
                <FaUser className="mr-2" />
                {selectedNews.author}
              </span>
              <span className="flex items-center">
                <FaCalendar className="mr-2" />
                {new Date(selectedNews.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
            <div className="prose prose-lg max-w-none text-gray-700">
              <p>{selectedNews.content}</p>
            </div>
          </article>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-500 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-white text-center mb-4">
            News Corner
          </h1>
          <p className="text-orange-100 text-center max-w-2xl mx-auto">
            Stay updated with the latest news, announcements, and happenings from our community.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Featured News */}
        {featuredNews.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured News</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredNews.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedNews(item)}
                  className="bg-gradient-to-br from-emerald-600 to-emerald-500 rounded-2xl p-6 cursor-pointer hover:shadow-lg transition-shadow"
                >
                  <span className="inline-block px-3 py-1 bg-white/20 text-white text-xs font-medium rounded-full mb-4">
                    Featured
                  </span>
                  <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-emerald-100 mb-4">{item.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-emerald-200 text-sm">
                      {new Date(item.date).toLocaleDateString()}
                    </span>
                    <span className="text-white flex items-center">
                      Read more <FaChevronRight className="ml-1" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search and Filter */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search news..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-orange-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* News List */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">All News</h2>
        </div>

        {filteredNews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNews.map((item) => (
              <article
                key={item.id}
                onClick={() => setSelectedNews(item)}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100 cursor-pointer"
              >
                <span className="inline-block px-3 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full mb-4">
                  {item.category}
                </span>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{item.excerpt}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span className="flex items-center">
                    <FaCalendar className="mr-2" />
                    {new Date(item.date).toLocaleDateString()}
                  </span>
                  <span className="text-orange-600 flex items-center hover:text-orange-700">
                    Read <FaChevronRight className="ml-1" />
                  </span>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl">
            <FaNewspaper className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No news found</h3>
            <p className="text-gray-500">Try adjusting your search or filter</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default News;

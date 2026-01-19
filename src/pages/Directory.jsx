import { useState, useEffect } from 'react';
import { FaSearch, FaUser, FaEnvelope, FaPhone, FaBriefcase, FaBirthdayCake, FaUsers } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi';

// Sample data - In production, this will come from Google Sheets
const sampleMembers = [
  { id: 1, name: 'John Adeyemi', email: 'john.adeyemi@email.com', phone: '+234 801 234 5678', work: 'Software Engineer', birthday: 'March 15', class: 'Science' },
  { id: 2, name: 'Mary Okonkwo', email: 'mary.okonkwo@email.com', phone: '+234 802 345 6789', work: 'Doctor', birthday: 'July 22', class: 'Science' },
  { id: 3, name: 'David Nnamdi', email: 'david.nnamdi@email.com', phone: '+234 803 456 7890', work: 'Lawyer', birthday: 'January 8', class: 'Arts' },
  { id: 4, name: 'Grace Adeola', email: 'grace.adeola@email.com', phone: '+234 804 567 8901', work: 'Banker', birthday: 'September 30', class: 'Commercial' },
  { id: 5, name: 'Peter Obi', email: 'peter.obi@email.com', phone: '+234 805 678 9012', work: 'Entrepreneur', birthday: 'December 5', class: 'Science' },
  { id: 6, name: 'Sarah Ibrahim', email: 'sarah.ibrahim@email.com', phone: '+234 806 789 0123', work: 'Teacher', birthday: 'April 18', class: 'Arts' },
  { id: 7, name: 'Michael Eze', email: 'michael.eze@email.com', phone: '+234 807 890 1234', work: 'Architect', birthday: 'June 12', class: 'Science' },
  { id: 8, name: 'Linda Ajayi', email: 'linda.ajayi@email.com', phone: '+234 808 901 2345', work: 'Pharmacist', birthday: 'November 25', class: 'Science' },
];

const Directory = () => {
  const [members] = useState(sampleMembers);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('All');
  const [filteredMembers, setFilteredMembers] = useState(sampleMembers);

  const classes = ['All', 'Science', 'Arts', 'Commercial'];

  const classColors = {
    Science: { bg: 'bg-blue-100', text: 'text-blue-700', gradient: 'from-blue-500 to-blue-600' },
    Arts: { bg: 'bg-purple-100', text: 'text-purple-700', gradient: 'from-purple-500 to-purple-600' },
    Commercial: { bg: 'bg-orange-100', text: 'text-orange-700', gradient: 'from-orange-500 to-orange-600' },
  };

  useEffect(() => {
    let filtered = members;

    if (searchTerm) {
      filtered = filtered.filter(
        (member) =>
          member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.work.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedClass !== 'All') {
      filtered = filtered.filter((member) => member.class === selectedClass);
    }

    setFilteredMembers(filtered);
  }, [searchTerm, selectedClass, members]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Header */}
      <div className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800" />
        <div className="absolute inset-0 pattern-dots opacity-10" />

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-10 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
              <FaUsers className="w-4 h-4 text-blue-300 mr-2" />
              <span className="text-blue-100 text-sm font-medium">{members.length} Members</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 text-shadow-lg">
              Member Directory
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Find and connect with fellow Loyola O3 set members
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 border border-gray-100">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, profession, or email..."
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-blue-500 focus:bg-white outline-none transition-all duration-300"
              />
            </div>

            {/* Class Filter Pills */}
            <div className="flex flex-wrap gap-2">
              {classes.map((cls) => (
                <button
                  key={cls}
                  onClick={() => setSelectedClass(cls)}
                  className={`px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    selectedClass === cls
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cls}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing <span className="font-semibold text-gray-700">{filteredMembers.length}</span> of{' '}
              <span className="font-semibold text-gray-700">{members.length}</span> members
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear search
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Members Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {filteredMembers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMembers.map((member, index) => {
              const colors = classColors[member.class] || classColors.Science;
              return (
                <div
                  key={member.id}
                  className="group bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-500 p-6 border border-gray-100 card-hover overflow-hidden relative"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Hover Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

                  {/* Avatar */}
                  <div className="relative flex justify-center mb-5">
                    <div className={`w-20 h-20 bg-gradient-to-br ${colors.gradient} rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                      <span className="text-2xl font-bold text-white">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                  </div>

                  {/* Name and Class */}
                  <div className="text-center mb-5">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {member.name}
                    </h3>
                    <span className={`inline-flex items-center px-3 py-1 ${colors.bg} ${colors.text} text-xs font-semibold rounded-full`}>
                      <HiSparkles className="w-3 h-3 mr-1" />
                      {member.class}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600 group/item hover:text-blue-600 transition-colors">
                      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center mr-3 group-hover/item:bg-blue-100 transition-colors">
                        <FaBriefcase className="w-3.5 h-3.5 text-gray-400 group-hover/item:text-blue-500 transition-colors" />
                      </div>
                      <span className="truncate font-medium">{member.work}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 group/item hover:text-blue-600 transition-colors">
                      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center mr-3 group-hover/item:bg-blue-100 transition-colors">
                        <FaEnvelope className="w-3.5 h-3.5 text-gray-400 group-hover/item:text-blue-500 transition-colors" />
                      </div>
                      <span className="truncate">{member.email}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 group/item hover:text-blue-600 transition-colors">
                      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center mr-3 group-hover/item:bg-blue-100 transition-colors">
                        <FaPhone className="w-3.5 h-3.5 text-gray-400 group-hover/item:text-blue-500 transition-colors" />
                      </div>
                      <span>{member.phone}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 group/item hover:text-blue-600 transition-colors">
                      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center mr-3 group-hover/item:bg-blue-100 transition-colors">
                        <FaBirthdayCake className="w-3.5 h-3.5 text-gray-400 group-hover/item:text-blue-500 transition-colors" />
                      </div>
                      <span>{member.birthday}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 flex gap-3">
                    <a
                      href={`mailto:${member.email}`}
                      className={`flex-1 text-center px-4 py-3 bg-gradient-to-r ${colors.gradient} text-white text-sm font-semibold rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5`}
                    >
                      Email
                    </a>
                    <a
                      href={`tel:${member.phone}`}
                      className="flex-1 text-center px-4 py-3 bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-200 transition-all duration-300"
                    >
                      Call
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaUser className="w-12 h-12 text-gray-300" />
            </div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">No members found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your search or filter criteria</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedClass('All');
              }}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Directory;

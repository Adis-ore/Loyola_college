import { useState, useEffect } from 'react';
import { FaBriefcase, FaMapMarkerAlt, FaClock, FaMoneyBillWave, FaExternalLinkAlt, FaSearch, FaBuilding } from 'react-icons/fa';
import { fetchJobs } from '../services/googleSheetsService';
import { isConfigured, GOOGLE_SHEETS_CONFIG } from '../config/googleSheets';
import { JobCardSkeleton, Skeleton } from '../components/Skeleton';

// Sample jobs data - Used when Google Sheets is not configured
const sampleJobs = [
  {
    id: 1,
    title: 'Senior Software Engineer',
    company: 'Tech Solutions Ltd',
    location: 'Lagos, Nigeria',
    type: 'Full-time',
    salary: '₦800,000 - ₦1,200,000/month',
    description: 'We are looking for an experienced software engineer to join our growing team. Must have experience with React, Node.js, and cloud technologies.',
    requirements: ['5+ years experience', 'React/Node.js', 'Cloud platforms', 'Team leadership'],
    postedBy: 'John A.',
    postedDate: '2024-01-15',
    applyLink: '#',
  },
  {
    id: 2,
    title: 'Marketing Manager',
    company: 'Global Brands Inc',
    location: 'Abuja, Nigeria',
    type: 'Full-time',
    salary: '₦500,000 - ₦700,000/month',
    description: 'Lead our marketing team and develop strategies to increase brand awareness and market share.',
    requirements: ['MBA preferred', '7+ years marketing', 'Team management', 'Digital marketing'],
    postedBy: 'Mary O.',
    postedDate: '2024-01-14',
    applyLink: '#',
  },
  {
    id: 3,
    title: 'Financial Analyst',
    company: 'Investment Partners',
    location: 'Lagos, Nigeria',
    type: 'Full-time',
    salary: '₦400,000 - ₦600,000/month',
    description: 'Analyze financial data and provide insights to support investment decisions.',
    requirements: ['CFA/ACCA', '3+ years experience', 'Financial modeling', 'Excel proficiency'],
    postedBy: 'David N.',
    postedDate: '2024-01-12',
    applyLink: '#',
  },
  {
    id: 4,
    title: 'Project Manager (Contract)',
    company: 'Construction Co',
    location: 'Port Harcourt, Nigeria',
    type: 'Contract',
    salary: '₦600,000 - ₦900,000/month',
    description: 'Manage large-scale construction projects from inception to completion.',
    requirements: ['PMP certified', '10+ years experience', 'Construction background', 'Leadership skills'],
    postedBy: 'Grace A.',
    postedDate: '2024-01-10',
    applyLink: '#',
  },
  {
    id: 5,
    title: 'HR Business Partner',
    company: 'Multinational Corp',
    location: 'Lagos, Nigeria',
    type: 'Full-time',
    salary: '₦450,000 - ₦650,000/month',
    description: 'Partner with business leaders to drive HR strategies and initiatives.',
    requirements: ['CIPM/SHRM', '5+ years HR', 'Strategic thinking', 'Communication skills'],
    postedBy: 'Peter O.',
    postedDate: '2024-01-08',
    applyLink: '#',
  },
  {
    id: 6,
    title: 'Remote Data Analyst',
    company: 'Data Insights Co',
    location: 'Remote',
    type: 'Remote',
    salary: '$3,000 - $5,000/month',
    description: 'Work with international clients to analyze data and provide actionable insights.',
    requirements: ['Python/R', 'SQL proficiency', 'Data visualization', 'Communication'],
    postedBy: 'Sarah I.',
    postedDate: '2024-01-05',
    applyLink: '#',
  },
];

const jobTypes = ['All', 'Full-time', 'Contract', 'Remote', 'Part-time'];
const locations = ['All Locations', 'Lagos', 'Abuja', 'Port Harcourt', 'Remote'];

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Google Form URL for posting jobs
  const POST_JOB_FORM_URL = GOOGLE_SHEETS_CONFIG.FORMS.POST_JOB || 'https://docs.google.com/forms/d/e/YOUR_FORM_ID/viewform';

  useEffect(() => {
    const loadJobs = async () => {
      setLoading(true);
      setError(null);

      try {
        if (isConfigured()) {
          const data = await fetchJobs();
          setJobs(data);
        } else {
          setJobs(sampleJobs);
        }
      } catch (err) {
        console.error('Error loading jobs:', err);
        setError('Failed to load jobs. Using sample data.');
        setJobs(sampleJobs);
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, []);

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'All' || job.type === selectedType;
    const matchesLocation =
      selectedLocation === 'All Locations' ||
      job.location.toLowerCase().includes(selectedLocation.toLowerCase());
    return matchesSearch && matchesType && matchesLocation;
  });

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-700 to-teal-500 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-white text-center mb-4">
            Job Board
          </h1>
          <p className="text-teal-100 text-center max-w-2xl mx-auto">
            Explore job opportunities shared by fellow Loyola O3 set members.
            Help each other grow professionally.
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Post Job CTA */}
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-2xl p-8 mb-12 text-center">
          <FaBriefcase className="w-12 h-12 text-white mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Have a Job Opening?</h2>
          <p className="text-emerald-100 mb-6 max-w-xl mx-auto">
            Share job opportunities with fellow members. Help them find their next career move.
          </p>
          <a
            href={POST_JOB_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-8 py-4 bg-white text-emerald-700 font-semibold rounded-lg hover:bg-emerald-50 transition-colors shadow-lg"
          >
            Post a Job
            <FaExternalLinkAlt className="ml-2 w-4 h-4" />
          </a>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Job Listings Skeleton */}
            <div className="lg:col-span-2 space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <JobCardSkeleton key={i} />
              ))}
            </div>
            {/* Details Panel Skeleton */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <Skeleton className="w-3/4 h-6 mb-2" />
                <Skeleton className="w-1/2 h-4 mb-6" />
                <div className="space-y-3 mb-6">
                  <Skeleton className="w-full h-4" />
                  <Skeleton className="w-full h-4" />
                  <Skeleton className="w-full h-4" />
                </div>
                <Skeleton className="w-full h-10 rounded-lg" />
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Search and Filters */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                  <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search jobs by title or company..."
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                  />
                </div>

                {/* Type Filter */}
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none appearance-none bg-white min-w-[150px]"
                >
                  {jobTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>

                {/* Location Filter */}
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none appearance-none bg-white min-w-[150px]"
                >
                  {locations.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-4 text-sm text-gray-500">
                Showing {filteredJobs.length} of {jobs.length} jobs
              </div>
            </div>

            {/* Jobs List */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Job Listings */}
              <div className="lg:col-span-2 space-y-4">
                {filteredJobs.length > 0 ? (
                  filteredJobs.map((job) => (
                    <div
                      key={job.id}
                      onClick={() => setSelectedJob(job)}
                      className={`bg-white rounded-xl shadow-sm p-6 border cursor-pointer transition-all ${
                        selectedJob?.id === job.id
                          ? 'border-teal-500 ring-2 ring-teal-200'
                          : 'border-gray-100 hover:shadow-md'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {job.title}
                          </h3>
                          <div className="flex items-center text-gray-600 text-sm">
                            <FaBuilding className="mr-2" />
                            {job.company}
                          </div>
                        </div>
                        <span
                          className={`px-3 py-1 text-xs font-medium rounded-full ${
                            job.type === 'Full-time'
                              ? 'bg-green-100 text-green-700'
                              : job.type === 'Remote'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-orange-100 text-orange-700'
                          }`}
                        >
                          {job.type}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                        <span className="flex items-center">
                          <FaMapMarkerAlt className="mr-1" />
                          {job.location}
                        </span>
                        <span className="flex items-center">
                          <FaMoneyBillWave className="mr-1" />
                          {job.salary}
                        </span>
                        <span className="flex items-center">
                          <FaClock className="mr-1" />
                          {new Date(job.postedDate).toLocaleDateString()}
                        </span>
                      </div>

                      <p className="text-gray-600 text-sm line-clamp-2">{job.description}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-16 bg-white rounded-xl">
                    <FaBriefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No jobs found</h3>
                    <p className="text-gray-500">Try adjusting your search or filters</p>
                  </div>
                )}
              </div>

              {/* Job Details Panel */}
              <div className="lg:col-span-1">
                {selectedJob ? (
                  <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 sticky top-24">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {selectedJob.title}
                    </h3>
                    <p className="text-teal-600 font-medium mb-4">{selectedJob.company}</p>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center text-sm text-gray-600">
                        <FaMapMarkerAlt className="w-4 h-4 mr-3 text-gray-400" />
                        {selectedJob.location}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <FaMoneyBillWave className="w-4 h-4 mr-3 text-gray-400" />
                        {selectedJob.salary}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <FaClock className="w-4 h-4 mr-3 text-gray-400" />
                        Posted {new Date(selectedJob.postedDate).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                      <p className="text-gray-600 text-sm">{selectedJob.description}</p>
                    </div>

                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-2">Requirements</h4>
                      <ul className="space-y-1">
                        {selectedJob.requirements.map((req, index) => (
                          <li key={index} className="text-gray-600 text-sm flex items-center">
                            <span className="w-1.5 h-1.5 bg-teal-500 rounded-full mr-2"></span>
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="text-sm text-gray-500 mb-6">
                      Posted by: {selectedJob.postedBy}
                    </div>

                    <a
                      href={selectedJob.applyLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full text-center px-6 py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors"
                    >
                      Apply Now
                    </a>
                  </div>
                ) : (
                  <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 text-center">
                    <FaBriefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Select a job to view details</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Jobs;

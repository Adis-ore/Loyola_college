import { useState, useEffect } from 'react';
import { FaFileDownload, FaCalendarAlt, FaFilePdf, FaChevronDown } from 'react-icons/fa';
import { fetchFinancialReports } from '../services/googleSheetsService';
import { Skeleton } from './Skeleton';

// const sampleReports = [
//   { id: 1, year: '2025', title: 'Annual Financial Report 2025', description: 'Complete financial overview for the year 2025', pdfUrl: '#' },
//   { id: 2, year: '2024', title: 'Annual Financial Report 2024', description: 'Complete financial overview for the year 2024', pdfUrl: '#' },
//   { id: 3, year: '2024', title: 'Q4 2024 Report', description: 'Fourth quarter financial summary', pdfUrl: '#' },
// ];

const FinancialReports = () => {
  const [reports, setReports] = useState([]);
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState('All');
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  

  useEffect(() => {
    const loadReports = async () => {
      setLoading(true);
      try {
        const data = await fetchFinancialReports();
        if (data.length > 0) {
          setReports(data);
          const uniqueYears = [...new Set(data.map(r => r.year))].sort((a, b) => parseInt(b) - parseInt(a));
          setYears(uniqueYears);
        } else {
          setReports(sampleReports);
          const uniqueYears = [...new Set(sampleReports.map(r => r.year))].sort((a, b) => parseInt(b) - parseInt(a));
          setYears(uniqueYears);
        }
      } catch (error) {
        console.error('Error loading financial reports:', error);
        setReports(sampleReports);
        const uniqueYears = [...new Set(sampleReports.map(r => r.year))].sort((a, b) => parseInt(b) - parseInt(a));
        setYears(uniqueYears);
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, []);

  const filteredReports = selectedYear === 'All'
    ? reports
    : reports.filter(r => r.year === selectedYear);

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold mb-4">
            <FaFilePdf className="w-4 h-4 mr-2" />
            Financial Transparency
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Financial Reports
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Download our annual and quarterly financial reports to stay informed about how funds are managed.
          </p>
        </div>

        {/* Year Filter */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-3 px-6 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-700 font-semibold hover:border-emerald-500 transition-all shadow-sm"
            >
              <FaCalendarAlt className="text-emerald-600" />
              <span>{selectedYear === 'All' ? 'All Years' : selectedYear}</span>
              <FaChevronDown className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-10">
                <button
                  onClick={() => { setSelectedYear('All'); setIsOpen(false); }}
                  className={`w-full px-4 py-3 text-left hover:bg-emerald-50 transition-colors ${selectedYear === 'All' ? 'bg-emerald-100 text-emerald-700 font-semibold' : 'text-gray-700'}`}
                >
                  All Years
                </button>
                {years.map(year => (
                  <button
                    key={year}
                    onClick={() => { setSelectedYear(year); setIsOpen(false); }}
                    className={`w-full px-4 py-3 text-left hover:bg-emerald-50 transition-colors ${selectedYear === year ? 'bg-emerald-100 text-emerald-700 font-semibold' : 'text-gray-700'}`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Reports Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm">
                <Skeleton className="w-16 h-16 rounded-xl mb-4" />
                <Skeleton className="w-20 h-6 rounded-full mb-3" />
                <Skeleton className="w-full h-6 mb-2" />
                <Skeleton className="w-3/4 h-4 mb-4" />
                <Skeleton className="w-full h-12 rounded-xl" />
              </div>
            ))}
          </div>
        ) : filteredReports.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReports.map((report) => (
              <div
                key={report.id}
                className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <FaFilePdf className="w-8 h-8 text-white" />
                </div>

                <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full mb-3">
                  {report.year}
                </span>

                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
                  {report.title}
                </h3>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {report.description}
                </p>

                <a
                  href={report.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-emerald-500/30 transition-all"
                >
                  <FaFileDownload className="w-4 h-4" />
                  Download PDF
                </a>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl">
            <FaFilePdf className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No reports available</h3>
            <p className="text-gray-500">
              {selectedYear === 'All'
                ? 'Financial reports will be uploaded soon.'
                : `No reports available for ${selectedYear}.`}
            </p>
          </div>
        )}

        {/* Info Note */}
        <div className="mt-8 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
          <p className="text-emerald-700 text-sm">
            For questions about financial reports, please contact the executive committee.
          </p>
        </div>
      </div>
    </section>
  );
};

export default FinancialReports;

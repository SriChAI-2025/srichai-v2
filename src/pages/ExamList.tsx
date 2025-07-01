import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Plus, 
  Search, 
  MoreVertical,
  Trash2,
  Edit,
  BarChart3,
  Users,
  CheckCircle
} from 'lucide-react';
import Layout from '../components/Layout/Layout';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { mockExams, MockExam } from '../data/mockData';

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

const ExamList: React.FC = () => {
  const [exams, setExams] = useState<MockExam[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState<string | null>(null);

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    // Simulate loading delay
    setTimeout(() => {
      setExams(mockExams);
      setLoading(false);
    }, 500);
  };

  const deleteExam = async (examId: string) => {
    if (!confirm('Are you sure you want to delete this exam? This action cannot be undone.')) {
      return;
    }

    // Remove from mock data
    const updatedExams = exams.filter(exam => exam._id !== examId);
    setExams(updatedExams);
    
    // Update the global mock data
    const examIndex = mockExams.findIndex(e => e._id === examId);
    if (examIndex > -1) {
      mockExams.splice(examIndex, 1);
    }
    
    setShowDropdown(null);
  };

  const filteredExams = exams.filter(exam =>
    exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exam.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Layout>
        <LoadingSpinner />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Exams</h1>
            <p className="mt-1 text-gray-600">
              Manage your exams and track grading progress
            </p>
          </div>
          <Link
            to="/exams/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Exam
          </Link>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search exams..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Exams Grid */}
        {filteredExams.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              {searchTerm ? 'No exams found' : 'No exams yet'}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm 
                ? 'Try adjusting your search terms' 
                : 'Get started by creating your first exam.'
              }
            </p>
            {!searchTerm && (
              <div className="mt-6">
                <Link
                  to="/exams/new"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Exam
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExams.map((exam) => (
              <div
                key={exam._id}
                className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        <Link 
                          to={`/exams/${exam._id}`}
                          className="hover:text-blue-600 transition-colors"
                        >
                          {exam.title}
                        </Link>
                      </h3>
                      {exam.description && (
                        <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                          {exam.description}
                        </p>
                      )}
                    </div>
                    
                    <div className="ml-2 flex-shrink-0 relative">
                      <button
                        onClick={() => setShowDropdown(showDropdown === exam._id ? null : exam._id)}
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>
                      
                      {showDropdown === exam._id && (
                        <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-10">
                          <div className="py-1">
                            <Link
                              to={`/exams/${exam._id}/edit`}
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => setShowDropdown(null)}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Exam
                            </Link>
                            <Link
                              to={`/exams/${exam._id}/analytics`}
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => setShowDropdown(null)}
                            >
                              <BarChart3 className="h-4 w-4 mr-2" />
                              View Analytics
                            </Link>
                            <button
                              onClick={() => deleteExam(exam._id)}
                              className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Exam
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      exam.status === 'completed' 
                        ? 'bg-green-100 text-green-800'
                        : exam.status === 'active'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {exam.status}
                    </span>
                    <p className="text-xs text-gray-500">
                      {formatDate(exam.createdAt)}
                    </p>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="flex items-center justify-center text-gray-400">
                        <FileText className="h-4 w-4" />
                      </div>
                      <p className="mt-1 text-sm font-medium text-gray-900">
                        {exam.stats.questionCount}
                      </p>
                      <p className="text-xs text-gray-500">Questions</p>
                    </div>
                    <div>
                      <div className="flex items-center justify-center text-gray-400">
                        <Users className="h-4 w-4" />
                      </div>
                      <p className="mt-1 text-sm font-medium text-gray-900">
                        {exam.stats.studentCount}
                      </p>
                      <p className="text-xs text-gray-500">Students</p>
                    </div>
                    <div>
                      <div className="flex items-center justify-center text-gray-400">
                        <CheckCircle className="h-4 w-4" />
                      </div>
                      <p className="mt-1 text-sm font-medium text-gray-900">
                        {exam.stats.gradedAnswers}/{exam.stats.totalAnswers}
                      </p>
                      <p className="text-xs text-gray-500">Graded</p>
                    </div>
                  </div>

                  {exam.stats.totalAnswers > 0 && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium">
                          {Math.round((exam.stats.gradedAnswers / exam.stats.totalAnswers) * 100)}%
                        </span>
                      </div>
                      <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ 
                            width: `${(exam.stats.gradedAnswers / exam.stats.totalAnswers) * 100}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 rounded-b-lg">
                  <Link
                    to={`/exams/${exam._id}`}
                    className="text-sm font-medium text-blue-600 hover:text-blue-500"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Click outside to close dropdown */}
      {showDropdown && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setShowDropdown(null)}
        ></div>
      )}
    </Layout>
  );
};

export default ExamList;
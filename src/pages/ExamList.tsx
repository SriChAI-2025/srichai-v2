import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Edit, 
  Calendar, 
  Clock, 
  Users,
  BookOpen,
  CheckCircle,
  Target,
  BarChart3,
  PlayCircle
} from 'lucide-react';
import Layout from '../components/Layout/Layout';
import { mockExams } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';

const ExamList: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filteredExams, setFilteredExams] = useState(mockExams);

  useEffect(() => {
    let filtered = mockExams;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(exam =>
        exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exam.subject.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(exam => exam.status === filterStatus);
    }

    setFilteredExams(filtered);
  }, [searchTerm, filterStatus]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500 text-white';
      case 'draft': return 'bg-yellow-500 text-black';
      case 'completed': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusText = (status: string, userRole: string) => {
    if (userRole === 'student') {
      switch (status) {
        case 'active': return 'Available';
        case 'completed': return 'Completed';
        case 'draft': return 'Coming Soon';
        default: return status;
      }
    }
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const renderTeacherView = () => (
    <>
      {/* Header */}
      <div className="neo-card-header p-6 transform">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black text-black uppercase tracking-wider mb-2">Exam Management</h1>
            <p className="text-lg font-bold text-gray-700 uppercase tracking-wide">Create, manage, and grade exams</p>
          </div>
          <Link to="/create-exam" className="neo-button py-3 px-6 flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Create New Exam</span>
          </Link>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="neo-card p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-600" />
              <input
                type="text"
                placeholder="SEARCH EXAMS..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="neo-input w-full pl-10 pr-4 py-3 text-lg font-bold"
              />
            </div>
          </div>
          <div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-600" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="neo-input w-full pl-10 pr-4 py-3 text-lg font-bold appearance-none"
              >
                <option value="all">ALL STATUS</option>
                <option value="active">ACTIVE</option>
                <option value="draft">DRAFT</option>
                <option value="completed">COMPLETED</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Exam Grid - Teacher View */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredExams.map((exam) => (
          <div key={exam._id} className="neo-card">
            <div className="bg-blue-600 text-white p-4 border-b-4 border-black">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-black uppercase tracking-wider">{exam.title}</h3>
                <span className={`neo-badge px-3 py-1 text-sm ${getStatusColor(exam.status)}`}>
                  {getStatusText(exam.status, 'teacher')}
                </span>
              </div>
              <p className="text-blue-100 text-sm font-bold uppercase tracking-wide">{exam.subject}</p>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <p className="text-2xl font-black text-blue-600 uppercase tracking-wider">{exam.stats.questionCount}</p>
                  <p className="text-xs font-bold text-gray-600 uppercase tracking-wider">Questions</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-black text-green-600 uppercase tracking-wider">{exam.stats.submitted}</p>
                  <p className="text-xs font-bold text-gray-600 uppercase tracking-wider">Submitted</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-black text-purple-600 uppercase tracking-wider">{exam.stats.graded}</p>
                  <p className="text-xs font-bold text-gray-600 uppercase tracking-wider">Graded</p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between text-sm font-bold text-gray-700 uppercase tracking-wide">
                  <span className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>Created</span>
                  </span>
                  <span>{new Date(exam.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm font-bold text-gray-700 uppercase tracking-wide">
                  <span className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>Duration</span>
                  </span>
                  <span>{exam.duration} minutes</span>
                </div>
              </div>

              <div className="flex space-x-2">
                <Link
                  to={`/exams/${exam._id}`}
                  className="neo-button flex-1 py-2 px-4 text-sm font-bold flex items-center justify-center space-x-2"
                >
                  <Eye className="h-4 w-4" />
                  <span>View Details</span>
                </Link>
                <Link
                  to={`/exams/${exam._id}/grade`}
                                        className="neo-button bg-blue-600 hover:bg-blue-700 flex-1 py-2 px-4 text-sm font-bold flex items-center justify-center space-x-2"
                >
                  <Edit className="h-4 w-4" />
                  <span>Grade</span>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );

  const renderStudentView = () => (
    <>
      {/* Header */}
      <div className="neo-card-header p-6 transform">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black text-black uppercase tracking-wider mb-2">Available Exams</h1>
            <p className="text-lg font-bold text-gray-700 uppercase tracking-wide">Take exams and track your progress</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-gray-600 uppercase tracking-wide">Your Progress</p>
            <p className="text-2xl font-black text-green-600 uppercase tracking-wider">
              {filteredExams.filter(e => e.status === 'completed').length}/{filteredExams.length}
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="neo-card p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-600" />
              <input
                type="text"
                placeholder="SEARCH EXAMS..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="neo-input w-full pl-10 pr-4 py-3 text-lg font-bold"
              />
            </div>
          </div>
          <div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-600" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="neo-input w-full pl-10 pr-4 py-3 text-lg font-bold appearance-none"
              >
                <option value="all">ALL EXAMS</option>
                <option value="active">AVAILABLE</option>
                <option value="completed">COMPLETED</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Exam Grid - Student View */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredExams.map((exam) => {
          const isCompleted = exam.status === 'completed';
          const isAvailable = exam.status === 'active';
          const progress = isCompleted ? 100 : Math.floor(Math.random() * 80); // Mock progress
          
          return (
            <div key={exam._id} className="neo-card">
              <div className={`text-white p-4 border-b-4 border-black ${
                isCompleted ? 'bg-blue-600' : isAvailable ? 'bg-blue-600' : 'bg-gray-600'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-black uppercase tracking-wider">{exam.title}</h3>
                  <span className={`neo-badge px-3 py-1 text-sm ${getStatusColor(exam.status)}`}>
                    {getStatusText(exam.status, 'student')}
                  </span>
                </div>
                <p className={`text-sm font-bold uppercase tracking-wide ${
                  isCompleted ? 'text-blue-100' : isAvailable ? 'text-blue-100' : 'text-gray-300'
                }`}>
                  {exam.subject}
                </p>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <p className="text-2xl font-black text-blue-600 uppercase tracking-wider">{exam.stats.questionCount}</p>
                    <p className="text-xs font-bold text-gray-600 uppercase tracking-wider">Questions</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-black text-purple-600 uppercase tracking-wider">{exam.duration}</p>
                    <p className="text-xs font-bold text-gray-600 uppercase tracking-wider">Minutes</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-black text-green-600 uppercase tracking-wider">
                      {isCompleted ? '95%' : '-'}
                    </p>
                    <p className="text-xs font-bold text-gray-600 uppercase tracking-wider">Score</p>
                  </div>
                </div>

                {!isCompleted && isAvailable && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold text-gray-900 uppercase tracking-wider">Progress</span>
                      <span className="text-lg font-black text-gray-900 uppercase tracking-wider">{progress}%</span>
                    </div>
                    <div className="neo-progress-bar w-full h-3">
                      <div 
                        className="neo-progress-fill h-3 transition-all duration-300" 
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-sm font-bold text-gray-700 uppercase tracking-wide">
                    <span className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>Available</span>
                    </span>
                    <span>{new Date(exam.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm font-bold text-gray-700 uppercase tracking-wide">
                    <span className="flex items-center space-x-2">
                      <Users className="h-4 w-4" />
                      <span>Participants</span>
                    </span>
                    <span>{exam.stats.submitted} students</span>
                  </div>
                </div>

                <div className="space-y-2">
                  {isCompleted ? (
                    <>
                      <Link
                        to={`/exams/${exam._id}`}
                        className="neo-button w-full py-3 px-4 text-sm font-bold flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700"
                      >
                        <BarChart3 className="h-4 w-4" />
                        <span>View Results</span>
                      </Link>
                      <button className="neo-button bg-gray-600 hover:bg-gray-700 w-full py-2 px-4 text-sm font-bold flex items-center justify-center space-x-2">
                        <Eye className="h-4 w-4" />
                        <span>Review Answers</span>
                      </button>
                    </>
                  ) : isAvailable ? (
                    <>
                      <Link
                        to={`/exams/${exam._id}`}
                        className="neo-button w-full py-3 px-4 text-sm font-bold flex items-center justify-center space-x-2"
                      >
                        <PlayCircle className="h-4 w-4" />
                        <span>{progress > 0 ? 'Continue Exam' : 'Start Exam'}</span>
                      </Link>
                      {progress > 0 && (
                        <div className="text-center">
                          <p className="text-xs font-bold text-green-600 uppercase tracking-wide">
                            ✅ {Math.floor((progress / 100) * exam.stats.questionCount)} of {exam.stats.questionCount} answered
                          </p>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="neo-card bg-gray-100 p-4 text-center">
                      <Clock className="h-8 w-8 mx-auto mb-2 text-gray-500" />
                      <p className="text-sm font-bold text-gray-600 uppercase tracking-wide">Coming Soon</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );

  return (
    <Layout>
      <div className="space-y-8">
        {user?.role === 'teacher' ? renderTeacherView() : renderStudentView()}

        {/* Empty State */}
        {filteredExams.length === 0 && (
          <div className="neo-card p-12 text-center">
            <BookOpen className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-2xl font-black text-gray-900 uppercase tracking-wider mb-2">No Exams Found</h3>
            <p className="text-lg font-bold text-gray-600 uppercase tracking-wide mb-6">
              {searchTerm ? 'Try different search terms' : 'No exams match your filters'}
            </p>
            {user?.role === 'teacher' && (
              <Link to="/create-exam" className="neo-button py-3 px-6">
                Create Your First Exam
              </Link>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ExamList;
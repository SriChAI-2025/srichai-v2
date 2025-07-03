import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Clock, 
  CheckCircle, 
  FileText, 
  TrendingUp,
  Calendar,
  Target,
  Award,
  Users,
  BarChart3
} from 'lucide-react';
import Layout from '../components/Layout/Layout';
import { mockExams } from '../data/mockData';

interface StudentStats {
  totalExams: number;
  answeredExams: number;
  completedExams: number;
  averageScore: number;
  totalQuestions: number;
  answeredQuestions: number;
}

const StudentDashboard: React.FC = () => {
  const [stats, setStats] = useState<StudentStats>({
    totalExams: 0,
    answeredExams: 0,
    completedExams: 0,
    averageScore: 0,
    totalQuestions: 0,
    answeredQuestions: 0
  });

  const [recentExams, setRecentExams] = useState(mockExams.slice(0, 3));

  useEffect(() => {
    // Calculate student-specific stats
    const totalExams = mockExams.length;
    const answeredExams = mockExams.filter(exam => exam.status === 'active' || exam.status === 'completed').length;
    const completedExams = mockExams.filter(exam => exam.status === 'completed').length;
    const totalQuestions = mockExams.reduce((sum, exam) => sum + exam.stats.questionCount, 0);
    const answeredQuestions = Math.floor(totalQuestions * 0.75); // Mock: 75% answered
    const averageScore = 87; // Mock average score

    setStats({
      totalExams,
      answeredExams,
      completedExams,
      averageScore,
      totalQuestions,
      answeredQuestions
    });
  }, []);

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="neo-card-header p-6 transform">
          <h1 className="text-4xl font-black text-black uppercase tracking-wider mb-2">Student Dashboard</h1>
          <p className="text-lg font-bold text-gray-700 uppercase tracking-wide">
            Track your exam progress and performance
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="neo-stat-card bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-bold uppercase tracking-wider">Available Exams</p>
                <p className="text-3xl font-black uppercase tracking-wider">{stats.totalExams}</p>
              </div>
              <BookOpen className="h-12 w-12 text-blue-200" />
            </div>
          </div>

          <div className="neo-stat-card bg-gradient-to-br from-green-500 to-green-600 text-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-bold uppercase tracking-wider">Questions Answered</p>
                <p className="text-3xl font-black uppercase tracking-wider">{stats.answeredQuestions}/{stats.totalQuestions}</p>
              </div>
              <CheckCircle className="h-12 w-12 text-green-200" />
            </div>
          </div>

          <div className="neo-stat-card bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-bold uppercase tracking-wider">Completed Exams</p>
                <p className="text-3xl font-black uppercase tracking-wider">{stats.completedExams}</p>
              </div>
              <Award className="h-12 w-12 text-purple-200" />
            </div>
          </div>

          <div className="neo-stat-card bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-bold uppercase tracking-wider">Average Score</p>
                <p className="text-3xl font-black uppercase tracking-wider">{stats.averageScore}%</p>
              </div>
              <TrendingUp className="h-12 w-12 text-orange-200" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="neo-card p-6">
          <h2 className="text-2xl font-black text-gray-900 uppercase tracking-wider mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              to="/exams"
              className="neo-card p-6 text-center hover:bg-blue-50 transition-colors"
            >
              <BookOpen className="h-12 w-12 mx-auto mb-4 text-blue-600" />
              <h3 className="text-lg font-black text-gray-900 uppercase tracking-wider mb-2">Take Exam</h3>
              <p className="text-sm font-bold text-gray-600 uppercase tracking-wide">View available exams</p>
            </Link>

            <Link
              to="/results"
                                  className="neo-card p-6 text-center hover:bg-blue-50 transition-colors"
            >
              <BarChart3 className="h-12 w-12 mx-auto mb-4 text-green-600" />
              <h3 className="text-lg font-black text-gray-900 uppercase tracking-wider mb-2">View Results</h3>
              <p className="text-sm font-bold text-gray-600 uppercase tracking-wide">Check your scores</p>
            </Link>

            <Link
              to="/account/profile"
              className="neo-card p-6 text-center hover:bg-purple-50 transition-colors"
            >
              <Users className="h-12 w-12 mx-auto mb-4 text-purple-600" />
              <h3 className="text-lg font-black text-gray-900 uppercase tracking-wider mb-2">My Profile</h3>
              <p className="text-sm font-bold text-gray-600 uppercase tracking-wide">Update your info</p>
            </Link>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Exams */}
          <div className="neo-card">
            <div className="bg-blue-600 text-white p-6 border-b-4 border-black">
              <h3 className="text-2xl font-black uppercase tracking-wider flex items-center space-x-3">
                <FileText className="h-6 w-6" />
                <span>Recent Exams</span>
              </h3>
            </div>
            <div className="p-6 space-y-4">
              {recentExams.map((exam) => (
                <div key={exam._id} className="neo-card p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg font-black text-gray-900 uppercase tracking-wider">{exam.title}</h4>
                    <span className={`neo-badge px-3 py-1 text-xs ${
                      exam.status === 'completed' 
                        ? 'bg-blue-500 text-white'
                        : 'bg-blue-500 text-white'
                    }`}>
                      {exam.status === 'completed' ? 'Completed' : 'Available'}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-center mb-4">
                    <div>
                      <p className="text-lg font-black text-gray-900 uppercase tracking-wider">{exam.stats.questionCount}</p>
                      <p className="text-xs font-bold text-gray-600 uppercase tracking-wider">Questions</p>
                    </div>
                    <div>
                      <p className="text-lg font-black text-gray-900 uppercase tracking-wider">
                        {Math.floor(exam.stats.questionCount * 0.8)}/{exam.stats.questionCount}
                      </p>
                      <p className="text-xs font-bold text-gray-600 uppercase tracking-wider">Answered</p>
                    </div>
                    <div>
                      <p className="text-lg font-black text-gray-900 uppercase tracking-wider">
                        {exam.status === 'completed' ? '95%' : '-'}
                      </p>
                      <p className="text-xs font-bold text-gray-600 uppercase tracking-wider">Score</p>
                    </div>
                  </div>

                  {exam.status !== 'completed' && (
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-bold text-gray-900 uppercase tracking-wider">Progress</span>
                        <span className="text-sm font-black text-gray-900 uppercase tracking-wider">80%</span>
                      </div>
                      <div className="neo-progress-bar w-full h-3">
                        <div className="neo-progress-fill h-3" style={{ width: '80%' }}></div>
                      </div>
                    </div>
                  )}

                  <Link
                    to={`/exams/${exam._id}`}
                    className="neo-button w-full py-2 px-4 text-sm font-bold flex items-center justify-center space-x-2"
                  >
                    {exam.status === 'completed' ? (
                      <>
                        <BarChart3 className="h-4 w-4" />
                        <span>View Results</span>
                      </>
                    ) : (
                      <>
                        <BookOpen className="h-4 w-4" />
                        <span>Continue Exam</span>
                      </>
                    )}
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Chart */}
          <div className="neo-card">
            <div className="bg-blue-600 text-white p-6 border-b-4 border-black">
              <h3 className="text-2xl font-black uppercase tracking-wider flex items-center space-x-3">
                <BarChart3 className="h-6 w-6" />
                <span>PERFORMANCE BY SUBJECT</span>
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                <div className="neo-card p-4">
                  <h4 className="text-lg font-black text-gray-900 uppercase tracking-wider mb-4">Subject Performance</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-gray-900 uppercase tracking-wider">Mathematics</span>
                        <span className="text-lg font-black text-gray-900 uppercase tracking-wider">92%</span>
                      </div>
                      <div className="neo-progress-bar w-full h-3">
                        <div className="neo-progress-fill h-3" style={{ width: '92%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-gray-900 uppercase tracking-wider">Physics</span>
                        <span className="text-lg font-black text-gray-900 uppercase tracking-wider">87%</span>
                      </div>
                      <div className="neo-progress-bar w-full h-3">
                        <div className="neo-progress-fill h-3" style={{ width: '87%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-gray-900 uppercase tracking-wider">Chemistry</span>
                        <span className="text-lg font-black text-gray-900 uppercase tracking-wider">85%</span>
                      </div>
                      <div className="neo-progress-bar w-full h-3">
                        <div className="neo-progress-fill h-3" style={{ width: '85%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="neo-card p-4">
                  <h4 className="text-lg font-black text-gray-900 uppercase tracking-wider mb-4">Recent Activity</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-500 neo-card p-2">
                        <CheckCircle className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900 uppercase tracking-wide">Completed Physics Midterm</p>
                        <p className="text-xs font-bold text-gray-600 uppercase tracking-wide">2 hours ago</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-500 neo-card p-2">
                        <Clock className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900 uppercase tracking-wide">Started Math Final</p>
                        <p className="text-xs font-bold text-gray-600 uppercase tracking-wide">1 day ago</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-500 neo-card p-2">
                        <Target className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900 uppercase tracking-wide">New Exam Available</p>
                        <p className="text-xs font-bold text-gray-600 uppercase tracking-wide">3 days ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default StudentDashboard; 
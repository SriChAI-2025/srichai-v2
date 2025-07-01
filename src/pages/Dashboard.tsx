import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Users, 
  CheckCircle, 
  Clock, 
  Plus,
  BarChart3,
  TrendingUp,
  Zap
} from 'lucide-react';
import Layout from '../components/Layout/Layout';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { mockExams, MockExam } from '../data/mockData';

const Dashboard: React.FC = () => {
  const [exams, setExams] = useState<MockExam[]>([]);
  const [loading, setLoading] = useState(true);

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

  const totalStats = exams.reduce(
    (acc, exam) => ({
      totalExams: acc.totalExams + 1,
      totalQuestions: acc.totalQuestions + exam.stats.questionCount,
      totalAnswers: acc.totalAnswers + exam.stats.totalAnswers,
      gradedAnswers: acc.gradedAnswers + exam.stats.gradedAnswers,
    }),
    { totalExams: 0, totalQuestions: 0, totalAnswers: 0, gradedAnswers: 0 }
  );

  const completionRate = totalStats.totalAnswers > 0 
    ? Math.round((totalStats.gradedAnswers / totalStats.totalAnswers) * 100)
    : 0;

  if (loading) {
    return (
      <Layout>
        <LoadingSpinner />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 transform">
            <h1 className="text-4xl font-black text-black uppercase tracking-wider mb-2">DASHBOARD</h1>
            <p className="text-lg font-bold text-gray-700 uppercase tracking-wide">
              EXAM GRADING OVERVIEW
            </p>
          </div>
          <Link
            to="/exams/new"
            className="neo-button px-6 py-4 text-lg flex items-center space-x-3"
          >
            <Plus className="h-6 w-6" />
            <span>NEW EXAM</span>
          </Link>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="neo-stat-card from-blue-400 to-blue-600 text-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 font-bold uppercase tracking-wider text-sm mb-2">TOTAL EXAMS</p>
                <p className="text-4xl font-black">{totalStats.totalExams}</p>
              </div>
              <div className="bg-white border-2 border-black p-3">
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="neo-stat-card from-green-400 to-green-600 text-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 font-bold uppercase tracking-wider text-sm mb-2">QUESTIONS</p>
                <p className="text-4xl font-black">{totalStats.totalQuestions}</p>
              </div>
              <div className="bg-white border-2 border-black p-3">
                <Users className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="neo-stat-card from-purple-400 to-purple-600 text-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 font-bold uppercase tracking-wider text-sm mb-2">GRADED</p>
                <p className="text-4xl font-black">{totalStats.gradedAnswers}</p>
              </div>
              <div className="bg-white border-2 border-black p-3">
                <CheckCircle className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="neo-stat-card from-orange-400 to-red-500 text-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 font-bold uppercase tracking-wider text-sm mb-2">COMPLETION</p>
                <p className="text-4xl font-black">{completionRate}%</p>
              </div>
              <div className="bg-white border-2 border-black p-3">
                <TrendingUp className="h-8 w-8 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Exams */}
        <div className="neo-card">
          <div className="bg-blue-600 text-white p-6 border-b-4 border-black">
            <h2 className="text-2xl font-black uppercase tracking-wider flex items-center space-x-3">
              <Zap className="h-6 w-6" />
              <span>RECENT EXAMS</span>
            </h2>
          </div>
          
          {exams.length === 0 ? (
            <div className="p-12 text-center">
              <div className="bg-gray-100 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-8 inline-block">
                <FileText className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-xl font-black text-gray-900 uppercase tracking-wider mb-2">NO EXAMS YET</h3>
                <p className="text-lg font-bold text-gray-600 uppercase tracking-wide mb-6">
                  CREATE YOUR FIRST EXAM
                </p>
                <Link
                  to="/exams/new"
                  className="neo-button px-6 py-3 inline-flex items-center space-x-2"
                >
                  <Plus className="h-5 w-5" />
                  <span>CREATE EXAM</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="divide-y-4 divide-black">
              {exams.slice(0, 5).map((exam) => (
                <div key={exam._id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xl font-black text-gray-900 uppercase tracking-wider">
                          <Link 
                            to={`/exams/${exam._id}`}
                            className="hover:text-blue-600 transition-colors"
                          >
                            {exam.title}
                          </Link>
                        </h3>
                        <div className="flex items-center space-x-2">
                          <span className={`neo-badge px-3 py-1 ${
                            exam.status === 'completed' 
                              ? 'bg-green-400 text-black'
                              : exam.status === 'active'
                              ? 'bg-blue-400 text-black'
                              : 'bg-gray-300 text-black'
                          }`}>
                            {exam.status}
                          </span>
                        </div>
                      </div>
                      
                      {exam.description && (
                        <p className="text-base font-bold text-gray-600 uppercase tracking-wide mb-4">
                          {exam.description}
                        </p>
                      )}
                      
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="bg-blue-100 border-2 border-black p-3 text-center">
                          <div className="flex items-center justify-center mb-1">
                            <FileText className="h-5 w-5 text-blue-600" />
                          </div>
                          <p className="text-lg font-black text-blue-900">{exam.stats.questionCount}</p>
                          <p className="text-xs font-bold text-blue-700 uppercase tracking-wider">QUESTIONS</p>
                        </div>
                        <div className="bg-green-100 border-2 border-black p-3 text-center">
                          <div className="flex items-center justify-center mb-1">
                            <Users className="h-5 w-5 text-green-600" />
                          </div>
                          <p className="text-lg font-black text-green-900">{exam.stats.studentCount}</p>
                          <p className="text-xs font-bold text-green-700 uppercase tracking-wider">STUDENTS</p>
                        </div>
                        <div className="bg-purple-100 border-2 border-black p-3 text-center">
                          <div className="flex items-center justify-center mb-1">
                            <CheckCircle className="h-5 w-5 text-purple-600" />
                          </div>
                          <p className="text-lg font-black text-purple-900">{exam.stats.gradedAnswers}/{exam.stats.totalAnswers}</p>
                          <p className="text-xs font-bold text-purple-700 uppercase tracking-wider">GRADED</p>
                        </div>
                      </div>
                      
                      {exam.stats.totalAnswers > 0 && (
                        <div>
                          <div className="flex items-center justify-between text-sm font-bold uppercase tracking-wider mb-2">
                            <span className="text-gray-700">PROGRESS</span>
                            <span className="text-black">
                              {Math.round((exam.stats.gradedAnswers / exam.stats.totalAnswers) * 100)}%
                            </span>
                          </div>
                          <div className="neo-progress-bar h-4 rounded-none">
                            <div 
                              className="neo-progress-fill h-full transition-all duration-300"
                              style={{ 
                                width: `${(exam.stats.gradedAnswers / exam.stats.totalAnswers) * 100}%` 
                              }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="ml-8 flex flex-col space-y-3">
                      <Link
                        to={`/exams/${exam._id}/analytics`}
                        className="neo-button-secondary px-4 py-2 text-sm flex items-center space-x-2"
                      >
                        <BarChart3 className="h-4 w-4" />
                        <span>ANALYTICS</span>
                      </Link>
                      <Link
                        to={`/exams/${exam._id}`}
                        className="neo-button px-4 py-2 text-sm flex items-center space-x-2"
                      >
                        <span>VIEW EXAM</span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {exams.length > 5 && (
          <div className="text-center">
            <Link
              to="/exams"
              className="neo-button-secondary px-8 py-4 text-lg inline-flex items-center space-x-2"
            >
              <span>VIEW ALL EXAMS</span>
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
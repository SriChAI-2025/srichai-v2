import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Users, 
  CheckCircle, 
  Clock, 
  Target,
  BookOpen,
  BarChart3,
  Edit,
  Palette,
  Award,
  Zap
} from 'lucide-react';
import Layout from '../components/Layout/Layout';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { mockExams, MockExam } from '../data/mockData';

type DesignStyle = 'classic' | 'neo-brutalism';

const ExamGrading: React.FC = () => {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const [exam, setExam] = useState<MockExam | null>(null);
  const [loading, setLoading] = useState(true);
  const [designStyle, setDesignStyle] = useState<DesignStyle>('classic');

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      const foundExam = mockExams.find(e => e._id === examId);
      setExam(foundExam || null);
      setLoading(false);
    }, 300);
  }, [examId]);

  if (loading) {
    return (
      <Layout>
        <LoadingSpinner />
      </Layout>
    );
  }

  if (!exam) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900">Exam not found</h3>
          <p className="mt-1 text-gray-500">The exam you're looking for doesn't exist.</p>
          <Link to="/exams" className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700">
            Back to Exams
          </Link>
        </div>
      </Layout>
    );
  }

  const isNeoBrutalism = designStyle === 'neo-brutalism';
  
  // Design-specific class sets
  const cardClass = isNeoBrutalism 
    ? "neo-card" 
    : "bg-white shadow-sm rounded-lg border border-gray-200";
  
  const buttonPrimaryClass = isNeoBrutalism
    ? "neo-button"
    : "inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors";
  
  const buttonSecondaryClass = isNeoBrutalism
    ? "neo-button-secondary"
    : "inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors";

  // Calculate stats
  const allQuestions = exam.sections.flatMap(s => s.questions);
  const totalQuestions = allQuestions.length;
  const totalAnswers = allQuestions.reduce((sum, q) => sum + q.answers.length, 0);
  const gradedAnswers = allQuestions.reduce((sum, q) => sum + q.answers.filter(a => a.score !== undefined).length, 0);
  const gradingProgress = totalAnswers > 0 ? Math.round((gradedAnswers / totalAnswers) * 100) : 0;

  const getSectionMaxScore = (sectionTitle: string): number => {
    if (sectionTitle.toLowerCase().includes('section a') || sectionTitle.toLowerCase().includes('basic')) {
      return 2;
    } else if (sectionTitle.toLowerCase().includes('section b') || sectionTitle.toLowerCase().includes('intermediate')) {
      return 5;
    } else {
      return 8; // Section C
    }
  };

  const getSectionBadgeColor = (maxScore: number): string => {
    if (maxScore <= 2) return 'bg-green-100 text-green-800';
    if (maxScore <= 5) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className={`${cardClass} p-6`}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/exams')}
                className={isNeoBrutalism ? "neo-button-icon" : "p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"}
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className={`text-2xl font-bold ${isNeoBrutalism ? 'font-black uppercase tracking-wider' : ''} text-gray-900`}>
                  Grade Exam: {exam.title}
                </h1>
                <p className={`mt-1 ${isNeoBrutalism ? 'font-bold uppercase tracking-wide text-sm' : ''} text-gray-600`}>
                  {exam.subject} • {totalQuestions} Questions • {gradingProgress}% Graded
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setDesignStyle(designStyle === 'classic' ? 'neo-brutalism' : 'classic')}
                className={buttonSecondaryClass}
              >
                <Palette className="h-4 w-4 mr-2" />
                {designStyle === 'classic' ? 'Neo Style' : 'Classic'}
              </button>
            </div>
          </div>

          {/* Exam Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className={`p-4 rounded-lg ${isNeoBrutalism ? 'neo-badge bg-blue-600 text-white' : 'bg-blue-50'}`}>
              <div className="flex items-center space-x-3">
                <BookOpen className={`h-6 w-6 ${isNeoBrutalism ? 'text-white' : 'text-blue-600'}`} />
                <div>
                  <p className={`text-sm font-medium ${isNeoBrutalism ? 'font-black uppercase tracking-wider' : 'text-blue-700'}`}>
                    Questions
                  </p>
                  <p className={`text-2xl font-bold ${isNeoBrutalism ? 'font-black' : 'text-blue-900'}`}>
                    {totalQuestions}
                  </p>
                </div>
              </div>
            </div>
            
            <div className={`p-4 rounded-lg ${isNeoBrutalism ? 'neo-badge bg-green-600 text-white' : 'bg-green-50'}`}>
              <div className="flex items-center space-x-3">
                <Users className={`h-6 w-6 ${isNeoBrutalism ? 'text-white' : 'text-green-600'}`} />
                <div>
                  <p className={`text-sm font-medium ${isNeoBrutalism ? 'font-black uppercase tracking-wider' : 'text-green-700'}`}>
                    Total Answers
                  </p>
                  <p className={`text-2xl font-bold ${isNeoBrutalism ? 'font-black' : 'text-green-900'}`}>
                    {totalAnswers}
                  </p>
                </div>
              </div>
            </div>
            
            <div className={`p-4 rounded-lg ${isNeoBrutalism ? 'neo-badge bg-purple-600 text-white' : 'bg-purple-50'}`}>
              <div className="flex items-center space-x-3">
                <CheckCircle className={`h-6 w-6 ${isNeoBrutalism ? 'text-white' : 'text-purple-600'}`} />
                <div>
                  <p className={`text-sm font-medium ${isNeoBrutalism ? 'font-black uppercase tracking-wider' : 'text-purple-700'}`}>
                    Graded
                  </p>
                  <p className={`text-2xl font-bold ${isNeoBrutalism ? 'font-black' : 'text-purple-900'}`}>
                    {gradedAnswers}
                  </p>
                </div>
              </div>
            </div>
            
            <div className={`p-4 rounded-lg ${isNeoBrutalism ? 'neo-badge bg-orange-600 text-white' : 'bg-orange-50'}`}>
              <div className="flex items-center space-x-3">
                <BarChart3 className={`h-6 w-6 ${isNeoBrutalism ? 'text-white' : 'text-orange-600'}`} />
                <div>
                  <p className={`text-sm font-medium ${isNeoBrutalism ? 'font-black uppercase tracking-wider' : 'text-orange-700'}`}>
                    Progress
                  </p>
                  <p className={`text-2xl font-bold ${isNeoBrutalism ? 'font-black' : 'text-orange-900'}`}>
                    {gradingProgress}%
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className={`flex items-center justify-between text-sm mb-2 ${isNeoBrutalism ? 'font-bold uppercase tracking-wide' : 'text-gray-600'}`}>
              <span>Overall Grading Progress</span>
              <span>{gradedAnswers}/{totalAnswers} answers graded</span>
            </div>
            <div className={`w-full h-3 rounded-full ${isNeoBrutalism ? 'bg-gray-800 border-2 border-black' : 'bg-gray-200'}`}>
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  isNeoBrutalism 
                    ? 'bg-gradient-to-r from-yellow-400 to-green-400' 
                    : 'bg-gradient-to-r from-blue-500 to-blue-600'
                }`}
                style={{ width: `${gradingProgress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Sections and Questions */}
        <div className="space-y-6">
          {exam.sections.map((section, sectionIndex) => {
            const sectionMaxScore = getSectionMaxScore(section.title);
            const sectionQuestions = section.questions;
            const sectionAnswers = sectionQuestions.reduce((sum, q) => sum + q.answers.length, 0);
            const sectionGraded = sectionQuestions.reduce((sum, q) => sum + q.answers.filter(a => a.score !== undefined).length, 0);
            const sectionProgress = sectionAnswers > 0 ? Math.round((sectionGraded / sectionAnswers) * 100) : 0;

            return (
              <div key={section._id} className={`${cardClass} overflow-hidden`}>
                {/* Section Header */}
                <div className={`p-6 border-b ${isNeoBrutalism ? 'bg-blue-600 text-white border-black' : 'border-gray-200 bg-gray-50'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div>
                        <h2 className={`text-xl font-semibold ${isNeoBrutalism ? 'font-black uppercase tracking-wider' : 'text-gray-900'}`}>
                          {section.title}
                        </h2>
                        <p className={`mt-1 text-sm ${isNeoBrutalism ? 'font-bold uppercase tracking-wide' : 'text-gray-500'}`}>
                          {sectionQuestions.length} questions • Max {sectionMaxScore} marks each
                        </p>
                      </div>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        isNeoBrutalism 
                          ? 'neo-badge bg-white text-blue-600 border-2 border-black' 
                          : getSectionBadgeColor(sectionMaxScore)
                      }`}>
                        <Target className="h-3 w-3 mr-1" />
                        Section {sectionMaxScore <= 2 ? 'A' : sectionMaxScore <= 5 ? 'B' : 'C'}
                      </span>
                    </div>
                    
                    <div className="text-right">
                      <p className={`text-sm font-medium ${isNeoBrutalism ? 'font-black uppercase tracking-wider' : 'text-gray-500'}`}>
                        Progress
                      </p>
                      <p className={`text-lg font-bold ${isNeoBrutalism ? 'font-black' : 'text-gray-900'}`}>
                        {sectionProgress}%
                      </p>
                    </div>
                  </div>
                  
                  {/* Section Progress Bar */}
                  <div className="mt-4">
                    <div className={`w-full h-2 rounded-full ${isNeoBrutalism ? 'bg-blue-800 border border-black' : 'bg-blue-100'}`}>
                      <div 
                        className={`h-full rounded-full transition-all duration-300 ${
                          isNeoBrutalism 
                            ? 'bg-yellow-400' 
                            : 'bg-blue-600'
                        }`}
                        style={{ width: `${sectionProgress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Questions List */}
                <div className="divide-y divide-gray-200">
                  {sectionQuestions.map((question, questionIndex) => {
                    const questionAnswers = question.answers.length;
                    const questionGraded = question.answers.filter(a => a.score !== undefined).length;
                    const questionProgress = questionAnswers > 0 ? Math.round((questionGraded / questionAnswers) * 100) : 0;

                    return (
                      <div key={question._id} className={`p-6 hover:bg-gray-50 ${isNeoBrutalism ? 'hover:bg-gray-100' : ''}`}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-3 mb-3">
                              <span className={`text-sm font-medium ${isNeoBrutalism ? 'font-black uppercase tracking-wider' : 'text-gray-500'}`}>
                                Question {questionIndex + 1}
                              </span>
                              <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                                isNeoBrutalism 
                                  ? 'neo-badge bg-blue-600 text-white border-2 border-black' 
                                  : 'bg-blue-100 text-blue-800'
                              }`}>
                                {sectionMaxScore} points
                              </span>
                              {questionProgress === 100 && (
                                <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                                  isNeoBrutalism 
                                    ? 'neo-badge bg-green-600 text-white border-2 border-black' 
                                    : 'bg-green-100 text-green-800'
                                }`}>
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Complete
                                </span>
                              )}
                            </div>
                            
                            <p className={`text-gray-900 mb-3 line-clamp-2 ${isNeoBrutalism ? 'font-bold' : ''}`}>
                              {question.promptText}
                            </p>
                            
                            <div className="flex items-center space-x-6 text-sm">
                              <span className={`flex items-center ${isNeoBrutalism ? 'font-bold uppercase tracking-wide' : 'text-gray-500'}`}>
                                <Users className="h-4 w-4 mr-1" />
                                {questionAnswers} students
                              </span>
                              <span className={`flex items-center ${isNeoBrutalism ? 'font-bold uppercase tracking-wide' : 'text-gray-500'}`}>
                                <CheckCircle className="h-4 w-4 mr-1" />
                                {questionGraded} graded
                              </span>
                              <span className={`flex items-center ${isNeoBrutalism ? 'font-bold uppercase tracking-wide' : 'text-gray-500'}`}>
                                <Clock className="h-4 w-4 mr-1" />
                                {questionProgress}% complete
                              </span>
                            </div>
                            
                            {/* Question Progress Bar */}
                            <div className="mt-3">
                              <div className={`w-full h-1.5 rounded-full ${isNeoBrutalism ? 'bg-gray-800 border border-black' : 'bg-gray-200'}`}>
                                <div 
                                  className={`h-full rounded-full transition-all duration-300 ${
                                    questionProgress === 100 
                                      ? isNeoBrutalism ? 'bg-green-400' : 'bg-green-600'
                                      : isNeoBrutalism ? 'bg-yellow-400' : 'bg-blue-600'
                                  }`}
                                  style={{ width: `${questionProgress}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="ml-6 flex items-center space-x-2">
                            <Link
                              to={`/questions/${question._id}/grade`}
                              className={buttonPrimaryClass}
                            >
                              {isNeoBrutalism ? (
                                <>
                                  <Edit className="h-4 w-4 mr-2" />
                                  GRADE ALL
                                </>
                              ) : (
                                <>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Grade All Answers
                                </>
                              )}
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className={`${cardClass} p-6`}>
          <h3 className={`text-lg font-semibold mb-4 ${isNeoBrutalism ? 'font-black uppercase tracking-wider' : ''} text-gray-900`}>
            Quick Actions
          </h3>
          <div className="flex flex-wrap gap-3">
            <button className={buttonSecondaryClass}>
              <BarChart3 className="h-4 w-4 mr-2" />
              {isNeoBrutalism ? 'VIEW ANALYTICS' : 'View Analytics'}
            </button>
            <button className={buttonSecondaryClass}>
              <Users className="h-4 w-4 mr-2" />
              {isNeoBrutalism ? 'STUDENT REPORTS' : 'Student Reports'}
            </button>
            <Link to={`/exams/${exam._id}`} className={buttonSecondaryClass}>
              <BookOpen className="h-4 w-4 mr-2" />
              {isNeoBrutalism ? 'VIEW EXAM' : 'View Exam Details'}
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ExamGrading; 
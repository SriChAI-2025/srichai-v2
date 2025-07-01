import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Plus, 
  Edit, 
  Trash2, 
  FileText, 
  Users, 
  CheckCircle,
  BarChart3,
  Clock,
  BookOpen
} from 'lucide-react';
import Layout from '../components/Layout/Layout';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { mockExams, MockExam, updateExamStats } from '../data/mockData';

const ExamDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [exam, setExam] = useState<MockExam | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExam();
  }, [id]);

  const fetchExam = async () => {
    setTimeout(() => {
      const foundExam = mockExams.find(e => e._id === id);
      setExam(foundExam || null);
      setLoading(false);
    }, 300);
  };

  const deleteQuestion = (questionId: string) => {
    if (!exam || !confirm('Are you sure you want to delete this question?')) return;

    // Remove question from the exam
    const updatedSections = exam.sections.map(section => ({
      ...section,
      questions: section.questions.filter(q => q._id !== questionId)
    }));

    const updatedExam = { ...exam, sections: updatedSections };
    setExam(updatedExam);

    // Update the global mock data
    const examIndex = mockExams.findIndex(e => e._id === exam._id);
    if (examIndex > -1) {
      mockExams[examIndex] = updatedExam;
      updateExamStats(exam._id);
    }
  };

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
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Exam not found</h3>
          <p className="mt-1 text-sm text-gray-500">
            The exam you're looking for doesn't exist.
          </p>
          <div className="mt-6">
            <Link
              to="/exams"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700"
            >
              Back to Exams
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/exams')}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{exam.title}</h1>
              {exam.description && (
                <p className="mt-1 text-gray-600">{exam.description}</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Link
              to={`/exams/${exam._id}/analytics`}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </Link>
            <Link
              to={`/exams/${exam._id}/edit`}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Exam
            </Link>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Questions
                    </dt>
                    <dd className="text-lg font-semibold text-gray-900">
                      {exam.stats.questionCount}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-6 w-6 text-emerald-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Students
                    </dt>
                    <dd className="text-lg font-semibold text-gray-900">
                      {exam.stats.studentCount}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Graded
                    </dt>
                    <dd className="text-lg font-semibold text-gray-900">
                      {exam.stats.gradedAnswers}/{exam.stats.totalAnswers}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Status
                    </dt>
                    <dd className={`text-lg font-semibold capitalize ${
                      exam.status === 'completed' ? 'text-green-600' :
                      exam.status === 'active' ? 'text-blue-600' : 'text-gray-600'
                    }`}>
                      {exam.status}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {exam.sections.map((section) => (
            <div key={section._id} className="bg-white shadow-sm rounded-lg border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">{section.title}</h2>
                    {section.description && (
                      <p className="mt-1 text-sm text-gray-600">{section.description}</p>
                    )}
                  </div>
                  <Link
                    to={`/exams/${exam._id}/sections/${section._id}/questions/new`}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-50 hover:bg-blue-100"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Question
                  </Link>
                </div>
              </div>

              {section.questions.length === 0 ? (
                <div className="p-6 text-center">
                  <BookOpen className="mx-auto h-8 w-8 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No questions yet</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Get started by adding your first question to this section.
                  </p>
                  <div className="mt-4">
                    <Link
                      to={`/exams/${exam._id}/sections/${section._id}/questions/new`}
                      className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Question
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {section.questions.map((question, index) => (
                    <div key={question._id} className="p-6 hover:bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-500">
                              Question {index + 1}
                            </span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                              {question.maxScore} points
                            </span>
                          </div>
                          
                          <p className="mt-2 text-gray-900 line-clamp-2">
                            {question.promptText}
                          </p>
                          
                          <div className="mt-3 flex items-center space-x-4 text-sm text-gray-500">
                            <span className="flex items-center">
                              <Users className="h-4 w-4 mr-1" />
                              {question.answers.length} answers
                            </span>
                            <span className="flex items-center">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              {question.answers.filter(a => a.score !== undefined).length} graded
                            </span>
                          </div>
                        </div>
                        
                        <div className="ml-6 flex items-center space-x-2">
                          <Link
                            to={`/questions/${question._id}/grade`}
                            className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                          >
                            Grade Answers
                          </Link>
                          <Link
                            to={`/questions/${question._id}/edit`}
                            className="p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => deleteQuestion(question._id)}
                            className="p-1.5 text-red-400 hover:text-red-600 rounded-full hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default ExamDetail;
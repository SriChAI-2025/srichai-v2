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
  BookOpen,
  Palette,
  Calendar,
  Code,
  Save,
  Target,
  Award,
  Zap,
  Eye,
  Upload
} from 'lucide-react';
import Layout from '../components/Layout/Layout';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import UploadAnswerModal from '../components/UI/UploadAnswerModal';
import { mockExams, MockExam, updateExamStats, MockAnswer } from '../data/mockData';
import { useTheme } from '../contexts/ThemeContext';

type DesignStyle = 'classic' | 'neo-brutalism';

const ExamDetail: React.FC = () => {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [exam, setExam] = useState<MockExam | null>(null);
  const [loading, setLoading] = useState(true);
  const [designStyle, setDesignStyle] = useState<DesignStyle>('neo-brutalism');
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<{ id: string; text: string; number: number } | null>(null);

  useEffect(() => {
    fetchExam();
  }, [examId]);

  const fetchExam = async () => {
    setTimeout(() => {
      console.log('Looking for exam with ID:', examId);
      console.log('Available exams:', mockExams.map(e => ({ id: e._id, title: e.title })));
      const foundExam = mockExams.find(e => e._id === examId);
      console.log('Found exam:', foundExam ? foundExam.title : 'NOT FOUND');
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

  const openUploadModal = (questionId: string, questionText: string, questionNumber: number) => {
    setSelectedQuestion({ id: questionId, text: questionText, number: questionNumber });
    setUploadModalOpen(true);
  };

  const closeUploadModal = () => {
    setUploadModalOpen(false);
    setSelectedQuestion(null);
  };

  const handleUploadAnswer = async (studentRollNumber: string, files: File[]) => {
    if (!exam || !selectedQuestion) return;

    try {
      // Create URLs for uploaded files (in a real app, these would be uploaded to a server)
      const uploadedFiles = files.map(file => ({
        name: file.name,
        url: URL.createObjectURL(file), // Temporary URL for demo
        size: file.size
      }));

      // Create new answer
      const newAnswer: MockAnswer = {
        _id: `a_${selectedQuestion.id}_${studentRollNumber}_${Date.now()}`,
        examId: exam._id,
        questionId: selectedQuestion.id,
        studentId: studentRollNumber,
        answerImages: uploadedFiles.map(f => f.url),
        answerText: `Uploaded files: ${uploadedFiles.map(f => f.name).join(', ')}`,
        createdAt: new Date().toISOString()
      };

      // Update the exam with the new answer
      const updatedSections = exam.sections.map(section => ({
        ...section,
        questions: section.questions.map(question => 
          question._id === selectedQuestion.id
            ? { ...question, answers: [...question.answers, newAnswer] }
            : question
        )
      }));

      const updatedExam = { ...exam, sections: updatedSections };
      setExam(updatedExam);

      // Update global mock data
      const examIndex = mockExams.findIndex(e => e._id === exam._id);
      if (examIndex > -1) {
        mockExams[examIndex] = updatedExam;
        updateExamStats(exam._id);
      }

      // Show success message
      alert(`Answer uploaded successfully for student ${studentRollNumber}!`);
      
    } catch (error) {
      console.error('Error uploading answer:', error);
      alert('Error uploading answer. Please try again.');
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
    const isNeoBrutalism = designStyle === 'neo-brutalism';
    const cardClass = isNeoBrutalism ? "neo-card" : "bg-white shadow-sm rounded-lg border border-gray-200";
    const buttonClass = isNeoBrutalism 
      ? "neo-button py-3 px-6" 
      : "inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors";
    
    return (
      <Layout>
        <div className={`text-center py-16 ${cardClass} p-8`}>
          <FileText className={`mx-auto h-12 w-12 ${isNeoBrutalism ? 'text-black' : 'text-gray-400'}`} />
          <h3 className={`mt-2 text-lg font-medium ${isNeoBrutalism ? 'font-black uppercase tracking-wider text-black' : 'text-gray-900'}`}>
            {isNeoBrutalism ? 'EXAM NOT FOUND' : 'Exam not found'}
          </h3>
          <p className={`mt-1 text-sm ${isNeoBrutalism ? 'font-bold uppercase tracking-wide text-gray-700' : 'text-gray-500'}`}>
            {isNeoBrutalism ? 'THE EXAM YOU\'RE LOOKING FOR DOESN\'T EXIST.' : 'The exam you\'re looking for doesn\'t exist.'}
          </p>
          <div className="mt-6">
            <Link to="/exams" className={buttonClass}>
              {isNeoBrutalism ? 'BACK TO EXAMS' : 'Back to Exams'}
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const isNeoBrutalism = designStyle === 'neo-brutalism';
  const isClassicTheme = theme === 'classic';
  
  // Design-specific class sets
  const cardClass = isNeoBrutalism ? "neo-card" : "bg-white shadow-sm rounded-lg border border-gray-200";
  const buttonPrimaryClass = isNeoBrutalism
    ? "neo-button"
    : "inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors";
  const buttonSecondaryClass = isNeoBrutalism
    ? "neo-button-secondary"
    : "inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors";

  const headerClass = isNeoBrutalism ? "bg-blue-600 text-white p-6 border-b-4 border-black" : "bg-gray-50 p-6 border-b border-gray-200";
  const textClass = isNeoBrutalism ? "font-black uppercase tracking-wider" : "font-semibold";
  const subTextClass = isNeoBrutalism ? "font-bold uppercase tracking-wide" : "text-gray-600";

  // Calculate total questions
  const totalQuestions = exam.sections.reduce((total, section) => total + section.questions.length, 0);

  return (
    <Layout>
      <div className={`space-y-6 ${isClassicTheme ? 'theme-classic' : ''}`}>
        {/* Header */}
        <div className={cardClass}>
          <div className={headerClass}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate('/exams')}
                  className={isNeoBrutalism ? "neo-button-icon" : "p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"}
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <div>
                  <h1 className={`text-3xl ${textClass} ${isNeoBrutalism ? 'text-white' : 'text-gray-900'}`}>
                    {exam.title}
                  </h1>
                  {exam.description && (
                    <p className={`mt-1 ${subTextClass} ${isNeoBrutalism ? 'text-blue-100' : ''}`}>
                      {exam.description}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setDesignStyle(designStyle === 'classic' ? 'neo-brutalism' : 'classic')}
                  className={buttonSecondaryClass}
                >
                  <Palette className="h-4 w-4 mr-2" />
                  {isNeoBrutalism ? 'CLASSIC' : 'Neo Style'}
                </button>
                <Link to={`/exams/${exam._id}/grade`} className={buttonPrimaryClass}>
                  <Edit className="h-4 w-4 mr-2" />
                  {isNeoBrutalism ? 'GRADE EXAM' : 'Grade Exam'}
                </Link>
              </div>
            </div>
          </div>
          
          {/* Exam Details */}
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className={`p-4 ${isNeoBrutalism ? 'bg-gray-50 border-4 border-black' : 'bg-gray-50 rounded-lg border border-gray-200'}`}>
                <div className="flex items-center space-x-3">
                  <div className={`p-2 ${isNeoBrutalism ? 'bg-blue-600 text-white border-2 border-black' : 'bg-blue-100 text-blue-600 rounded-lg'}`}>
                    <Code className="h-5 w-5" />
                  </div>
                  <div>
                    <p className={`text-sm ${subTextClass}`}>
                      {isNeoBrutalism ? 'EXAM CODE' : 'Exam Code'}
                    </p>
                    <p className={`text-lg ${textClass} ${isNeoBrutalism ? 'text-black' : 'text-gray-900'}`}>
                      {exam.examCode}
                    </p>
                  </div>
                </div>
              </div>

              <div className={`p-4 ${isNeoBrutalism ? 'bg-gray-50 border-4 border-black' : 'bg-gray-50 rounded-lg border border-gray-200'}`}>
                <div className="flex items-center space-x-3">
                  <div className={`p-2 ${isNeoBrutalism ? 'bg-green-600 text-white border-2 border-black' : 'bg-green-100 text-green-600 rounded-lg'}`}>
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div>
                    <p className={`text-sm ${subTextClass}`}>
                      {isNeoBrutalism ? 'SUBJECT' : 'Subject'}
                    </p>
                    <p className={`text-lg ${textClass} ${isNeoBrutalism ? 'text-black' : 'text-gray-900'}`}>
                      {exam.subject}
                    </p>
                  </div>
                </div>
              </div>

              <div className={`p-4 ${isNeoBrutalism ? 'bg-gray-50 border-4 border-black' : 'bg-gray-50 rounded-lg border border-gray-200'}`}>
                <div className="flex items-center space-x-3">
                  <div className={`p-2 ${isNeoBrutalism ? 'bg-purple-600 text-white border-2 border-black' : 'bg-purple-100 text-purple-600 rounded-lg'}`}>
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <p className={`text-sm ${subTextClass}`}>
                      {isNeoBrutalism ? 'DURATION' : 'Duration'}
                    </p>
                    <p className={`text-lg ${textClass} ${isNeoBrutalism ? 'text-black' : 'text-gray-900'}`}>
                      {exam.duration} min
                    </p>
                  </div>
                </div>
              </div>

              <div className={`p-4 ${isNeoBrutalism ? 'bg-gray-50 border-4 border-black' : 'bg-gray-50 rounded-lg border border-gray-200'}`}>
                <div className="flex items-center space-x-3">
                  <div className={`p-2 ${isNeoBrutalism ? 'bg-orange-600 text-white border-2 border-black' : 'bg-orange-100 text-orange-600 rounded-lg'}`}>
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <p className={`text-sm ${subTextClass}`}>
                      {isNeoBrutalism ? 'CREATED' : 'Created'}
                    </p>
                    <p className={`text-lg ${textClass} ${isNeoBrutalism ? 'text-black' : 'text-gray-900'}`}>
                      {new Date(exam.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className={cardClass}>
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`p-3 ${isNeoBrutalism ? 'bg-blue-600 text-white border-2 border-black' : 'bg-blue-100 text-blue-600 rounded-lg'}`}>
                    <FileText className="h-6 w-6" />
                  </div>
                </div>
                <div className="ml-4 w-0 flex-1">
                  <dl>
                    <dt className={`text-sm ${subTextClass}`}>
                      {isNeoBrutalism ? 'QUESTIONS' : 'Questions'}
                    </dt>
                    <dd className={`text-2xl ${textClass} ${isNeoBrutalism ? 'text-black' : 'text-gray-900'}`}>
                      {totalQuestions}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className={cardClass}>
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`p-3 ${isNeoBrutalism ? 'bg-emerald-600 text-white border-2 border-black' : 'bg-emerald-100 text-emerald-600 rounded-lg'}`}>
                    <Users className="h-6 w-6" />
                  </div>
                </div>
                <div className="ml-4 w-0 flex-1">
                  <dl>
                    <dt className={`text-sm ${subTextClass}`}>
                      {isNeoBrutalism ? 'STUDENTS' : 'Students'}
                    </dt>
                    <dd className={`text-2xl ${textClass} ${isNeoBrutalism ? 'text-black' : 'text-gray-900'}`}>
                      {exam.stats.studentCount}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className={cardClass}>
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`p-3 ${isNeoBrutalism ? 'bg-green-600 text-white border-2 border-black' : 'bg-green-100 text-green-600 rounded-lg'}`}>
                    <CheckCircle className="h-6 w-6" />
                  </div>
                </div>
                <div className="ml-4 w-0 flex-1">
                  <dl>
                    <dt className={`text-sm ${subTextClass}`}>
                      {isNeoBrutalism ? 'GRADED' : 'Graded'}
                    </dt>
                    <dd className={`text-2xl ${textClass} ${isNeoBrutalism ? 'text-black' : 'text-gray-900'}`}>
                      {exam.stats.gradedAnswers}/{exam.stats.totalAnswers}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className={cardClass}>
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`p-3 ${isNeoBrutalism ? 'bg-purple-600 text-white border-2 border-black' : 'bg-purple-100 text-purple-600 rounded-lg'}`}>
                    <Target className="h-6 w-6" />
                  </div>
                </div>
                <div className="ml-4 w-0 flex-1">
                  <dl>
                    <dt className={`text-sm ${subTextClass}`}>
                      {isNeoBrutalism ? 'STATUS' : 'Status'}
                    </dt>
                    <dd className={`text-2xl ${textClass} capitalize ${
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
          {exam.sections.map((section, sectionIndex) => (
            <div key={section._id} className={cardClass}>
              <div className={`${headerClass} ${isNeoBrutalism ? 'bg-purple-600' : 'bg-gray-50'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className={`text-xl ${textClass} ${isNeoBrutalism ? 'text-white' : 'text-gray-900'}`}>
                      {section.title}
                    </h2>
                    {section.description && (
                      <p className={`mt-1 ${subTextClass} ${isNeoBrutalism ? 'text-purple-100' : ''}`}>
                        {section.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 text-sm ${textClass} ${isNeoBrutalism ? 'bg-white text-purple-600 border-2 border-black' : 'bg-purple-100 text-purple-800 rounded-full'}`}>
                      {section.questions.length} Questions
                    </span>
                    <Link
                      to={`/exams/${exam._id}/sections/${section._id}/questions/new`}
                      className={isNeoBrutalism ? 'neo-button-secondary text-sm' : 'inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors'}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      {isNeoBrutalism ? 'ADD QUESTION' : 'Add Question'}
                    </Link>
                  </div>
                </div>
              </div>

              {section.questions.length === 0 ? (
                <div className="p-12 text-center">
                  <BookOpen className={`mx-auto h-12 w-12 ${isNeoBrutalism ? 'text-black' : 'text-gray-400'}`} />
                  <h3 className={`mt-2 text-lg ${textClass} ${isNeoBrutalism ? 'text-black' : 'text-gray-900'}`}>
                    {isNeoBrutalism ? 'NO QUESTIONS YET' : 'No questions yet'}
                  </h3>
                  <p className={`mt-1 ${subTextClass}`}>
                    {isNeoBrutalism ? 'ADD YOUR FIRST QUESTION TO THIS SECTION' : 'Add your first question to this section'}
                  </p>
                </div>
              ) : (
                <div className={isNeoBrutalism ? 'divide-y-4 divide-black' : 'divide-y divide-gray-200'}>
                  {section.questions.map((question, questionIndex) => (
                    <div key={question._id} className={`p-6 ${isNeoBrutalism ? 'hover:bg-gray-50' : 'hover:bg-gray-50'}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-3 mb-3">
                            <span className={`px-2 py-1 text-xs ${textClass} ${isNeoBrutalism ? 'bg-gray-200 text-black border-2 border-black' : 'bg-gray-100 text-gray-700 rounded'}`}>
                              {isNeoBrutalism ? `Q${questionIndex + 1}` : `Question ${questionIndex + 1}`}
                            </span>
                            <span className={`px-2 py-1 text-xs ${textClass} ${isNeoBrutalism ? 'bg-blue-600 text-white border-2 border-black' : 'bg-blue-100 text-blue-800 rounded'}`}>
                              {question.maxScore} {isNeoBrutalism ? 'PTS' : 'points'}
                            </span>
                            {question.questionCode && (
                              <span className={`px-2 py-1 text-xs ${textClass} ${isNeoBrutalism ? 'bg-green-600 text-white border-2 border-black' : 'bg-green-100 text-green-800 rounded'}`}>
                                {question.questionCode}
                              </span>
                            )}
                          </div>
                          
                          <p className={`text-gray-900 mb-3 ${isNeoBrutalism ? 'font-bold' : ''}`}>
                            {question.promptText}
                          </p>
                          
                          {question.modelAnswer && (
                            <div className={`mb-3 p-3 ${isNeoBrutalism ? 'bg-gray-100 border-2 border-black' : 'bg-gray-50 rounded border border-gray-200'}`}>
                              <p className={`text-xs ${subTextClass} mb-1`}>
                                {isNeoBrutalism ? 'MODEL ANSWER:' : 'Model Answer:'}
                              </p>
                              <p className={`text-sm ${isNeoBrutalism ? 'font-bold' : ''} text-gray-700`}>
                                {question.modelAnswer}
                              </p>
                            </div>
                          )}
                          
                          <div className={`flex items-center space-x-4 text-sm ${subTextClass}`}>
                            <span className="flex items-center">
                              <Users className="h-4 w-4 mr-1" />
                              {question.answers.length} {isNeoBrutalism ? 'ANSWERS' : 'answers'}
                            </span>
                            <span className="flex items-center">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              {question.answers.filter(a => a.score !== undefined).length} {isNeoBrutalism ? 'GRADED' : 'graded'}
                            </span>
                          </div>
                        </div>
                        
                        <div className="ml-6 flex items-center space-x-2">
                          <button
                            onClick={() => openUploadModal(question._id, question.promptText, questionIndex + 1)}
                            className={isNeoBrutalism ? 'neo-button-secondary text-sm' : 'inline-flex items-center px-3 py-1.5 border border-blue-300 shadow-sm text-xs font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors'}
                          >
                            <Upload className="h-4 w-4 mr-1" />
                            {isNeoBrutalism ? 'UPLOAD ANSWERS' : 'Upload Answers'}
                          </button>
                          <Link
                            to={`/questions/${question._id}/grade`}
                            className={isNeoBrutalism ? 'neo-button-secondary text-sm' : 'inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors'}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            {isNeoBrutalism ? 'GRADE' : 'Grade'}
                          </Link>
                          <button
                            onClick={() => deleteQuestion(question._id)}
                            className={isNeoBrutalism ? 'neo-button-icon text-red-600' : 'p-1.5 text-red-400 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors'}
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

        {/* Quick Actions */}
        <div className={cardClass}>
          <div className={`${headerClass} ${isNeoBrutalism ? 'bg-green-600' : 'bg-gray-50'}`}>
            <h3 className={`text-lg ${textClass} ${isNeoBrutalism ? 'text-white' : 'text-gray-900'}`}>
              {isNeoBrutalism ? 'QUICK ACTIONS' : 'Quick Actions'}
            </h3>
          </div>
          <div className="p-6">
            <div className="flex flex-wrap gap-4">
              <Link to={`/exams/${exam._id}/grade`} className={buttonPrimaryClass}>
                <BarChart3 className="h-4 w-4 mr-2" />
                {isNeoBrutalism ? 'GRADE EXAM' : 'Grade Exam'}
              </Link>
              <button className={buttonSecondaryClass}>
                <Users className="h-4 w-4 mr-2" />
                {isNeoBrutalism ? 'STUDENT REPORTS' : 'Student Reports'}
              </button>
              <button className={buttonSecondaryClass}>
                <Target className="h-4 w-4 mr-2" />
                {isNeoBrutalism ? 'ANALYTICS' : 'Analytics'}
              </button>
              <button className={buttonSecondaryClass}>
                <Save className="h-4 w-4 mr-2" />
                {isNeoBrutalism ? 'EXPORT DATA' : 'Export Data'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Answer Modal */}
      {selectedQuestion && (
        <UploadAnswerModal
          isOpen={uploadModalOpen}
          onClose={closeUploadModal}
          onUpload={handleUploadAnswer}
          questionNumber={selectedQuestion.number}
          questionText={selectedQuestion.text}
        />
      )}
    </Layout>
  );
};

export default ExamDetail;
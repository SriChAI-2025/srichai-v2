import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Save, ArrowLeft, BookOpen, Palette } from 'lucide-react';
import Layout from '../components/Layout/Layout';
import { createMockExam, createMockQuestion, updateExamStats, MockExam } from '../data/mockData';
import { useTheme } from '../contexts/ThemeContext';
import toast from 'react-hot-toast';

interface Question {
  id: string;
  questionCode: string;
  questionText: string;
  rubric: string;
  sectionId: string;
  order: number;
}

type DesignStyle = 'classic' | 'neo-brutalism';

const defaultSections = [
  {
    id: 'section_a',
    title: 'Section A: Short Answers',
    description: 'Answer briefly in 2-3 sentences',
    maxScore: 2,
    order: 0
  },
  {
    id: 'section_b',
    title: 'Section B: Detailed Explanations',
    description: 'Provide detailed explanations with examples',
    maxScore: 5,
    order: 1
  },
  {
    id: 'section_c',
    title: 'Section C: Problem Solving',
    description: 'Solve problems showing all work and calculations',
    maxScore: 8,
    order: 2
  }
];

const CreateExam: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [designStyle, setDesignStyle] = useState<DesignStyle>('neo-brutalism');
  const [examData, setExamData] = useState({
    title: '',
    description: '',
    examCode: '',
    status: 'draft' as 'draft' | 'active' | 'completed'
  });
  const [questions, setQuestions] = useState<Question[]>([]);
  const [activeSection, setActiveSection] = useState('section_a');
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    questionCode: '',
    questionText: '',
    rubric: ''
  });

  const generateExamCode = () => {
    const code = 'EX' + Math.random().toString(36).substr(2, 6).toUpperCase();
    setExamData(prev => ({ ...prev, examCode: code }));
  };

  const addQuestion = () => {
    if (!newQuestion.questionCode || !newQuestion.questionText || !newQuestion.rubric) {
      toast.error('Please fill all question fields');
      return;
    }

    // Check if question code already exists
    if (questions.some(q => q.questionCode === newQuestion.questionCode)) {
      toast.error('Question code already exists');
      return;
    }

    const question: Question = {
      id: `q_${Date.now()}`,
      questionCode: newQuestion.questionCode,
      questionText: newQuestion.questionText,
      rubric: newQuestion.rubric,
      sectionId: activeSection,
      order: questions.filter(q => q.sectionId === activeSection).length
    };

    setQuestions([...questions, question]);
    setNewQuestion({ questionCode: '', questionText: '', rubric: '' });
    setShowAddQuestion(false);
    toast.success('Question added successfully');
  };

  const removeQuestion = (questionId: string) => {
    if (!confirm('Are you sure you want to remove this question?')) return;
    setQuestions(questions.filter(q => q.id !== questionId));
    toast.success('Question removed');
  };

  const updateQuestion = (questionId: string, field: keyof Question, value: string) => {
    setQuestions(questions.map(q => 
      q.id === questionId ? { ...q, [field]: value } : q
    ));
  };

  const getQuestionsForSection = (sectionId: string) => {
    return questions.filter(q => q.sectionId === sectionId).sort((a, b) => a.order - b.order);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!examData.title || !examData.examCode) {
      toast.error('Please fill exam title and code');
      return;
    }

    if (questions.length === 0) {
      toast.error('Please add at least one question');
      return;
    }

    setLoading(true);

    try {
      // Create the exam with mock data
      const newExam = createMockExam({
        title: examData.title,
        description: examData.description,
        status: examData.status,
        subject: examData.title.toLowerCase().includes('physics') ? 'Physics' : 
                examData.title.toLowerCase().includes('math') ? 'Mathematics' : 'General',
        duration: 60,
        sections: defaultSections.map(section => ({
          _id: section.id,
          title: section.title,
          description: section.description,
          order: section.order,
          questions: getQuestionsForSection(section.id).map(q => 
            createMockQuestion({
              examId: '',
              sectionId: section.id,
              promptText: q.questionText,
              modelAnswer: q.rubric,
              maxScore: section.maxScore,
              order: q.order,
              questionCode: q.questionCode
            })
          )
        }))
      });

      // Update all questions with the correct examId
      newExam.sections.forEach(section => {
        section.questions.forEach(question => {
          question.examId = newExam._id;
        });
      });

      updateExamStats(newExam._id);
      toast.success('Exam created successfully!');
      
      // Navigate to the exam detail page
      navigate(`/exams/${newExam._id}`);
    } catch (error) {
      console.error('Error creating exam:', error);
      toast.error('Failed to create exam');
    } finally {
      setLoading(false);
    }
  };

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
  const inputClass = isNeoBrutalism ? "neo-input" : "w-full px-4 py-3 text-lg font-medium border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500";

  return (
    <Layout>
      <div className={`space-y-8 ${isClassicTheme ? 'theme-classic' : ''}`}>
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
                  <h1 className={`text-4xl ${textClass} ${isNeoBrutalism ? 'text-white' : 'text-gray-900'}`}>
                    {isNeoBrutalism ? 'CREATE EXAM' : 'Create Exam'}
                  </h1>
                  <p className={`text-lg ${subTextClass} ${isNeoBrutalism ? 'text-blue-100' : ''}`}>
                    {isNeoBrutalism ? 'SET UP YOUR EXAM WITH QUESTIONS' : 'Set up your exam with questions'}
                  </p>
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
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className={cardClass}>
            <div className={`${headerClass} ${isNeoBrutalism ? 'bg-blue-600' : 'bg-gray-50'}`}>
              <h2 className={`text-2xl ${textClass} ${isNeoBrutalism ? 'text-white' : 'text-gray-900'}`}>
                {isNeoBrutalism ? 'EXAM DETAILS' : 'Exam Details'}
              </h2>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={`block text-sm ${textClass} ${isNeoBrutalism ? 'text-gray-900' : 'text-gray-700'} mb-2`}>
                    {isNeoBrutalism ? 'EXAM TITLE *' : 'Exam Title *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={examData.title}
                    onChange={(e) => setExamData(prev => ({ ...prev, title: e.target.value }))}
                    className={`${inputClass} w-full px-4 py-3 text-lg ${isNeoBrutalism ? 'font-bold' : 'font-medium'}`}
                    placeholder={isNeoBrutalism ? 'ENTER EXAM TITLE' : 'Enter exam title'}
                  />
                </div>

                <div>
                  <label className={`block text-sm ${textClass} ${isNeoBrutalism ? 'text-gray-900' : 'text-gray-700'} mb-2`}>
                    {isNeoBrutalism ? 'EXAM CODE *' : 'Exam Code *'}
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      required
                      value={examData.examCode}
                      onChange={(e) => setExamData(prev => ({ ...prev, examCode: e.target.value.toUpperCase() }))}
                      className={`${inputClass} flex-1 px-4 py-3 text-lg ${isNeoBrutalism ? 'font-bold' : 'font-medium'}`}
                      placeholder={isNeoBrutalism ? 'EXAM CODE' : 'Exam Code'}
                    />
                    <button
                      type="button"
                      onClick={generateExamCode}
                      className={`${buttonSecondaryClass} px-4 py-3 text-sm`}
                    >
                      {isNeoBrutalism ? 'GENERATE' : 'Generate'}
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className={`block text-sm ${textClass} ${isNeoBrutalism ? 'text-gray-900' : 'text-gray-700'} mb-2`}>
                  {isNeoBrutalism ? 'DESCRIPTION' : 'Description'}
                </label>
                <textarea
                  rows={3}
                  value={examData.description}
                  onChange={(e) => setExamData(prev => ({ ...prev, description: e.target.value }))}
                  className={`${inputClass} w-full px-4 py-3 text-lg ${isNeoBrutalism ? 'font-bold' : 'font-medium'}`}
                  placeholder={isNeoBrutalism ? 'ENTER EXAM DESCRIPTION' : 'Enter exam description'}
                />
              </div>

              <div>
                <label className={`block text-sm ${textClass} ${isNeoBrutalism ? 'text-gray-900' : 'text-gray-700'} mb-2`}>
                  {isNeoBrutalism ? 'STATUS' : 'Status'}
                </label>
                <select
                  value={examData.status}
                  onChange={(e) => setExamData(prev => ({ ...prev, status: e.target.value as any }))}
                  className={`${inputClass} w-full px-4 py-3 text-lg ${isNeoBrutalism ? 'font-bold' : 'font-medium'}`}
                >
                  <option value="draft">{isNeoBrutalism ? 'DRAFT' : 'Draft'}</option>
                  <option value="active">{isNeoBrutalism ? 'ACTIVE' : 'Active'}</option>
                  <option value="completed">{isNeoBrutalism ? 'COMPLETED' : 'Completed'}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section Tabs */}
          <div className={cardClass}>
            <div className={`${headerClass} ${isNeoBrutalism ? 'bg-purple-600' : 'bg-gray-50'}`}>
              <h2 className={`text-2xl ${textClass} ${isNeoBrutalism ? 'text-white' : 'text-gray-900'}`}>
                {isNeoBrutalism ? 'EXAM SECTIONS' : 'Exam Sections'}
              </h2>
            </div>

            {/* Section Navigation */}
            <div className={`${isNeoBrutalism ? 'border-b-4 border-black bg-gray-50' : 'border-b border-gray-200 bg-gray-50'}`}>
              <div className="flex">
                {defaultSections.map((section) => (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => setActiveSection(section.id)}
                    className={`flex-1 px-6 py-4 ${textClass} text-sm transition-colors ${
                      isNeoBrutalism ? 'border-r-4 border-black' : 'border-r border-gray-200'
                    } ${
                      activeSection === section.id
                        ? isNeoBrutalism ? 'bg-purple-600 text-white' : 'bg-blue-50 text-blue-600'
                        : isNeoBrutalism ? 'bg-white text-black hover:bg-gray-100' : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div>
                      <div>{section.title.split(':')[0]}</div>
                      <div className={`text-xs ${isNeoBrutalism ? 'font-bold opacity-75' : 'font-medium opacity-75'}`}>
                        {section.maxScore} {isNeoBrutalism ? 'MARKS EACH' : 'marks each'}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Active Section Content */}
            <div className="p-6">
              {defaultSections.map((section) => (
                <div
                  key={section.id}
                  className={activeSection === section.id ? 'block' : 'hidden'}
                >
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className={`text-xl ${textClass} ${isNeoBrutalism ? 'text-gray-900' : 'text-gray-900'}`}>
                        {section.title}
                      </h3>
                      <p className={`text-base ${subTextClass}`}>
                        {section.description} ({section.maxScore} {isNeoBrutalism ? 'marks each' : 'marks each'})
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowAddQuestion(true)}
                      className={`${buttonPrimaryClass} px-4 py-3 flex items-center space-x-2`}
                    >
                      <Plus className="h-5 w-5" />
                      <span>{isNeoBrutalism ? 'ADD QUESTION' : 'Add Question'}</span>
                    </button>
                  </div>

                  {/* Questions List */}
                  <div className="space-y-4">
                    {getQuestionsForSection(section.id).length === 0 ? (
                      <div className="text-center py-8">
                        <BookOpen className={`mx-auto h-12 w-12 ${isNeoBrutalism ? 'text-black' : 'text-gray-400'}`} />
                        <p className={`mt-2 text-lg ${textClass} ${isNeoBrutalism ? 'text-black' : 'text-gray-900'}`}>
                          {isNeoBrutalism ? 'NO QUESTIONS YET' : 'No questions yet'}
                        </p>
                        <p className={`mt-1 ${subTextClass}`}>
                          {isNeoBrutalism ? 'ADD YOUR FIRST QUESTION TO THIS SECTION' : 'Add your first question to this section'}
                        </p>
                      </div>
                    ) : (
                      getQuestionsForSection(section.id).map((question, index) => (
                        <div key={question.id} className={`${isNeoBrutalism ? 'neo-card' : 'bg-gray-50 rounded-lg border border-gray-200'} p-4`}>
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-3">
                                <span className={`px-2 py-1 text-xs ${textClass} ${isNeoBrutalism ? 'bg-gray-200 text-black border-2 border-black' : 'bg-gray-100 text-gray-700 rounded'}`}>
                                  {isNeoBrutalism ? `Q${index + 1}` : `Question ${index + 1}`}
                                </span>
                                <span className={`px-2 py-1 text-xs ${textClass} ${isNeoBrutalism ? 'bg-blue-600 text-white border-2 border-black' : 'bg-blue-100 text-blue-800 rounded'}`}>
                                  {question.questionCode}
                                </span>
                              </div>
                              
                              <div className="space-y-3">
                                <div>
                                  <label className={`block text-xs ${textClass} ${isNeoBrutalism ? 'text-gray-700' : 'text-gray-600'} mb-1`}>
                                    {isNeoBrutalism ? 'QUESTION' : 'Question'}
                                  </label>
                                  <textarea
                                    rows={3}
                                    value={question.questionText}
                                    onChange={(e) => updateQuestion(question.id, 'questionText', e.target.value)}
                                    className={`${inputClass} w-full px-3 py-2 text-base ${isNeoBrutalism ? 'font-bold' : 'font-medium'}`}
                                    placeholder={isNeoBrutalism ? 'ENTER QUESTION TEXT' : 'Enter question text'}
                                  />
                                </div>
                                
                                <div>
                                  <label className={`block text-xs ${textClass} ${isNeoBrutalism ? 'text-gray-700' : 'text-gray-600'} mb-1`}>
                                    {isNeoBrutalism ? 'RUBRIC (GRADING CRITERIA)' : 'Rubric (Grading Criteria)'}
                                  </label>
                                  <textarea
                                    rows={2}
                                    value={question.rubric}
                                    onChange={(e) => updateQuestion(question.id, 'rubric', e.target.value)}
                                    className={`${inputClass} w-full px-3 py-2 text-base ${isNeoBrutalism ? 'font-bold' : 'font-medium'}`}
                                    placeholder={isNeoBrutalism ? 'ENTER GRADING RUBRIC' : 'Enter grading rubric'}
                                  />
                                </div>
                              </div>
                            </div>
                            
                            <button
                              type="button"
                              onClick={() => removeQuestion(question.id)}
                              className={`ml-4 p-2 text-red-500 hover:text-red-700 ${isNeoBrutalism ? 'border-2 border-red-500 hover:border-red-700' : 'border border-red-300 hover:border-red-500 rounded'} transition-colors`}
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/exams')}
              className={`${buttonSecondaryClass} px-6 py-4 text-lg`}
            >
              {isNeoBrutalism ? 'CANCEL' : 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={loading || !examData.title.trim() || !examData.examCode.trim() || questions.length === 0}
              className={`${buttonPrimaryClass} px-6 py-4 text-lg flex items-center space-x-2`}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  <span>{isNeoBrutalism ? 'CREATING...' : 'Creating...'}</span>
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  <span>{isNeoBrutalism ? 'CREATE EXAM' : 'Create Exam'}</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Add Question Modal */}
        {showAddQuestion && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className={`${isNeoBrutalism ? 'bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]' : 'bg-white shadow-lg rounded-lg border border-gray-200'} max-w-2xl w-full max-h-[90vh] overflow-y-auto`}>
              <div className={`${isNeoBrutalism ? 'bg-orange-500 text-white p-6 border-b-4 border-black' : 'bg-gray-50 p-6 border-b border-gray-200'}`}>
                <h3 className={`text-2xl ${textClass} ${isNeoBrutalism ? 'text-white' : 'text-gray-900'}`}>
                  {isNeoBrutalism ? 'ADD NEW QUESTION' : 'Add New Question'}
                </h3>
                <p className={`${subTextClass} ${isNeoBrutalism ? 'text-orange-100' : 'text-gray-600'}`}>
                  {defaultSections.find(s => s.id === activeSection)?.title}
                </p>
              </div>
              
              <div className="p-6 space-y-6">
                <div>
                  <label className={`block text-sm ${textClass} ${isNeoBrutalism ? 'text-gray-900' : 'text-gray-700'} mb-2`}>
                    {isNeoBrutalism ? 'QUESTION CODE *' : 'Question Code *'}
                  </label>
                  <input
                    type="text"
                    value={newQuestion.questionCode}
                    onChange={(e) => setNewQuestion(prev => ({ ...prev, questionCode: e.target.value.toUpperCase() }))}
                    className={`${inputClass} w-full px-4 py-3 text-lg ${isNeoBrutalism ? 'font-bold' : 'font-medium'}`}
                    placeholder={isNeoBrutalism ? 'E.G., Q1A, Q2B, Q3C' : 'e.g., Q1A, Q2B, Q3C'}
                  />
                </div>

                <div>
                  <label className={`block text-sm ${textClass} ${isNeoBrutalism ? 'text-gray-900' : 'text-gray-700'} mb-2`}>
                    {isNeoBrutalism ? 'QUESTION TEXT *' : 'Question Text *'}
                  </label>
                  <textarea
                    rows={4}
                    value={newQuestion.questionText}
                    onChange={(e) => setNewQuestion(prev => ({ ...prev, questionText: e.target.value }))}
                    className={`${inputClass} w-full px-4 py-3 text-lg ${isNeoBrutalism ? 'font-bold' : 'font-medium'}`}
                    placeholder={isNeoBrutalism ? 'ENTER THE QUESTION THAT STUDENTS WILL SEE' : 'Enter the question that students will see'}
                  />
                </div>

                <div>
                  <label className={`block text-sm ${textClass} ${isNeoBrutalism ? 'text-gray-900' : 'text-gray-700'} mb-2`}>
                    {isNeoBrutalism ? 'RUBRIC (GRADING CRITERIA) *' : 'Rubric (Grading Criteria) *'}
                  </label>
                  <textarea
                    rows={4}
                    value={newQuestion.rubric}
                    onChange={(e) => setNewQuestion(prev => ({ ...prev, rubric: e.target.value }))}
                    className={`${inputClass} w-full px-4 py-3 text-lg ${isNeoBrutalism ? 'font-bold' : 'font-medium'}`}
                    placeholder={isNeoBrutalism ? 'ENTER GRADING CRITERIA AND MODEL ANSWER' : 'Enter grading criteria and model answer'}
                  />
                  <p className={`text-sm ${subTextClass} mt-2`}>
                    {isNeoBrutalism ? 'THIS WILL NOT BE VISIBLE TO STUDENTS' : 'This will not be visible to students'}
                  </p>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddQuestion(false);
                      setNewQuestion({ questionCode: '', questionText: '', rubric: '' });
                    }}
                    className={`${buttonSecondaryClass} px-6 py-3`}
                  >
                    {isNeoBrutalism ? 'CANCEL' : 'Cancel'}
                  </button>
                  <button
                    type="button"
                    onClick={addQuestion}
                    className={`${buttonPrimaryClass} px-6 py-3 flex items-center space-x-2`}
                  >
                    <Plus className="h-5 w-5" />
                    <span>{isNeoBrutalism ? 'ADD QUESTION' : 'Add Question'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CreateExam;
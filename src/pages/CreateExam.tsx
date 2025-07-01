import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Save, ArrowLeft, BookOpen } from 'lucide-react';
import Layout from '../components/Layout/Layout';
import { createMockExam, createMockQuestion, updateExamStats, MockExam } from '../data/mockData';
import toast from 'react-hot-toast';

interface Question {
  id: string;
  questionCode: string;
  questionText: string;
  rubric: string;
  sectionId: string;
  order: number;
}

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
  const [loading, setLoading] = useState(false);
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
              order: q.order
            })
          )
        }))
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

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/exams')}
              className="neo-button-secondary p-3"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 transform">
              <h1 className="text-4xl font-black text-black uppercase tracking-wider mb-2">CREATE EXAM</h1>
              <p className="text-lg font-bold text-gray-700 uppercase tracking-wide">
                SET UP YOUR EXAM WITH QUESTIONS
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="neo-card">
            <div className="bg-blue-600 text-white p-6 border-b-4 border-black">
              <h2 className="text-2xl font-black uppercase tracking-wider">EXAM DETAILS</h2>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-black text-gray-900 uppercase tracking-wider mb-2">
                    EXAM TITLE *
                  </label>
                  <input
                    type="text"
                    required
                    value={examData.title}
                    onChange={(e) => setExamData(prev => ({ ...prev, title: e.target.value }))}
                    className="neo-input w-full px-4 py-3 text-lg font-bold"
                    placeholder="ENTER EXAM TITLE"
                  />
                </div>

                <div>
                  <label className="block text-sm font-black text-gray-900 uppercase tracking-wider mb-2">
                    EXAM CODE *
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      required
                      value={examData.examCode}
                      onChange={(e) => setExamData(prev => ({ ...prev, examCode: e.target.value.toUpperCase() }))}
                      className="neo-input flex-1 px-4 py-3 text-lg font-bold"
                      placeholder="EXAM CODE"
                    />
                    <button
                      type="button"
                      onClick={generateExamCode}
                      className="neo-button-secondary px-4 py-3 text-sm"
                    >
                      GENERATE
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-black text-gray-900 uppercase tracking-wider mb-2">
                  DESCRIPTION
                </label>
                <textarea
                  rows={3}
                  value={examData.description}
                  onChange={(e) => setExamData(prev => ({ ...prev, description: e.target.value }))}
                  className="neo-input w-full px-4 py-3 text-lg font-bold"
                  placeholder="ENTER EXAM DESCRIPTION"
                />
              </div>

              <div>
                <label className="block text-sm font-black text-gray-900 uppercase tracking-wider mb-2">
                  STATUS
                </label>
                <select
                  value={examData.status}
                  onChange={(e) => setExamData(prev => ({ ...prev, status: e.target.value as any }))}
                  className="neo-input w-full px-4 py-3 text-lg font-bold"
                >
                  <option value="draft">DRAFT</option>
                  <option value="active">ACTIVE</option>
                  <option value="completed">COMPLETED</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section Tabs */}
          <div className="neo-card">
            <div className="bg-purple-600 text-white p-6 border-b-4 border-black">
              <h2 className="text-2xl font-black uppercase tracking-wider">EXAM SECTIONS</h2>
            </div>

            {/* Section Navigation */}
            <div className="border-b-4 border-black bg-gray-50">
              <div className="flex">
                {defaultSections.map((section) => (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => setActiveSection(section.id)}
                    className={`flex-1 px-6 py-4 font-black uppercase tracking-wider text-sm border-r-4 border-black transition-colors ${
                      activeSection === section.id
                        ? 'bg-purple-600 text-white'
                        : 'bg-white text-black hover:bg-gray-100'
                    }`}
                  >
                    <div>
                      <div>{section.title.split(':')[0]}</div>
                      <div className="text-xs font-bold opacity-75">{section.maxScore} MARKS EACH</div>
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
                      <h3 className="text-xl font-black text-gray-900 uppercase tracking-wider">
                        {section.title}
                      </h3>
                      <p className="text-base font-bold text-gray-600 uppercase tracking-wide">
                        {section.description} ({section.maxScore} marks each)
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowAddQuestion(true)}
                      className="neo-button px-4 py-3 flex items-center space-x-2"
                    >
                      <Plus className="h-5 w-5" />
                      <span>ADD QUESTION</span>
                    </button>
                  </div>

                  {/* Questions List */}
                  <div className="space-y-4">
                    {getQuestionsForSection(section.id).length === 0 ? (
                      <div className="text-center py-12 bg-gray-50 border-4 border-black">
                        <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <h4 className="text-lg font-black text-gray-900 uppercase tracking-wider mb-2">
                          NO QUESTIONS YET
                        </h4>
                        <p className="text-base font-bold text-gray-600 uppercase tracking-wide">
                          ADD YOUR FIRST QUESTION TO THIS SECTION
                        </p>
                      </div>
                    ) : (
                      getQuestionsForSection(section.id).map((question, index) => (
                        <div key={question.id} className="bg-white border-4 border-black p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-4 mb-3">
                                <span className="bg-blue-600 text-white border-2 border-black px-3 py-1 font-black uppercase tracking-wider text-sm">
                                  Q{index + 1}
                                </span>
                                <span className="bg-gray-200 border-2 border-black px-3 py-1 font-black uppercase tracking-wider text-sm">
                                  {question.questionCode}
                                </span>
                                <span className="bg-green-400 border-2 border-black px-3 py-1 font-black uppercase tracking-wider text-sm">
                                  {section.maxScore} MARKS
                                </span>
                              </div>
                              
                              <div className="space-y-3">
                                <div>
                                  <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-1">
                                    QUESTION
                                  </label>
                                  <textarea
                                    rows={3}
                                    value={question.questionText}
                                    onChange={(e) => updateQuestion(question.id, 'questionText', e.target.value)}
                                    className="neo-input w-full px-3 py-2 text-base font-bold"
                                    placeholder="ENTER QUESTION TEXT"
                                  />
                                </div>
                                
                                <div>
                                  <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-1">
                                    RUBRIC (GRADING CRITERIA)
                                  </label>
                                  <textarea
                                    rows={2}
                                    value={question.rubric}
                                    onChange={(e) => updateQuestion(question.id, 'rubric', e.target.value)}
                                    className="neo-input w-full px-3 py-2 text-base font-bold"
                                    placeholder="ENTER GRADING RUBRIC"
                                  />
                                </div>
                              </div>
                            </div>
                            
                            <button
                              type="button"
                              onClick={() => removeQuestion(question.id)}
                              className="ml-4 p-2 text-red-500 hover:text-red-700 border-2 border-red-500 hover:border-red-700 transition-colors"
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
              className="neo-button-secondary px-6 py-4 text-lg"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={loading || !examData.title.trim() || !examData.examCode.trim() || questions.length === 0}
              className="neo-button px-6 py-4 text-lg flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  <span>CREATING...</span>
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  <span>CREATE EXAM</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Add Question Modal */}
        {showAddQuestion && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-orange-500 text-white p-6 border-b-4 border-black">
                <h3 className="text-2xl font-black uppercase tracking-wider">ADD NEW QUESTION</h3>
                <p className="text-orange-100 font-bold uppercase tracking-wide">
                  {defaultSections.find(s => s.id === activeSection)?.title}
                </p>
              </div>
              
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-black text-gray-900 uppercase tracking-wider mb-2">
                    QUESTION CODE *
                  </label>
                  <input
                    type="text"
                    value={newQuestion.questionCode}
                    onChange={(e) => setNewQuestion(prev => ({ ...prev, questionCode: e.target.value.toUpperCase() }))}
                    className="neo-input w-full px-4 py-3 text-lg font-bold"
                    placeholder="E.G., Q1A, Q2B, Q3C"
                  />
                </div>

                <div>
                  <label className="block text-sm font-black text-gray-900 uppercase tracking-wider mb-2">
                    QUESTION TEXT *
                  </label>
                  <textarea
                    rows={4}
                    value={newQuestion.questionText}
                    onChange={(e) => setNewQuestion(prev => ({ ...prev, questionText: e.target.value }))}
                    className="neo-input w-full px-4 py-3 text-lg font-bold"
                    placeholder="ENTER THE QUESTION THAT STUDENTS WILL SEE"
                  />
                </div>

                <div>
                  <label className="block text-sm font-black text-gray-900 uppercase tracking-wider mb-2">
                    RUBRIC (GRADING CRITERIA) *
                  </label>
                  <textarea
                    rows={4}
                    value={newQuestion.rubric}
                    onChange={(e) => setNewQuestion(prev => ({ ...prev, rubric: e.target.value }))}
                    className="neo-input w-full px-4 py-3 text-lg font-bold"
                    placeholder="ENTER GRADING CRITERIA AND MODEL ANSWER"
                  />
                  <p className="text-sm font-bold text-gray-600 uppercase tracking-wide mt-2">
                    THIS WILL NOT BE VISIBLE TO STUDENTS
                  </p>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddQuestion(false);
                      setNewQuestion({ questionCode: '', questionText: '', rubric: '' });
                    }}
                    className="neo-button-secondary px-6 py-3"
                  >
                    CANCEL
                  </button>
                  <button
                    type="button"
                    onClick={addQuestion}
                    className="neo-button px-6 py-3 flex items-center space-x-2"
                  >
                    <Plus className="h-5 w-5" />
                    <span>ADD QUESTION</span>
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
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  Bot, 
  User, 
  CheckCircle, 
  Clock, 
  Zap,
  Image as ImageIcon,
  X,
  Download,
  Eye,
  Palette,
  Users,
  Target,
  Award,
  Sparkles,
  Plus,
  ChevronLeft,
  ChevronRight,
  Maximize2
} from 'lucide-react';
import Layout from '../components/Layout/Layout';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { mockExams, MockQuestion, MockAnswer, updateExamStats } from '../data/mockData';
import toast from 'react-hot-toast';

type DesignStyle = 'classic' | 'neo-brutalism';

interface SectionInfo {
  type: 'A' | 'B' | 'C';
  maxScore: number;
  label: string;
}

const QuestionGrading: React.FC = () => {
  const { questionId } = useParams<{ questionId: string }>();
  const navigate = useNavigate();
  const [question, setQuestion] = useState<MockQuestion | null>(null);
  const [answers, setAnswers] = useState<MockAnswer[]>([]);
  const [loading, setLoading] = useState(true);
  const [scores, setScores] = useState<{ [answerId: string]: { score: number; feedback: string } }>({});
  const [imageModal, setImageModal] = useState<{ isOpen: boolean; imageUrl: string; studentId: string }>({
    isOpen: false,
    imageUrl: '',
    studentId: ''
  });
  const [gradingModal, setGradingModal] = useState<{ isOpen: boolean; answerIndex: number }>({
    isOpen: false,
    answerIndex: 0
  });
  const [designStyle, setDesignStyle] = useState<DesignStyle>('classic');
  const [sectionInfo, setSectionInfo] = useState<SectionInfo>({ type: 'C', maxScore: 8, label: 'Section C' });

  useEffect(() => {
    fetchQuestionData();
  }, [questionId]);

  // Remove keyboard navigation - using buttons only

  const determineSectionInfo = (question: MockQuestion): SectionInfo => {
    // First, try to determine from maxScore
    if (question.maxScore <= 2) {
      return { type: 'A', maxScore: 2, label: 'Section A: Basic Concepts' };
    } else if (question.maxScore <= 5) {
      return { type: 'B', maxScore: 5, label: 'Section B: Intermediate Problems' };
    } else {
      return { type: 'C', maxScore: 8, label: 'Section C: Advanced Problems' };
    }
  };

  const fetchQuestionData = () => {
    setTimeout(() => {
      // Find the question across all exams
      let foundQuestion: MockQuestion | null = null;
      let foundAnswers: MockAnswer[] = [];
      let foundSection: any = null;

      for (const exam of mockExams) {
        for (const section of exam.sections) {
          const q = section.questions.find(q => q._id === questionId);
          if (q) {
            foundQuestion = q;
            foundAnswers = q.answers;
            foundSection = section;
            break;
          }
        }
        if (foundQuestion) break;
      }

      if (foundQuestion) {
        // Determine section info
        const secInfo = determineSectionInfo(foundQuestion);
        
        // Also check section title for more accuracy
        if (foundSection) {
          if (foundSection.title.toLowerCase().includes('section a') || foundSection.title.toLowerCase().includes('basic')) {
            secInfo.type = 'A';
            secInfo.maxScore = 2;
            secInfo.label = foundSection.title;
          } else if (foundSection.title.toLowerCase().includes('section b') || foundSection.title.toLowerCase().includes('intermediate')) {
            secInfo.type = 'B';
            secInfo.maxScore = 5;
            secInfo.label = foundSection.title;
          } else if (foundSection.title.toLowerCase().includes('section c') || foundSection.title.toLowerCase().includes('advanced')) {
            secInfo.type = 'C';
            secInfo.maxScore = 8;
            secInfo.label = foundSection.title;
          }
        }
        
        setSectionInfo(secInfo);
      }

      // Sort answers by student ID (roll number)
      foundAnswers.sort((a, b) => a.studentId.localeCompare(b.studentId));

      setQuestion(foundQuestion);
      setAnswers(foundAnswers);
      setLoading(false);

      // Initialize scores for ungraded answers
      const initialScores: { [answerId: string]: { score: number; feedback: string } } = {};
      foundAnswers.forEach(answer => {
        if (answer.score !== undefined) {
          initialScores[answer._id] = {
            score: answer.score,
            feedback: answer.feedback || ''
          };
        }
      });
      setScores(initialScores);
    }, 300);
  };

  const generateAIScore = (answer: MockAnswer) => {
    if (!question) return;

    const maxScore = sectionInfo.maxScore;
    
    // Generate AI score that respects the section-based maximum score
    // Use a more realistic distribution: 60-90% of max score for good answers
    const minScore = Math.max(1, Math.floor(maxScore * 0.4));
    const maxPossibleScore = maxScore;
    const baseScore = Math.floor(Math.random() * (maxPossibleScore - minScore + 1)) + minScore;
    
    const aiScore = Math.min(maxScore, Math.max(0, baseScore));
    
    const feedback = aiScore >= maxScore * 0.8 
      ? `Excellent work shown! Clear methodology and correct approach for ${sectionInfo.label}.`
      : aiScore >= maxScore * 0.6
      ? `Good understanding demonstrated, but some steps could be clearer for ${sectionInfo.label}.`
      : `Basic understanding shown but solution needs improvement for ${sectionInfo.label} standards.`;

    setScores(prev => ({
      ...prev,
      [answer._id]: { score: aiScore, feedback }
    }));

    toast.success(`SriChAI suggested score: ${aiScore}/${maxScore} for ${answer.studentId}`);
  };

  const batchAIScore = () => {
    if (!question) return;

    const ungradedAnswers = answers.filter(a => a.score === undefined);
    ungradedAnswers.forEach((answer, index) => {
      setTimeout(() => generateAIScore(answer), index * 500);
    });

    toast.success(`SriChAI scoring ${ungradedAnswers.length} answers...`);
  };

  const saveScore = (answerId: string) => {
    const scoreData = scores[answerId];
    if (!scoreData || scoreData.score < 0 || scoreData.score > sectionInfo.maxScore) {
      toast.error(`Please enter a valid score (0-${sectionInfo.maxScore} for ${sectionInfo.label})`);
      return;
    }

    // Update the answer in mock data
    const updatedAnswers = answers.map(answer => 
      answer._id === answerId 
        ? { 
            ...answer, 
            score: scoreData.score, 
            feedback: scoreData.feedback,
            scoreGivenBy: 'teacher' as const,
            gradedAt: new Date().toISOString()
          }
        : answer
    );

    setAnswers(updatedAnswers);

    // Update the global mock data
    for (const exam of mockExams) {
      for (const section of exam.sections) {
        const questionIndex = section.questions.findIndex(q => q._id === questionId);
        if (questionIndex > -1) {
          section.questions[questionIndex].answers = updatedAnswers;
          updateExamStats(exam._id);
          break;
        }
      }
    }

    toast.success(`Score saved for ${answers.find(a => a._id === answerId)?.studentId}`);
  };

  const saveAllScores = () => {
    let savedCount = 0;
    Object.keys(scores).forEach(answerId => {
      const answer = answers.find(a => a._id === answerId);
      if (answer && answer.score === undefined && scores[answerId]?.score !== undefined) {
        saveScore(answerId);
        savedCount++;
      }
    });

    if (savedCount > 0) {
      toast.success(`Saved ${savedCount} scores`);
    } else {
      toast('No new scores to save');
    }
  };

  const openImageModal = (imageUrl: string, studentId: string) => {
    setImageModal({ isOpen: true, imageUrl, studentId });
  };

  const closeImageModal = () => {
    setImageModal({ isOpen: false, imageUrl: '', studentId: '' });
  };

  const openGradingModal = (answerIndex: number) => {
    setGradingModal({ isOpen: true, answerIndex });
  };

  const closeGradingModal = () => {
    setGradingModal({ isOpen: false, answerIndex: 0 });
  };

  const navigateModalAnswer = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && gradingModal.answerIndex > 0) {
      setGradingModal(prev => ({ ...prev, answerIndex: prev.answerIndex - 1 }));
    } else if (direction === 'next' && gradingModal.answerIndex < answers.length - 1) {
      setGradingModal(prev => ({ ...prev, answerIndex: prev.answerIndex + 1 }));
    }
  };

  if (loading) {
    return (
      <Layout>
        <LoadingSpinner />
      </Layout>
    );
  }

  if (!question || answers.length === 0) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900">
            {!question ? 'Question not found' : 'No student answers available'}
          </h3>
          <p className="mt-1 text-gray-500">
            {!question 
              ? "The question you're looking for doesn't exist." 
              : 'No students have submitted answers for this question yet.'
            }
          </p>
        </div>
      </Layout>
    );
  }

  const gradedCount = answers.filter(a => a.score !== undefined).length;
  const avgScore = gradedCount > 0 
    ? answers.filter(a => a.score !== undefined).reduce((sum, a) => sum + (a.score || 0), 0) / gradedCount
    : 0;

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

  const aiButtonClass = isNeoBrutalism
    ? "neo-button bg-purple-600 hover:bg-purple-700"
    : "inline-flex items-center px-4 py-2 border border-purple-300 text-sm font-medium rounded-lg text-purple-700 bg-purple-50 hover:bg-purple-100 transition-colors";

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className={`${cardClass} p-6`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className={isNeoBrutalism ? "neo-button-icon" : "p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"}
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className={`text-2xl font-bold ${isNeoBrutalism ? 'font-black uppercase tracking-wider' : ''} text-gray-900`}>
                  Grade Question - All Students
                </h1>
                <p className={`mt-1 ${isNeoBrutalism ? 'font-bold uppercase tracking-wide text-sm' : ''} text-gray-600`}>
                  {answers.length} students • {gradedCount} graded • {sectionInfo.label}
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
              <button
                onClick={batchAIScore}
                className={aiButtonClass}
              >
                <Zap className="h-4 w-4 mr-2" />
                {isNeoBrutalism ? 'SRICHAI ALL' : 'Ask SriChAI (All)'}
              </button>
              <button
                onClick={saveAllScores}
                className={buttonPrimaryClass}
              >
                <Save className="h-4 w-4 mr-2" />
                {isNeoBrutalism ? 'SAVE ALL' : 'Save All'}
              </button>
            </div>
          </div>
        </div>

        {/* Question Section */}
        <div className={`${cardClass} p-6`}>
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-3">
                <h2 className={`text-lg font-semibold ${isNeoBrutalism ? 'font-black uppercase tracking-wider' : ''} text-gray-900`}>
                  Question
                </h2>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  sectionInfo.type === 'A' ? 'bg-green-100 text-green-800' :
                  sectionInfo.type === 'B' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  <Target className="h-3 w-3 mr-1" />
                  {sectionInfo.label}
                </span>
              </div>
              <p className={`text-gray-700 mb-4 text-base leading-relaxed ${isNeoBrutalism ? 'font-bold' : ''}`}>
                {question.promptText}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                <div className={`p-3 rounded-lg ${isNeoBrutalism ? 'neo-badge bg-blue-600 text-white' : 'bg-blue-50'}`}>
                  <span className={`font-medium ${isNeoBrutalism ? 'font-black uppercase tracking-wider' : 'text-blue-700'}`}>
                    Max Score:
                  </span>
                  <div className={`text-xl font-bold ${isNeoBrutalism ? 'font-black' : 'text-blue-900'}`}>
                    {sectionInfo.maxScore}
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${isNeoBrutalism ? 'neo-badge bg-green-600 text-white' : 'bg-green-50'}`}>
                  <span className={`font-medium ${isNeoBrutalism ? 'font-black uppercase tracking-wider' : 'text-green-700'}`}>
                    Total Answers:
                  </span>
                  <div className={`text-xl font-bold ${isNeoBrutalism ? 'font-black' : 'text-green-900'}`}>
                    {answers.length}
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${isNeoBrutalism ? 'neo-badge bg-purple-600 text-white' : 'bg-purple-50'}`}>
                  <span className={`font-medium ${isNeoBrutalism ? 'font-black uppercase tracking-wider' : 'text-purple-700'}`}>
                    Graded:
                  </span>
                  <div className={`text-xl font-bold ${isNeoBrutalism ? 'font-black' : 'text-purple-900'}`}>
                    {gradedCount}
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${isNeoBrutalism ? 'neo-badge bg-orange-600 text-white' : 'bg-orange-50'}`}>
                  <span className={`font-medium ${isNeoBrutalism ? 'font-black uppercase tracking-wider' : 'text-orange-700'}`}>
                    Average:
                  </span>
                  <div className={`text-xl font-bold ${isNeoBrutalism ? 'font-black' : 'text-orange-900'}`}>
                    {avgScore.toFixed(1)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Model Answer */}
          <div className={`p-4 rounded-lg border ${isNeoBrutalism ? 'neo-badge bg-blue-600 text-white border-black' : 'bg-blue-50 border-blue-200'}`}>
            <h3 className={`text-sm font-semibold mb-2 ${isNeoBrutalism ? 'font-black uppercase tracking-wider' : 'text-blue-900'}`}>
              Model Answer
            </h3>
            <p className={`text-sm leading-relaxed ${isNeoBrutalism ? 'font-bold' : 'text-blue-800'}`}>
              {question.modelAnswer}
            </p>
          </div>
        </div>

        {/* All Student Answers Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {answers.map((answer) => (
            <div key={answer._id} className={`${cardClass} overflow-hidden`}>
              {/* Student Header */}
              <div className={`p-4 border-b ${isNeoBrutalism ? 'bg-blue-600 text-white border-black' : 'border-gray-200 bg-gray-50'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full ${isNeoBrutalism ? 'bg-white text-blue-600 border-2 border-black' : 'bg-blue-100'}`}>
                      <User className={`h-5 w-5 ${isNeoBrutalism ? 'text-blue-600' : 'text-blue-600'}`} />
                    </div>
                    <div>
                      <h3 className={`font-semibold ${isNeoBrutalism ? 'font-black uppercase tracking-wider' : 'text-gray-900'}`}>
                        {answer.studentId}
                      </h3>
                      <p className={`text-sm ${isNeoBrutalism ? 'font-bold uppercase tracking-wide' : 'text-gray-500'}`}>
                        {new Date(answer.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {answer.score !== undefined ? (
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          isNeoBrutalism 
                            ? 'neo-badge bg-white text-blue-600 border-2 border-black' 
                            : answer.scoreGivenBy === 'ai' 
                              ? 'bg-purple-100 text-purple-800' 
                              : 'bg-green-100 text-green-800'
                        }`}>
                          {answer.scoreGivenBy === 'ai' ? (
                            <>
                              <Bot className="h-3 w-3 mr-1" />
                              {isNeoBrutalism ? 'AI' : 'AI Scored'}
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-3 w-3 mr-1" />
                              {isNeoBrutalism ? 'DONE' : 'Graded'}
                            </>
                          )}
                        </span>
                        <span className={`text-lg font-bold ${isNeoBrutalism ? 'font-black' : 'text-gray-900'}`}>
                          {answer.score}/{sectionInfo.maxScore}
                        </span>
                      </div>
                    ) : (
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        isNeoBrutalism 
                          ? 'neo-badge bg-yellow-600 text-white border-2 border-black' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        <Clock className="h-3 w-3 mr-1" />
                        {isNeoBrutalism ? 'PENDING' : 'Pending'}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Answer Image */}
              <div className="p-4">
                <div className="mb-4">
                  <h4 className={`text-sm font-medium mb-3 ${isNeoBrutalism ? 'font-black uppercase tracking-wider' : 'text-gray-700'}`}>
                    Student Answer:
                  </h4>
                  <div className="relative group">
                    {answer.answerImage ? (
                      <div className="relative">
                        <img
                          src={answer.answerImage}
                          alt={`Answer by ${answer.studentId}`}
                          className={`w-full h-48 object-cover rounded-lg ${isNeoBrutalism ? 'border-4 border-black' : 'border border-gray-200 shadow-sm'}`}
                        />
                        <div 
                          className={`absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-10 rounded-lg cursor-pointer`}
                          onClick={() => openGradingModal(answers.indexOf(answer))}
                        >
                          <div className={`rounded-full p-2 shadow-lg ${isNeoBrutalism ? 'bg-yellow-400 border-2 border-black' : 'bg-white'}`}>
                            <Plus className={`h-5 w-5 ${isNeoBrutalism ? 'text-black' : 'text-gray-600'}`} />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className={`w-full h-48 bg-gray-100 rounded-lg border-2 border-dashed flex items-center justify-center ${isNeoBrutalism ? 'border-black' : 'border-gray-300'}`}>
                        <div className="text-center">
                          <ImageIcon className={`mx-auto h-8 w-8 ${isNeoBrutalism ? 'text-black' : 'text-gray-400'}`} />
                          <p className={`mt-2 text-sm ${isNeoBrutalism ? 'font-bold text-black' : 'text-gray-500'}`}>
                            No image submitted
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Grading Section */}
                <div className={`border-t pt-4 ${isNeoBrutalism ? 'border-black' : 'border-gray-200'}`}>
                  <div className="space-y-3">
                    <div>
                      <label className={`block text-xs font-medium mb-1 ${isNeoBrutalism ? 'font-black uppercase tracking-wider' : 'text-gray-700'}`}>
                        Score (0-{sectionInfo.maxScore})
                      </label>
                      <input
                        type="number"
                        min="0"
                        max={sectionInfo.maxScore}
                        value={scores[answer._id]?.score || ''}
                        onChange={(e) => setScores(prev => ({
                          ...prev,
                          [answer._id]: {
                            ...prev[answer._id],
                            score: parseInt(e.target.value) || 0
                          }
                        }))}
                        className={`w-full px-3 py-2 text-sm ${
                          isNeoBrutalism 
                            ? 'neo-input font-bold' 
                            : 'border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                        }`}
                        placeholder={isNeoBrutalism ? 'ENTER SCORE' : 'Enter score'}
                      />
                    </div>
                    
                    <div>
                      <label className={`block text-xs font-medium mb-1 ${isNeoBrutalism ? 'font-black uppercase tracking-wider' : 'text-gray-700'}`}>
                        Feedback (Optional)
                      </label>
                      <textarea
                        rows={2}
                        value={scores[answer._id]?.feedback || ''}
                        onChange={(e) => setScores(prev => ({
                          ...prev,
                          [answer._id]: {
                            ...prev[answer._id],
                            feedback: e.target.value
                          }
                        }))}
                        className={`w-full px-3 py-2 text-sm ${
                          isNeoBrutalism 
                            ? 'neo-input font-bold' 
                            : 'border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                        }`}
                        placeholder={isNeoBrutalism ? 'PROVIDE FEEDBACK...' : 'Provide feedback...'}
                      />
                    </div>

                                         <div className="flex items-center justify-between space-x-2">
                       <button
                         onClick={() => generateAIScore(answer)}
                         className={`flex-1 px-3 py-2 text-xs ${aiButtonClass}`}
                       >
                         <Bot className="h-3 w-3 mr-1" />
                         {isNeoBrutalism ? 'AI' : 'AI Grade'}
                       </button>
                       
                       <button
                         onClick={() => saveScore(answer._id)}
                         disabled={!scores[answer._id]?.score && scores[answer._id]?.score !== 0}
                         className={`flex-1 px-3 py-2 text-xs ${buttonPrimaryClass} disabled:opacity-50 disabled:cursor-not-allowed`}
                       >
                         <Save className="h-3 w-3 mr-1" />
                         {isNeoBrutalism ? 'SAVE' : 'Save'}
                       </button>
                     </div>
                  </div>

                  {/* Existing Feedback */}
                  {answer.feedback && (
                    <div className={`mt-3 p-3 rounded-lg ${isNeoBrutalism ? 'neo-badge bg-green-600 text-white border-2 border-black' : 'bg-blue-50 border border-blue-200'}`}>
                      <h5 className={`text-xs font-medium mb-1 ${isNeoBrutalism ? 'font-black uppercase tracking-wider' : 'text-blue-900'}`}>
                        Previous Feedback:
                      </h5>
                      <p className={`text-xs leading-relaxed ${isNeoBrutalism ? 'font-bold' : 'text-blue-800'}`}>
                        {answer.feedback}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Progress Summary */}
        <div className={`${cardClass} p-6`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-lg font-semibold ${isNeoBrutalism ? 'font-black uppercase tracking-wider' : ''} text-gray-900`}>
              Grading Progress
            </h3>
            <span className={`text-2xl font-bold ${isNeoBrutalism ? 'font-black' : ''} text-gray-900`}>
              {Math.round((gradedCount / answers.length) * 100)}%
            </span>
          </div>
          
          <div className={`flex items-center justify-between text-sm mb-3 ${isNeoBrutalism ? 'font-bold uppercase tracking-wide' : 'text-gray-600'}`}>
            <span>{gradedCount}/{answers.length} completed</span>
            <span>{answers.length - gradedCount} remaining</span>
          </div>
          
          <div className={`w-full h-3 rounded-full ${isNeoBrutalism ? 'bg-gray-800 border-2 border-black' : 'bg-gray-200'}`}>
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                isNeoBrutalism 
                  ? 'bg-gradient-to-r from-yellow-400 to-green-400' 
                  : 'bg-gradient-to-r from-blue-500 to-blue-600'
              }`}
              style={{ width: `${(gradedCount / answers.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>



      {/* Detailed Grading Modal */}
      {gradingModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75">
          <div className={`relative w-full max-w-6xl max-h-full overflow-hidden ${isNeoBrutalism ? 'neo-card' : 'bg-white rounded-lg'}`}>
            {/* Modal Header */}
            <div className={`flex items-center justify-between p-6 border-b ${isNeoBrutalism ? 'bg-blue-600 text-white border-black' : 'border-gray-200'}`}>
              <div className="flex items-center space-x-4">
                <h3 className={`text-xl font-semibold ${isNeoBrutalism ? 'font-black uppercase tracking-wider' : 'text-gray-900'}`}>
                  Detailed Grading: {answers[gradingModal.answerIndex]?.studentId}
                </h3>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  sectionInfo.type === 'A' ? 'bg-green-100 text-green-800' :
                  sectionInfo.type === 'B' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  <Target className="h-3 w-3 mr-1" />
                  {sectionInfo.label}
                </span>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Navigation Buttons */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => navigateModalAnswer('prev')}
                    disabled={gradingModal.answerIndex === 0}
                    className={`px-3 py-1 rounded ${
                      isNeoBrutalism 
                        ? 'neo-button-secondary disabled:opacity-50 text-sm' 
                        : 'bg-gray-100 border border-gray-300 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm'
                    }`}
                  >
                    Previous
                  </button>
                  
                  <button
                    onClick={() => navigateModalAnswer('next')}
                    disabled={gradingModal.answerIndex === answers.length - 1}
                    className={`px-3 py-1 rounded ${
                      isNeoBrutalism 
                        ? 'neo-button-secondary disabled:opacity-50 text-sm' 
                        : 'bg-gray-100 border border-gray-300 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm'
                    }`}
                  >
                    Next
                  </button>
                </div>
                
                <span className={`text-sm ${isNeoBrutalism ? 'font-bold uppercase tracking-wide' : 'text-gray-500'}`}>
                  {gradingModal.answerIndex + 1} of {answers.length}
                </span>
                <button
                  onClick={closeGradingModal}
                  className={isNeoBrutalism ? "neo-button-icon" : "p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Three Column Layout */}
            <div className="flex max-h-[85vh]">
              {/* Left Column - Question & Rubric */}
              <div className={`w-1/3 p-6 border-r ${isNeoBrutalism ? 'border-black bg-gray-50' : 'border-gray-200 bg-gray-50'} overflow-y-auto`}>
                {/* Question */}
                <div className="mb-6">
                  <h4 className={`text-lg font-semibold mb-3 ${isNeoBrutalism ? 'font-black uppercase tracking-wider' : 'text-gray-900'}`}>
                    Question 1
                  </h4>
                  <p className={`text-sm leading-relaxed mb-4 ${isNeoBrutalism ? 'font-bold' : 'text-gray-700'}`}>
                    {question.promptText}
                  </p>
                </div>

                {/* Rubric */}
                <div>
                  <h4 className={`text-lg font-semibold mb-3 ${isNeoBrutalism ? 'font-black uppercase tracking-wider' : 'text-gray-900'}`}>
                    Rubric
                  </h4>
                  <div className={`p-4 rounded-lg ${isNeoBrutalism ? 'neo-badge bg-blue-600 text-white border-2 border-black' : 'bg-white border border-gray-200'}`}>
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className={`font-semibold ${isNeoBrutalism ? 'font-black uppercase tracking-wider' : ''}`}>
                          dasd
                        </span>
                        <br />
                        <span className={isNeoBrutalism ? 'font-bold' : 'text-gray-600'}>
                          as
                        </span>
                      </div>
                      <div>
                        <span className={`font-semibold ${isNeoBrutalism ? 'font-black uppercase tracking-wider' : ''}`}>
                          asdasdos
                        </span>
                        <br />
                        <span className={isNeoBrutalism ? 'font-bold' : 'text-gray-600'}>
                          dasdas
                        </span>
                      </div>
                      <div>
                        <span className={`font-semibold ${isNeoBrutalism ? 'font-black uppercase tracking-wider' : ''}`}>
                          das → 1 mark
                        </span>
                        <br />
                        <span className={isNeoBrutalism ? 'font-bold' : 'text-gray-600'}>
                          dasdasdasdasdas
                        </span>
                      </div>
                      <div>
                        <span className={`font-semibold ${isNeoBrutalism ? 'font-black uppercase tracking-wider' : ''}`}>
                          dsfgdsfgsfg
                        </span>
                        <br />
                        <span className={isNeoBrutalism ? 'font-bold' : 'text-gray-600'}>
                          sdfsdfsdfs
                        </span>
                      </div>
                      <div>
                        <span className={`font-semibold ${isNeoBrutalism ? 'font-black uppercase tracking-wider' : ''}`}>
                          fdsfdssdf→ 2 marks
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Center Column - Student Answer */}
              <div className="w-1/3 p-6 flex flex-col">
                {/* Student Info */}
                <div className="flex items-center justify-center mb-4">
                  <h4 className={`text-lg font-semibold ${isNeoBrutalism ? 'font-black uppercase tracking-wider' : 'text-gray-900'}`}>
                    Student {answers[gradingModal.answerIndex]?.studentId.replace(/[A-Z]+/, '')}
                  </h4>
                </div>

                {/* Student Answer Image */}
                <div className="flex-1 flex items-center justify-center">
                  {answers[gradingModal.answerIndex]?.answerImage ? (
                    <div className="relative w-full">
                      <img
                        src={answers[gradingModal.answerIndex].answerImage}
                        alt={`Answer by ${answers[gradingModal.answerIndex].studentId}`}
                        className={`w-full max-h-[60vh] object-contain rounded-lg cursor-pointer hover:opacity-95 transition-opacity ${isNeoBrutalism ? 'border-4 border-black' : 'border border-gray-200 shadow-sm'}`}
                        onClick={() => openImageModal(answers[gradingModal.answerIndex].answerImage!, answers[gradingModal.answerIndex].studentId)}
                      />
                      <div className={`absolute top-3 right-3 bg-white rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity ${isNeoBrutalism ? 'border-2 border-black' : ''}`}>
                        <Maximize2 className="h-5 w-5 text-gray-600" />
                      </div>
                    </div>
                  ) : (
                    <div className={`w-full h-64 bg-gray-100 rounded-lg border-2 border-dashed flex items-center justify-center ${isNeoBrutalism ? 'border-black' : 'border-gray-300'}`}>
                      <div className="text-center">
                        <ImageIcon className={`mx-auto h-12 w-12 ${isNeoBrutalism ? 'text-black' : 'text-gray-400'}`} />
                        <p className={`mt-3 text-lg ${isNeoBrutalism ? 'font-bold text-black' : 'text-gray-500'}`}>
                          No image submitted
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column - Grading Controls */}
              <div className={`w-1/3 p-6 border-l ${isNeoBrutalism ? 'border-black bg-gray-50' : 'border-gray-200 bg-gray-50'} flex flex-col`}>
                <div className="flex-1 space-y-4">
                  {/* Score Box */}
                  <div className={`p-4 rounded-lg border-2 h-32 ${isNeoBrutalism ? 'border-black bg-white' : 'border-gray-300 bg-white'}`}>
                    <label className={`block text-sm font-medium mb-2 ${isNeoBrutalism ? 'font-black uppercase tracking-wider' : 'text-gray-700'}`}>
                      Score (0-{sectionInfo.maxScore})
                    </label>
                    <input
                      type="number"
                      min="0"
                      max={sectionInfo.maxScore}
                      value={scores[answers[gradingModal.answerIndex]?._id]?.score || ''}
                      onChange={(e) => setScores(prev => ({
                        ...prev,
                        [answers[gradingModal.answerIndex]._id]: {
                          ...prev[answers[gradingModal.answerIndex]._id],
                          score: parseInt(e.target.value) || 0
                        }
                      }))}
                      className={`w-full px-3 py-2 text-lg ${
                        isNeoBrutalism 
                          ? 'neo-input font-bold' 
                          : 'border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                      }`}
                      placeholder={isNeoBrutalism ? 'ENTER SCORE' : 'Enter score'}
                    />
                  </div>

                  {/* Feedback Box */}
                  <div className={`p-4 rounded-lg border-2 h-48 ${isNeoBrutalism ? 'border-black bg-white' : 'border-gray-300 bg-white'} flex flex-col`}>
                    <label className={`block text-sm font-medium mb-2 ${isNeoBrutalism ? 'font-black uppercase tracking-wider' : 'text-gray-700'}`}>
                      Feedback
                    </label>
                    <textarea
                      value={scores[answers[gradingModal.answerIndex]?._id]?.feedback || ''}
                      onChange={(e) => setScores(prev => ({
                        ...prev,
                        [answers[gradingModal.answerIndex]._id]: {
                          ...prev[answers[gradingModal.answerIndex]._id],
                          feedback: e.target.value
                        }
                      }))}
                      className={`flex-1 w-full px-3 py-2 text-sm resize-none ${
                        isNeoBrutalism 
                          ? 'neo-input font-bold' 
                          : 'border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                      }`}
                      placeholder={isNeoBrutalism ? 'PROVIDE FEEDBACK...' : 'Provide feedback...'}
                    />
                  </div>
                </div>

                {/* Ask SriChAI Button */}
                <div className="mt-6">
                  <button
                    onClick={() => generateAIScore(answers[gradingModal.answerIndex])}
                    className={`w-full px-6 py-4 text-lg ${aiButtonClass}`}
                  >
                    Ask SriChAI
                  </button>
                </div>

                {/* Save Button */}
                <div className="mt-3">
                  <button
                    onClick={() => saveScore(answers[gradingModal.answerIndex]._id)}
                    disabled={!scores[answers[gradingModal.answerIndex]?._id]?.score && scores[answers[gradingModal.answerIndex]?._id]?.score !== 0}
                    className={`w-full px-6 py-3 ${buttonPrimaryClass} disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isNeoBrutalism ? 'SAVE SCORE' : 'Save Score'}
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Navigation Footer */}
            <div className={`p-4 border-t ${isNeoBrutalism ? 'bg-gray-800 text-white border-black' : 'border-gray-200 bg-gray-50'}`}>
              <div className="flex items-center justify-between">
                                 <div className={`text-sm ${isNeoBrutalism ? 'font-bold uppercase tracking-wide' : 'text-gray-600'}`}>
                   Click dots below to jump to any student
                 </div>
                <div className="flex space-x-2">
                  {answers.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setGradingModal(prev => ({ ...prev, answerIndex: index }))}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === gradingModal.answerIndex 
                          ? isNeoBrutalism ? 'bg-yellow-400' : 'bg-blue-600'
                          : isNeoBrutalism ? 'bg-gray-600' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Click outside grading modal to close */}
      {gradingModal.isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={closeGradingModal}
        ></div>
      )}

      {/* Image Modal - Rendered after grading modal to appear on top */}
      {imageModal.isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2 bg-black bg-opacity-90">
          <div className={`relative w-[95vw] h-[95vh] overflow-hidden ${isNeoBrutalism ? 'neo-card' : 'bg-white rounded-lg'}`}>
            <div className={`flex items-center justify-between p-4 border-b ${isNeoBrutalism ? 'bg-blue-600 text-white border-black' : 'border-gray-200'}`}>
              <h3 className={`text-xl font-semibold ${isNeoBrutalism ? 'font-black uppercase tracking-wider' : 'text-gray-900'}`}>
                Answer by {imageModal.studentId}
              </h3>
              <button
                onClick={closeImageModal}
                className={isNeoBrutalism ? "neo-button-icon" : "p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"}
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6 h-full flex items-center justify-center">
              <img
                src={imageModal.imageUrl}
                alt={`Answer by ${imageModal.studentId}`}
                className="max-w-full max-h-[80vh] object-contain mx-auto"
              />
            </div>
            <div className={`absolute bottom-0 left-0 right-0 p-4 border-t ${isNeoBrutalism ? 'bg-gray-800 text-white border-black' : 'border-gray-200 bg-gray-50'}`}>
              <p className={`text-sm text-center ${isNeoBrutalism ? 'font-bold uppercase tracking-wide' : 'text-gray-600'}`}>
                Click outside the image or press the X button to close
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Click outside image modal to close */}
      {imageModal.isOpen && (
        <div 
          className="fixed inset-0 z-[9998]" 
          onClick={closeImageModal}
        ></div>
      )}
    </Layout>
  );
};

export default QuestionGrading;
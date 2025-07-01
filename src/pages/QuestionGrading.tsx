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
  ZoomIn,
  X,
  Download,
  Eye
} from 'lucide-react';
import Layout from '../components/Layout/Layout';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { mockExams, MockQuestion, MockAnswer, updateExamStats } from '../data/mockData';
import toast from 'react-hot-toast';

const QuestionGrading: React.FC = () => {
  const { questionId } = useParams<{ questionId: string }>();
  const navigate = useNavigate();
  const [question, setQuestion] = useState<MockQuestion | null>(null);
  const [answers, setAnswers] = useState<MockAnswer[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentAnswerIndex, setCurrentAnswerIndex] = useState(0);
  const [scores, setScores] = useState<{ [answerId: string]: { score: number; feedback: string } }>({});
  const [imageModal, setImageModal] = useState<{ isOpen: boolean; imageUrl: string; studentId: string }>({
    isOpen: false,
    imageUrl: '',
    studentId: ''
  });

  useEffect(() => {
    fetchQuestionData();
  }, [questionId]);

  const fetchQuestionData = () => {
    setTimeout(() => {
      // Find the question across all exams
      let foundQuestion: MockQuestion | null = null;
      let foundAnswers: MockAnswer[] = [];

      for (const exam of mockExams) {
        for (const section of exam.sections) {
          const q = section.questions.find(q => q._id === questionId);
          if (q) {
            foundQuestion = q;
            foundAnswers = q.answers;
            break;
          }
        }
        if (foundQuestion) break;
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

    const maxScore = question.maxScore;
    
    // Generate AI score that respects the maximum score for the section
    // Use a more realistic distribution: 60-90% of max score for good answers
    const minScore = Math.max(1, Math.floor(maxScore * 0.3));
    const maxPossibleScore = maxScore;
    const baseScore = Math.floor(Math.random() * (maxPossibleScore - minScore + 1)) + minScore;
    
    const aiScore = Math.min(maxScore, Math.max(0, baseScore));
    
    const feedback = aiScore >= maxScore * 0.8 
      ? "Excellent work shown in the image with clear explanations and correct methodology."
      : aiScore >= maxScore * 0.6
      ? "Good understanding demonstrated, but some steps could be clearer or more detailed."
      : "Basic understanding shown but the solution lacks clarity or has some errors.";

    setScores(prev => ({
      ...prev,
      [answer._id]: { score: aiScore, feedback }
    }));

    toast.success(`SriChAI suggested score: ${aiScore}/${maxScore}`);
  };

  const batchAIScore = () => {
    if (!question) return;

    const ungradedAnswers = answers.filter(a => a.score === undefined);
    ungradedAnswers.forEach(answer => {
      setTimeout(() => generateAIScore(answer), Math.random() * 1000);
    });

    toast.success(`SriChAI scoring ${ungradedAnswers.length} answers...`);
  };

  const saveScore = (answerId: string) => {
    const scoreData = scores[answerId];
    if (!scoreData || scoreData.score < 0 || scoreData.score > (question?.maxScore || 0)) {
      toast.error('Please enter a valid score');
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

    toast.success('Score saved successfully');
  };

  const saveAllScores = () => {
    let savedCount = 0;
    Object.keys(scores).forEach(answerId => {
      const answer = answers.find(a => a._id === answerId);
      if (answer && answer.score === undefined) {
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

  const navigateAnswer = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && currentAnswerIndex > 0) {
      setCurrentAnswerIndex(currentAnswerIndex - 1);
    } else if (direction === 'next' && currentAnswerIndex < answers.length - 1) {
      setCurrentAnswerIndex(currentAnswerIndex + 1);
    }
  };

  const openImageModal = (imageUrl: string, studentId: string) => {
    setImageModal({ isOpen: true, imageUrl, studentId });
  };

  const closeImageModal = () => {
    setImageModal({ isOpen: false, imageUrl: '', studentId: '' });
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

  const currentAnswer = answers[currentAnswerIndex];
  const gradedCount = answers.filter(a => a.score !== undefined).length;
  const avgScore = gradedCount > 0 
    ? answers.filter(a => a.score !== undefined).reduce((sum, a) => sum + (a.score || 0), 0) / gradedCount
    : 0;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Grade Question</h1>
              <p className="mt-1 text-gray-600">
                Answer {currentAnswerIndex + 1} of {answers.length} • {gradedCount} graded
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={batchAIScore}
              className="inline-flex items-center px-3 py-2 border border-purple-300 shadow-sm text-sm font-medium rounded-lg text-purple-700 bg-purple-50 hover:bg-purple-100 transition-colors"
            >
              <Zap className="h-4 w-4 mr-2" />
              Ask SriChAI (All)
            </button>
            <button
              onClick={saveAllScores}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              <Save className="h-4 w-4 mr-2" />
              Save All
            </button>
          </div>
        </div>

        {/* Question Section */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Question</h2>
              <p className="text-gray-700 mb-4 text-base leading-relaxed">{question.promptText}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <span className="font-medium text-blue-700">Max Score:</span>
                  <div className="text-xl font-bold text-blue-900">{question.maxScore}</div>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <span className="font-medium text-green-700">Total Answers:</span>
                  <div className="text-xl font-bold text-green-900">{answers.length}</div>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <span className="font-medium text-purple-700">Graded:</span>
                  <div className="text-xl font-bold text-purple-900">{gradedCount}</div>
                </div>
                <div className="bg-orange-50 p-3 rounded-lg">
                  <span className="font-medium text-orange-700">Average:</span>
                  <div className="text-xl font-bold text-orange-900">{avgScore.toFixed(1)}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Model Answer */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">Model Answer</h3>
            <p className="text-blue-800 text-sm leading-relaxed">{question.modelAnswer}</p>
          </div>
        </div>

        {/* Answer Navigation */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
          {/* Navigation Header */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{currentAnswer.studentId}</h3>
                    <p className="text-sm text-gray-500">
                      Submitted {new Date(currentAnswer.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {currentAnswer.score !== undefined ? (
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        currentAnswer.scoreGivenBy === 'ai' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {currentAnswer.scoreGivenBy === 'ai' ? (
                          <>
                            <Bot className="h-4 w-4 mr-1" />
                            AI Scored
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Graded
                          </>
                        )}
                      </span>
                      <span className="text-2xl font-bold text-gray-900">
                        {currentAnswer.score}/{question.maxScore}
                      </span>
                    </div>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                      <Clock className="h-4 w-4 mr-1" />
                      Pending
                    </span>
                  )}
                </div>
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500 mr-4">
                  {currentAnswerIndex + 1} of {answers.length}
                </span>
                <button
                  onClick={() => navigateAnswer('prev')}
                  disabled={currentAnswerIndex === 0}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <button
                  onClick={() => navigateAnswer('next')}
                  disabled={currentAnswerIndex === answers.length - 1}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          </div>

          {/* Answer Content */}
          <div className="p-6">
            {/* Student Answer Image */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Student Answer:</h4>
              <div className="relative group">
                {currentAnswer.answerImage ? (
                  <div className="relative">
                    <img
                      src={currentAnswer.answerImage}
                      alt={`Answer by ${currentAnswer.studentId}`}
                      className="w-full max-w-4xl h-auto rounded-lg border border-gray-200 cursor-pointer hover:opacity-95 transition-opacity shadow-sm"
                      onClick={() => openImageModal(currentAnswer.answerImage!, currentAnswer.studentId)}
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-10 rounded-lg">
                      <div className="bg-white rounded-full p-3 shadow-lg">
                        <ZoomIn className="h-6 w-6 text-gray-600" />
                      </div>
                    </div>
                    <div className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                      <ImageIcon className="h-5 w-5 text-gray-600" />
                    </div>
                  </div>
                ) : (
                  <div className="w-full max-w-4xl h-64 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                    <div className="text-center">
                      <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-3 text-lg text-gray-500">No image submitted</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Grading Section */}
            <div className="border-t border-gray-200 pt-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Grade This Answer</h4>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Score (0-{question.maxScore})
                  </label>
                  <input
                    type="number"
                    min="0"
                    max={question.maxScore}
                    value={scores[currentAnswer._id]?.score || ''}
                    onChange={(e) => setScores(prev => ({
                      ...prev,
                      [currentAnswer._id]: {
                        ...prev[currentAnswer._id],
                        score: parseInt(e.target.value) || 0
                      }
                    }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                    placeholder="Enter score"
                  />
                </div>
                
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Feedback (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={scores[currentAnswer._id]?.feedback || ''}
                    onChange={(e) => setScores(prev => ({
                      ...prev,
                      [currentAnswer._id]: {
                        ...prev[currentAnswer._id],
                        feedback: e.target.value
                      }
                    }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Provide feedback to the student..."
                  />
                </div>
              </div>

              <div className="flex items-center justify-between mt-6">
                <button
                  onClick={() => generateAIScore(currentAnswer)}
                  className="inline-flex items-center px-4 py-2 border border-purple-300 text-sm font-medium rounded-lg text-purple-700 bg-purple-50 hover:bg-purple-100 transition-colors"
                >
                  <Bot className="h-4 w-4 mr-2" />
                  Ask SriChAI
                </button>
                
                <button
                  onClick={() => saveScore(currentAnswer._id)}
                  disabled={!scores[currentAnswer._id]?.score && scores[currentAnswer._id]?.score !== 0}
                  className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Score
                </button>
              </div>
            </div>

            {/* Existing Feedback */}
            {currentAnswer.feedback && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h5 className="text-sm font-medium text-blue-900 mb-2">Previous Feedback:</h5>
                <p className="text-blue-800 text-sm leading-relaxed">{currentAnswer.feedback}</p>
              </div>
            )}
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Grading Progress</span>
            <span>{gradedCount}/{answers.length} completed ({Math.round((gradedCount / answers.length) * 100)}%)</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(gradedCount / answers.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {imageModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75">
          <div className="relative max-w-7xl max-h-full bg-white rounded-lg overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Answer by {imageModal.studentId}
              </h3>
              <button
                onClick={closeImageModal}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4">
              <img
                src={imageModal.imageUrl}
                alt={`Answer by ${imageModal.studentId}`}
                className="max-w-full max-h-[85vh] object-contain mx-auto"
              />
            </div>
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <p className="text-sm text-gray-600 text-center">
                Click outside the image or press the X button to close
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Click outside modal to close */}
      {imageModal.isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={closeImageModal}
        ></div>
      )}
    </Layout>
  );
};

export default QuestionGrading;
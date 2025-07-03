import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Upload, 
  Camera, 
  CheckCircle, 
  Clock, 
  FileImage, 
  X, 
  Save,
  ArrowLeft,
  ArrowRight,
  Eye,
  Download,
  Target
} from 'lucide-react';
import Layout from '../components/Layout/Layout';
import { mockExams } from '../data/mockData';

interface StudentAnswer {
  questionId: string;
  imageFile: File | null;
  imageUrl: string | null;
  submittedAt: Date | null;
}

const StudentExamView: React.FC = () => {
  const { examId } = useParams<{ examId: string }>();
  const [exam, setExam] = useState(mockExams.find(e => e._id === examId));
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<StudentAnswer[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (exam) {
      // Initialize answers array
      const initialAnswers: StudentAnswer[] = [];
              exam.sections.forEach(section => {
          section.questions.forEach(question => {
            initialAnswers.push({
              questionId: question._id,
              imageFile: null,
              imageUrl: null,
              submittedAt: null
            });
          });
        });
      setAnswers(initialAnswers);
    }
  }, [exam]);

  if (!exam) {
    return (
      <Layout>
        <div className="text-center py-16">
          <h1 className="text-3xl font-black text-gray-900 uppercase tracking-wider mb-4">Exam Not Found</h1>
          <Link to="/exams" className="neo-button py-3 px-6">
            Back to Exams
          </Link>
        </div>
      </Layout>
    );
  }

  const allQuestions = exam.sections.flatMap(section => section.questions);
  const currentQuestion = allQuestions[currentQuestionIndex];
  const currentAnswer = answers.find(a => a.questionId === currentQuestion?._id);
  const totalQuestions = allQuestions.length;
  const answeredQuestions = answers.filter(a => a.imageFile || a.imageUrl).length;

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && currentQuestion) {
      const imageUrl = URL.createObjectURL(file);
      
      setAnswers(prev => prev.map(answer => 
        answer.questionId === currentQuestion._id
          ? { ...answer, imageFile: file, imageUrl, submittedAt: new Date() }
          : answer
      ));
    }
  };

  const handleRemoveImage = () => {
    if (currentQuestion) {
      setAnswers(prev => prev.map(answer => 
        answer.questionId === currentQuestion._id
          ? { ...answer, imageFile: null, imageUrl: null, submittedAt: null }
          : answer
      ));
    }
  };

  const handlePreviewImage = (imageUrl: string) => {
    setPreviewImage(imageUrl);
    setShowImagePreview(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSaveProgress = async () => {
    setIsSubmitting(true);
    // Mock save - in real app would send to API
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    alert('Progress saved successfully!');
  };

  const progressPercentage = Math.round((answeredQuestions / totalQuestions) * 100);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Exam Header */}
        <div className="neo-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-black text-gray-900 uppercase tracking-wider">{exam.title}</h1>
              <p className="text-lg font-bold text-gray-600 uppercase tracking-wide mt-2">{exam.subject}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-gray-600 uppercase tracking-wide">Progress</p>
              <p className="text-2xl font-black text-blue-600 uppercase tracking-wider">
                {answeredQuestions}/{totalQuestions}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-gray-900 uppercase tracking-wider">Overall Progress</span>
              <span className="text-lg font-black text-gray-900 uppercase tracking-wider">{progressPercentage}%</span>
            </div>
            <div className="neo-progress-bar w-full h-4">
              <div 
                className="neo-progress-fill h-4 transition-all duration-300" 
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className="neo-button py-2 px-4 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Previous</span>
            </button>

            <div className="flex items-center space-x-4">
              <span className="text-lg font-black text-gray-900 uppercase tracking-wider">
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </span>
              <button
                onClick={handleSaveProgress}
                disabled={isSubmitting}
                className="neo-button bg-green-600 hover:bg-green-700 py-2 px-4 flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>{isSubmitting ? 'Saving...' : 'Save Progress'}</span>
              </button>
            </div>

            <button
              onClick={handleNextQuestion}
              disabled={currentQuestionIndex === totalQuestions - 1}
              className="neo-button py-2 px-4 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>Next</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Question Content */}
        {currentQuestion && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Question Panel */}
            <div className="neo-card">
              <div className="bg-blue-600 text-white p-4 border-b-4 border-black">
                <h2 className="text-xl font-black uppercase tracking-wider">
                  Question {currentQuestion.questionCode}
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-black text-gray-900 uppercase tracking-wider mb-3">Question:</h3>
                    <p className="text-base font-bold text-gray-800 leading-relaxed">
                      {currentQuestion.promptText}
                    </p>
                  </div>

                  {currentQuestion.promptImage && (
                    <div>
                      <h4 className="text-sm font-black text-gray-900 uppercase tracking-wider mb-2">Reference Image:</h4>
                      <div className="neo-card p-4">
                        <img 
                          src={currentQuestion.promptImage} 
                          alt="Question reference"
                          className="w-full h-auto rounded cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={() => handlePreviewImage(currentQuestion.promptImage!)}
                        />
                        <button
                          onClick={() => handlePreviewImage(currentQuestion.promptImage!)}
                          className="mt-2 text-sm font-bold text-blue-600 hover:text-blue-800 uppercase tracking-wider flex items-center space-x-1"
                        >
                          <Eye className="h-4 w-4" />
                          <span>View Full Size</span>
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="neo-card bg-blue-50 p-4">
                    <h4 className="text-sm font-black text-gray-900 uppercase tracking-wider mb-2">Instructions:</h4>
                    <ul className="text-sm font-bold text-gray-700 space-y-1">
                      <li>• Upload a clear image of your written solution</li>
                      <li>• Ensure all work is visible and legible</li>
                      <li>• Supported formats: JPG, PNG, PDF</li>
                      <li>• Maximum file size: 10MB</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Answer Panel */}
            <div className="neo-card">
              <div className="bg-blue-600 text-white p-4 border-b-4 border-black">
                <h3 className="text-lg font-black uppercase tracking-wider flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span>Your Answer</span>
                </h3>
              </div>
              <div className="p-6">
                {!currentAnswer?.imageFile ? (
                  <div className="space-y-4">
                    <div 
                      className="neo-upload-zone border-4 border-dashed border-gray-300 p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <h3 className="text-lg font-black text-gray-900 uppercase tracking-wider mb-2">Upload Your Solution</h3>
                      <p className="text-sm font-bold text-gray-600 uppercase tracking-wide mb-4">
                        Click to select or drag and drop your image
                      </p>
                      <div className="flex items-center justify-center space-x-4">
                        <FileImage className="h-5 w-5 text-gray-500" />
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                          JPG, PNG, PDF up to 10MB
                        </span>
                      </div>
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleImageUpload}
                      className="hidden"
                    />

                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="neo-button w-full py-3 px-4 flex items-center justify-center space-x-2"
                    >
                      <Camera className="h-5 w-5" />
                      <span>Select Image File</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="neo-card p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-lg font-black text-gray-900 uppercase tracking-wider">Uploaded Solution</h4>
                        <button
                          onClick={handleRemoveImage}
                          className="neo-button bg-blue-600 hover:bg-blue-700 py-2 px-4 flex items-center space-x-2"
                        >
                          <X className="h-4 w-4" />
                          <span>Remove Image</span>
                        </button>
                      </div>
                      
                      {currentAnswer.imageUrl && (
                        <div className="space-y-3">
                          <img 
                            src={currentAnswer.imageUrl} 
                            alt="Student answer"
                            className="w-full h-auto rounded cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() => handlePreviewImage(currentAnswer.imageUrl!)}
                          />
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-gray-600 uppercase tracking-wide">
                              {currentAnswer.imageFile?.name}
                            </span>
                            <button
                              onClick={() => handlePreviewImage(currentAnswer.imageUrl!)}
                              className="text-sm font-bold text-blue-600 hover:text-blue-800 uppercase tracking-wider flex items-center space-x-1"
                            >
                              <Eye className="h-4 w-4" />
                              <span>Preview</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-sm font-bold text-gray-600 uppercase tracking-wide">
                      <span>✅ Solution Uploaded</span>
                      <span>
                        {currentAnswer.submittedAt?.toLocaleTimeString()}
                      </span>
                    </div>

                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="neo-button bg-gray-600 hover:bg-gray-700 w-full py-2 px-4 flex items-center justify-center space-x-2"
                    >
                      <Upload className="h-4 w-4" />
                      <span>Replace Image</span>
                    </button>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Question Navigation Grid */}
        <div className="neo-card p-6">
          <h3 className="text-xl font-black text-gray-900 uppercase tracking-wider mb-4">Question Navigator</h3>
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                      {allQuestions.map((question, index) => {
            const answer = answers.find(a => a.questionId === question._id);
            const isAnswered = answer?.imageFile || answer?.imageUrl;
            const isCurrent = index === currentQuestionIndex;
            
            return (
              <button
                key={question._id}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`neo-card p-2 text-center transition-all ${
                  isCurrent 
                    ? 'bg-blue-600 text-white transform scale-105' 
                    : isAnswered
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-900 hover:bg-gray-50'
                }`}
              >
                <span className="text-sm font-black uppercase tracking-wider">{index + 1}</span>
                {isAnswered && <CheckCircle className="h-3 w-3 mx-auto mt-1" />}
              </button>
            );
          })}
          </div>
        </div>

        {/* Image Preview Modal */}
        {showImagePreview && previewImage && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="neo-card max-w-4xl max-h-full overflow-auto">
              <div className="bg-gray-900 text-white p-4 flex items-center justify-between">
                <h3 className="text-lg font-black uppercase tracking-wider">Image Preview</h3>
                <button
                  onClick={() => setShowImagePreview(false)}
                  className="text-white hover:text-gray-300 p-1"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="p-4">
                <img 
                  src={previewImage} 
                  alt="Preview"
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default StudentExamView; 
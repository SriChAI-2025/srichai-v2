import React, { useState } from 'react';
import { User, Lock, LogIn, Eye, EyeOff, GraduationCap, BookOpen } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import toast from 'react-hot-toast';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState<'teacher' | 'student'>('teacher');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { theme } = useTheme();
  
  const isNeoBrutalism = theme === 'neo-brutalism';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password, userType);
      toast.success(`${userType.toUpperCase()} LOGIN SUCCESSFUL!`);
    } catch (error) {
      toast.error('LOGIN FAILED!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Logo Header */}
        <div className={`p-4 transform text-center ${isNeoBrutalism ? 'neo-card-header' : 'bg-white rounded-lg shadow-md border border-gray-200'}`}>
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className={`bg-blue-600 p-2 ${isNeoBrutalism ? 'neo-card' : 'rounded-lg shadow-md'}`}>
              <img 
                src="/e930ff2adec300925a5290708203751d.jpg" 
                alt="SriChAI Logo" 
                className="h-12 w-12 object-contain"
              />
            </div>
            <div>
              <span className={`text-3xl text-black uppercase tracking-wider ${isNeoBrutalism ? 'font-black' : 'font-bold'}`}>SriChAI</span>
              <p className={`text-blue-600 text-sm uppercase tracking-wider ${isNeoBrutalism ? 'font-bold' : 'font-medium'}`}>AI EXAM GRADING</p>
            </div>
          </div>
        </div>

        {/* User Type Selection */}
        <div className={`p-6 ${isNeoBrutalism ? 'neo-card' : 'bg-white rounded-lg shadow-md border border-gray-200'}`}>
          <h2 className={`text-2xl text-center text-gray-900 uppercase tracking-wider mb-6 ${isNeoBrutalism ? 'font-black' : 'font-bold'}`}>
            SELECT USER TYPE
          </h2>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              type="button"
              onClick={() => setUserType('teacher')}
              className={`p-4 text-center transition-all duration-200 ${
                isNeoBrutalism 
                  ? `neo-card ${userType === 'teacher' 
                      ? 'bg-blue-600 text-white transform scale-105' 
                      : 'bg-white text-gray-900 hover:bg-gray-50'
                    }`
                  : `rounded-lg border shadow-sm ${userType === 'teacher' 
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                      : 'bg-white text-gray-900 border-gray-200 hover:bg-gray-50 hover:shadow-md'
                    }`
              }`}
            >
              <GraduationCap className="h-8 w-8 mx-auto mb-2" />
              <p className={`text-lg uppercase tracking-wider ${isNeoBrutalism ? 'font-black' : 'font-bold'}`}>Teacher</p>
              <p className={`text-xs uppercase tracking-wide opacity-75 ${isNeoBrutalism ? 'font-bold' : 'font-medium'}`}>Create & Grade</p>
            </button>
            
            <button
              type="button"
              onClick={() => setUserType('student')}
              className={`p-4 text-center transition-all duration-200 ${
                isNeoBrutalism 
                  ? `neo-card ${userType === 'student' 
                      ? 'bg-green-600 text-white transform scale-105' 
                      : 'bg-white text-gray-900 hover:bg-gray-50'
                    }`
                  : `rounded-lg border shadow-sm ${userType === 'student' 
                      ? 'bg-green-600 text-white border-green-600 shadow-md' 
                      : 'bg-white text-gray-900 border-gray-200 hover:bg-gray-50 hover:shadow-md'
                    }`
              }`}
            >
              <BookOpen className="h-8 w-8 mx-auto mb-2" />
              <p className={`text-lg uppercase tracking-wider ${isNeoBrutalism ? 'font-black' : 'font-bold'}`}>Student</p>
              <p className={`text-xs uppercase tracking-wide opacity-75 ${isNeoBrutalism ? 'font-bold' : 'font-medium'}`}>Take Exams</p>
            </button>
          </div>
        </div>

        {/* Login Form */}
        <div className={`p-6 ${isNeoBrutalism ? 'neo-card' : 'bg-white rounded-lg shadow-md border border-gray-200'}`}>
          <div className="text-center mb-6">
            <h2 className={`text-2xl text-gray-900 uppercase tracking-wider ${isNeoBrutalism ? 'font-black' : 'font-bold'}`}>
              {userType === 'teacher' ? 'Teacher Login' : 'Student Login'}
            </h2>
            <p className={`text-sm text-gray-600 uppercase tracking-wide mt-2 ${isNeoBrutalism ? 'font-bold' : 'font-medium'}`}>
              Enter your credentials to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className={`block text-sm text-gray-900 uppercase tracking-wider mb-2 ${isNeoBrutalism ? 'font-black' : 'font-bold'}`}>
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-600" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`block w-full pl-10 pr-3 py-3 text-lg placeholder-gray-600 ${
                    isNeoBrutalism 
                      ? 'neo-input font-bold' 
                      : 'border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium'
                  }`}
                  placeholder={`${userType.toUpperCase()} EMAIL`}
                />
              </div>
            </div>

            <div>
              <label className={`block text-sm text-gray-900 uppercase tracking-wider mb-2 ${isNeoBrutalism ? 'font-black' : 'font-bold'}`}>
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-600" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`block w-full pl-10 pr-12 py-3 text-lg placeholder-gray-600 ${
                    isNeoBrutalism 
                      ? 'neo-input font-bold' 
                      : 'border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium'
                  }`}
                  placeholder="PASSWORD"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 text-lg font-bold flex items-center justify-center space-x-2 ${
                isNeoBrutalism 
                  ? `neo-button ${userType === 'student' ? 'bg-green-600 hover:bg-green-700' : ''}`
                  : `rounded-lg shadow-md border transition-colors ${
                      userType === 'student' 
                        ? 'bg-green-600 hover:bg-green-700 text-white border-green-600' 
                        : 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600'
                    }`
              }`}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                  <span>LOGGING IN...</span>
                </>
              ) : (
                <>
                  <LogIn className="h-5 w-5" />
                  <span>LOGIN AS {userType.toUpperCase()}</span>
                </>
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className={`mt-6 bg-gray-100 p-4 ${isNeoBrutalism ? 'neo-card' : 'rounded-lg border border-gray-300'}`}>
            <h3 className={`text-sm text-gray-900 uppercase tracking-wider mb-2 ${isNeoBrutalism ? 'font-black' : 'font-bold'}`}>Demo Credentials:</h3>
            <div className={`space-y-2 text-xs text-gray-700 uppercase tracking-wide ${isNeoBrutalism ? 'font-bold' : 'font-medium'}`}>
              <p>📧 Any valid email format</p>
              <p>🔒 Any password</p>
              <p>🎯 Just select your role above!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
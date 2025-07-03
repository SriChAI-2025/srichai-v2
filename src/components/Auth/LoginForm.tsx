import React, { useState } from 'react';
import { User, Lock, LogIn, Eye, EyeOff, GraduationCap, BookOpen } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState<'teacher' | 'student'>('teacher');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

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
        <div className="neo-card-header p-4 transform text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="bg-blue-600 neo-card p-2">
              <img 
                src="/e930ff2adec300925a5290708203751d.jpg" 
                alt="SriChAI Logo" 
                className="h-12 w-12 object-contain"
              />
            </div>
            <div>
              <span className="text-3xl font-black text-black uppercase tracking-wider">SriChAI</span>
              <p className="text-blue-600 text-sm font-bold uppercase tracking-wider">AI EXAM GRADING</p>
            </div>
          </div>
        </div>

        {/* User Type Selection */}
        <div className="neo-card p-6">
          <h2 className="text-2xl font-black text-center text-gray-900 uppercase tracking-wider mb-6">
            SELECT USER TYPE
          </h2>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              type="button"
              onClick={() => setUserType('teacher')}
              className={`neo-card p-4 text-center transition-all duration-200 ${
                userType === 'teacher' 
                  ? 'bg-blue-600 text-white transform scale-105' 
                  : 'bg-white text-gray-900 hover:bg-gray-50'
              }`}
            >
              <GraduationCap className="h-8 w-8 mx-auto mb-2" />
              <p className="font-black text-lg uppercase tracking-wider">Teacher</p>
              <p className="text-xs font-bold uppercase tracking-wide opacity-75">Create & Grade</p>
            </button>
            
            <button
              type="button"
              onClick={() => setUserType('student')}
              className={`neo-card p-4 text-center transition-all duration-200 ${
                userType === 'student' 
                  ? 'bg-green-600 text-white transform scale-105' 
                  : 'bg-white text-gray-900 hover:bg-gray-50'
              }`}
            >
              <BookOpen className="h-8 w-8 mx-auto mb-2" />
              <p className="font-black text-lg uppercase tracking-wider">Student</p>
              <p className="text-xs font-bold uppercase tracking-wide opacity-75">Take Exams</p>
            </button>
          </div>
        </div>

        {/* Login Form */}
        <div className="neo-card p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-wider">
              {userType === 'teacher' ? 'Teacher Login' : 'Student Login'}
            </h2>
            <p className="text-sm font-bold text-gray-600 uppercase tracking-wide mt-2">
              Enter your credentials to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-black text-gray-900 uppercase tracking-wider mb-2">
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
                  className="neo-input block w-full pl-10 pr-3 py-3 text-lg font-bold placeholder-gray-600"
                  placeholder={`${userType.toUpperCase()} EMAIL`}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-black text-gray-900 uppercase tracking-wider mb-2">
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
                  className="neo-input block w-full pl-10 pr-12 py-3 text-lg font-bold placeholder-gray-600"
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
              className={`w-full neo-button py-3 px-4 text-lg font-bold flex items-center justify-center space-x-2 ${
                userType === 'student' ? 'bg-green-600 hover:bg-green-700' : ''
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
          <div className="mt-6 neo-card bg-gray-100 p-4">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider mb-2">Demo Credentials:</h3>
            <div className="space-y-2 text-xs font-bold text-gray-700 uppercase tracking-wide">
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
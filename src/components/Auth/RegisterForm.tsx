import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { GraduationCap, Eye, EyeOff, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

interface RegisterFormProps {
  onToggleMode: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onToggleMode }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Bypass authentication - just redirect to dashboard
    window.location.href = '/dashboard';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-600 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-4 transform">
              <img 
                src="/e930ff2adec300925a5290708203751d.jpg" 
                alt="SriChAI Logo" 
                className="h-16 w-16 object-contain"
              />
            </div>
          </div>
          <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 transform">
            <h2 className="text-3xl font-black text-gray-900 uppercase tracking-wider mb-2">
              CREATE ACCOUNT
            </h2>
            <p className="text-lg font-bold text-gray-600 uppercase tracking-wide">
              JOIN SRICHAI TODAY
            </p>
          </div>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="neo-card p-6">
            <div className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-black text-gray-900 uppercase tracking-wider mb-2">
                  FULL NAME
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="neo-input w-full px-4 py-3 text-lg font-bold"
                  placeholder="ENTER YOUR FULL NAME"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-black text-gray-900 uppercase tracking-wider mb-2">
                  EMAIL ADDRESS
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="neo-input w-full px-4 py-3 text-lg font-bold"
                  placeholder="ENTER YOUR EMAIL"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-black text-gray-900 uppercase tracking-wider mb-2">
                  PASSWORD
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="neo-input w-full px-4 py-3 pr-12 text-lg font-bold"
                    placeholder="CREATE A PASSWORD"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center bg-gray-100 border-l-4 border-black hover:bg-gray-200 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-black text-gray-900 uppercase tracking-wider mb-2">
                  CONFIRM PASSWORD
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="neo-input w-full px-4 py-3 text-lg font-bold"
                  placeholder="CONFIRM YOUR PASSWORD"
                />
              </div>
            </div>

            <div className="mt-8">
              <button
                type="submit"
                disabled={loading}
                className="neo-button w-full py-4 text-lg flex items-center justify-center space-x-2"
              >
                <Zap className="h-5 w-5" />
                <span>{loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}</span>
              </button>
            </div>

            <div className="text-center mt-6">
              <button
                type="button"
                onClick={onToggleMode}
                className="text-lg font-bold text-blue-600 hover:text-blue-800 uppercase tracking-wider underline decoration-4 decoration-blue-600 hover:decoration-blue-800 transition-colors"
              >
                ALREADY HAVE AN ACCOUNT? SIGN IN
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
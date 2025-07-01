import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  User, 
  Mail, 
  Save, 
  Edit,
  Camera,
  Shield,
  Zap
} from 'lucide-react';
import Layout from '../components/Layout/Layout';
import toast from 'react-hot-toast';

const AccountProfile: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: 'AI-powered exam grading specialist',
    institution: 'Demo University',
    department: 'Computer Science'
  });

  const handleSave = () => {
    // Mock save functionality
    toast.success('PROFILE UPDATED SUCCESSFULLY!');
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 transform">
          <h1 className="text-4xl font-black text-black uppercase tracking-wider mb-2">PROFILE</h1>
          <p className="text-lg font-bold text-gray-700 uppercase tracking-wide">
            MANAGE YOUR ACCOUNT INFORMATION
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Picture Section */}
          <div className="lg:col-span-1">
            <div className="neo-card p-6">
              <div className="text-center">
                <div className="relative inline-block mb-6">
                  <div className="bg-blue-600 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] w-32 h-32 flex items-center justify-center">
                    <User className="h-16 w-16 text-white" />
                  </div>
                  <button className="absolute -bottom-2 -right-2 bg-orange-500 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-2 transform hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all duration-200">
                    <Camera className="h-4 w-4 text-white" />
                  </button>
                </div>
                
                <h2 className="text-2xl font-black text-gray-900 uppercase tracking-wider mb-2">
                  {formData.name}
                </h2>
                <p className="text-lg font-bold text-gray-600 uppercase tracking-wide mb-4">
                  {formData.department}
                </p>
                
                <div className="bg-blue-100 border-4 border-black p-4">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <Shield className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-black text-blue-900 uppercase tracking-wider">VERIFIED TEACHER</span>
                  </div>
                  <p className="text-xs font-bold text-blue-700 uppercase tracking-wide">
                    ACCOUNT VERIFIED
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Information */}
          <div className="lg:col-span-2">
            <div className="neo-card">
              <div className="bg-purple-600 text-white p-6 border-b-4 border-black">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-black uppercase tracking-wider flex items-center space-x-3">
                    <Zap className="h-6 w-6" />
                    <span>ACCOUNT DETAILS</span>
                  </h3>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="bg-white text-purple-600 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] px-4 py-2 font-bold uppercase tracking-wider transform transition-all duration-200 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px]"
                  >
                    <div className="flex items-center space-x-2">
                      <Edit className="h-4 w-4" />
                      <span>{isEditing ? 'CANCEL' : 'EDIT'}</span>
                    </div>
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-black text-gray-900 uppercase tracking-wider mb-2">
                      FULL NAME
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="neo-input w-full px-4 py-3 text-lg font-bold"
                      />
                    ) : (
                      <div className="bg-gray-100 border-4 border-black p-3">
                        <p className="text-lg font-bold text-gray-900">{formData.name}</p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-black text-gray-900 uppercase tracking-wider mb-2">
                      EMAIL ADDRESS
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="neo-input w-full px-4 py-3 text-lg font-bold"
                      />
                    ) : (
                      <div className="bg-gray-100 border-4 border-black p-3">
                        <p className="text-lg font-bold text-gray-900">{formData.email}</p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-black text-gray-900 uppercase tracking-wider mb-2">
                      INSTITUTION
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="institution"
                        value={formData.institution}
                        onChange={handleChange}
                        className="neo-input w-full px-4 py-3 text-lg font-bold"
                      />
                    ) : (
                      <div className="bg-gray-100 border-4 border-black p-3">
                        <p className="text-lg font-bold text-gray-900">{formData.institution}</p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-black text-gray-900 uppercase tracking-wider mb-2">
                      DEPARTMENT
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        className="neo-input w-full px-4 py-3 text-lg font-bold"
                      />
                    ) : (
                      <div className="bg-gray-100 border-4 border-black p-3">
                        <p className="text-lg font-bold text-gray-900">{formData.department}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-black text-gray-900 uppercase tracking-wider mb-2">
                    BIO
                  </label>
                  {isEditing ? (
                    <textarea
                      name="bio"
                      rows={4}
                      value={formData.bio}
                      onChange={handleChange}
                      className="neo-input w-full px-4 py-3 text-lg font-bold"
                    />
                  ) : (
                    <div className="bg-gray-100 border-4 border-black p-3">
                      <p className="text-lg font-bold text-gray-900">{formData.bio}</p>
                    </div>
                  )}
                </div>

                {isEditing && (
                  <div className="flex justify-end space-x-4">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="neo-button-secondary px-6 py-3 text-lg"
                    >
                      CANCEL
                    </button>
                    <button
                      onClick={handleSave}
                      className="neo-button px-6 py-3 text-lg flex items-center space-x-2"
                    >
                      <Save className="h-5 w-5" />
                      <span>SAVE CHANGES</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="neo-stat-card from-blue-400 to-blue-600 text-white p-6">
            <div className="text-center">
              <p className="text-blue-100 font-bold uppercase tracking-wider text-sm mb-2">EXAMS CREATED</p>
              <p className="text-4xl font-black mb-2">12</p>
              <p className="text-blue-100 font-bold uppercase tracking-wide text-xs">THIS SEMESTER</p>
            </div>
          </div>

          <div className="neo-stat-card from-green-400 to-green-600 text-white p-6">
            <div className="text-center">
              <p className="text-green-100 font-bold uppercase tracking-wider text-sm mb-2">ANSWERS GRADED</p>
              <p className="text-4xl font-black mb-2">1,247</p>
              <p className="text-green-100 font-bold uppercase tracking-wide text-xs">TOTAL COUNT</p>
            </div>
          </div>

          <div className="neo-stat-card from-purple-400 to-purple-600 text-white p-6">
            <div className="text-center">
              <p className="text-purple-100 font-bold uppercase tracking-wider text-sm mb-2">TIME SAVED</p>
              <p className="text-4xl font-black mb-2">48H</p>
              <p className="text-purple-100 font-bold uppercase tracking-wide text-xs">WITH AI ASSIST</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AccountProfile;
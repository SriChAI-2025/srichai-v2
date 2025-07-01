import React, { useState } from 'react';
import { 
  Settings, 
  Bell, 
  Shield, 
  Palette, 
  Zap,
  Save,
  Eye,
  EyeOff
} from 'lucide-react';
import Layout from '../components/Layout/Layout';
import toast from 'react-hot-toast';

const AccountSettings: React.FC = () => {
  const [settings, setSettings] = useState({
    notifications: {
      emailNotifications: true,
      pushNotifications: false,
      gradingReminders: true,
      weeklyReports: true
    },
    privacy: {
      profileVisibility: 'private',
      dataSharing: false,
      analyticsTracking: true
    },
    preferences: {
      theme: 'neo-brutalism',
      language: 'english',
      autoSave: true,
      aiAssistance: true
    }
  });

  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleSettingChange = (category: string, setting: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [setting]: value
      }
    }));
  };

  const handleSaveSettings = () => {
    toast.success('SETTINGS SAVED SUCCESSFULLY!');
  };

  const handlePasswordChange = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('PASSWORDS DO NOT MATCH!');
      return;
    }
    toast.success('PASSWORD UPDATED SUCCESSFULLY!');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setShowPasswordChange(false);
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 transform">
          <h1 className="text-4xl font-black text-black uppercase tracking-wider mb-2">SETTINGS</h1>
          <p className="text-lg font-bold text-gray-700 uppercase tracking-wide">
            CUSTOMIZE YOUR EXPERIENCE
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Notifications */}
          <div className="neo-card">
            <div className="bg-blue-600 text-white p-6 border-b-4 border-black">
              <h3 className="text-2xl font-black uppercase tracking-wider flex items-center space-x-3">
                <Bell className="h-6 w-6" />
                <span>NOTIFICATIONS</span>
              </h3>
            </div>
            <div className="p-6 space-y-6">
              {Object.entries(settings.notifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-black text-gray-900 uppercase tracking-wider">
                      {key.replace(/([A-Z])/g, ' $1').toUpperCase()}
                    </p>
                    <p className="text-sm font-bold text-gray-600 uppercase tracking-wide">
                      {key === 'emailNotifications' && 'RECEIVE EMAIL UPDATES'}
                      {key === 'pushNotifications' && 'BROWSER NOTIFICATIONS'}
                      {key === 'gradingReminders' && 'REMIND TO GRADE EXAMS'}
                      {key === 'weeklyReports' && 'WEEKLY SUMMARY EMAILS'}
                    </p>
                  </div>
                  <button
                    onClick={() => handleSettingChange('notifications', key, !value)}
                    className={`w-16 h-8 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform transition-all duration-200 ${
                      value ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`w-6 h-6 bg-white border-2 border-black transform transition-all duration-200 ${
                      value ? 'translate-x-6' : 'translate-x-0'
                    }`}></div>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Privacy */}
          <div className="neo-card">
            <div className="bg-purple-600 text-white p-6 border-b-4 border-black">
              <h3 className="text-2xl font-black uppercase tracking-wider flex items-center space-x-3">
                <Shield className="h-6 w-6" />
                <span>PRIVACY</span>
              </h3>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <p className="text-lg font-black text-gray-900 uppercase tracking-wider mb-2">
                  PROFILE VISIBILITY
                </p>
                <select
                  value={settings.privacy.profileVisibility}
                  onChange={(e) => handleSettingChange('privacy', 'profileVisibility', e.target.value)}
                  className="neo-input w-full px-4 py-3 text-lg font-bold"
                >
                  <option value="private">PRIVATE</option>
                  <option value="public">PUBLIC</option>
                  <option value="institution">INSTITUTION ONLY</option>
                </select>
              </div>

              {Object.entries(settings.privacy).filter(([key]) => key !== 'profileVisibility').map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-black text-gray-900 uppercase tracking-wider">
                      {key.replace(/([A-Z])/g, ' $1').toUpperCase()}
                    </p>
                    <p className="text-sm font-bold text-gray-600 uppercase tracking-wide">
                      {key === 'dataSharing' && 'SHARE ANONYMOUS DATA'}
                      {key === 'analyticsTracking' && 'USAGE ANALYTICS'}
                    </p>
                  </div>
                  <button
                    onClick={() => handleSettingChange('privacy', key, !value)}
                    className={`w-16 h-8 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform transition-all duration-200 ${
                      value ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`w-6 h-6 bg-white border-2 border-black transform transition-all duration-200 ${
                      value ? 'translate-x-6' : 'translate-x-0'
                    }`}></div>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Preferences */}
          <div className="neo-card">
            <div className="bg-orange-500 text-white p-6 border-b-4 border-black">
              <h3 className="text-2xl font-black uppercase tracking-wider flex items-center space-x-3">
                <Palette className="h-6 w-6" />
                <span>PREFERENCES</span>
              </h3>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <p className="text-lg font-black text-gray-900 uppercase tracking-wider mb-2">
                  THEME
                </p>
                <select
                  value={settings.preferences.theme}
                  onChange={(e) => handleSettingChange('preferences', 'theme', e.target.value)}
                  className="neo-input w-full px-4 py-3 text-lg font-bold"
                >
                  <option value="neo-brutalism">NEO BRUTALISM</option>
                  <option value="classic">CLASSIC</option>
                  <option value="dark">DARK MODE</option>
                </select>
              </div>

              <div>
                <p className="text-lg font-black text-gray-900 uppercase tracking-wider mb-2">
                  LANGUAGE
                </p>
                <select
                  value={settings.preferences.language}
                  onChange={(e) => handleSettingChange('preferences', 'language', e.target.value)}
                  className="neo-input w-full px-4 py-3 text-lg font-bold"
                >
                  <option value="english">ENGLISH</option>
                  <option value="spanish">ESPAÑOL</option>
                  <option value="french">FRANÇAIS</option>
                </select>
              </div>

              {Object.entries(settings.preferences).filter(([key]) => !['theme', 'language'].includes(key)).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-black text-gray-900 uppercase tracking-wider">
                      {key.replace(/([A-Z])/g, ' $1').toUpperCase()}
                    </p>
                    <p className="text-sm font-bold text-gray-600 uppercase tracking-wide">
                      {key === 'autoSave' && 'AUTOMATICALLY SAVE WORK'}
                      {key === 'aiAssistance' && 'ENABLE AI SUGGESTIONS'}
                    </p>
                  </div>
                  <button
                    onClick={() => handleSettingChange('preferences', key, !value)}
                    className={`w-16 h-8 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform transition-all duration-200 ${
                      value ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`w-6 h-6 bg-white border-2 border-black transform transition-all duration-200 ${
                      value ? 'translate-x-6' : 'translate-x-0'
                    }`}></div>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Security */}
          <div className="neo-card">
            <div className="bg-red-500 text-white p-6 border-b-4 border-black">
              <h3 className="text-2xl font-black uppercase tracking-wider flex items-center space-x-3">
                <Shield className="h-6 w-6" />
                <span>SECURITY</span>
              </h3>
            </div>
            <div className="p-6 space-y-6">
              <button
                onClick={() => setShowPasswordChange(!showPasswordChange)}
                className="neo-button-secondary w-full py-3 text-lg flex items-center justify-center space-x-2"
              >
                <span>CHANGE PASSWORD</span>
                {showPasswordChange ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>

              {showPasswordChange && (
                <div className="space-y-4 border-4 border-black p-4 bg-gray-50">
                  <div>
                    <label className="block text-sm font-black text-gray-900 uppercase tracking-wider mb-2">
                      CURRENT PASSWORD
                    </label>
                    <input
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                      className="neo-input w-full px-4 py-3 text-lg font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-black text-gray-900 uppercase tracking-wider mb-2">
                      NEW PASSWORD
                    </label>
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                      className="neo-input w-full px-4 py-3 text-lg font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-black text-gray-900 uppercase tracking-wider mb-2">
                      CONFIRM PASSWORD
                    </label>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className="neo-input w-full px-4 py-3 text-lg font-bold"
                    />
                  </div>
                  <button
                    onClick={handlePasswordChange}
                    className="neo-button w-full py-3 text-lg flex items-center justify-center space-x-2"
                  >
                    <Save className="h-5 w-5" />
                    <span>UPDATE PASSWORD</span>
                  </button>
                </div>
              )}

              <div className="bg-yellow-100 border-4 border-black p-4">
                <p className="text-sm font-black text-yellow-900 uppercase tracking-wider mb-2">
                  SECURITY STATUS
                </p>
                <p className="text-xs font-bold text-yellow-700 uppercase tracking-wide">
                  ACCOUNT SECURE • LAST LOGIN: TODAY
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="text-center">
          <button
            onClick={handleSaveSettings}
            className="neo-button px-8 py-4 text-xl flex items-center space-x-3 mx-auto"
          >
            <Save className="h-6 w-6" />
            <span>SAVE ALL SETTINGS</span>
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default AccountSettings;
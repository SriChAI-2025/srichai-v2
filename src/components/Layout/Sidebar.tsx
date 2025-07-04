import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  PlusCircle, 
  Settings, 
  User, 
  ChevronLeft, 
  ChevronRight,
  BookOpen,
  GraduationCap,
  BarChart3,
  Target
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const { user } = useAuth();
  const { theme } = useTheme();
  
  const isNeoBrutalism = theme === 'neo-brutalism';

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path);
  };

  // Navigation items based on user role
  const getNavigationItems = () => {
    const commonItems = [
      {
        icon: FileText,
        label: 'Exams',
        path: '/exams',
        description: user?.role === 'teacher' ? 'Manage Exams' : 'Take Exams'
      },
      {
        icon: User,
        label: 'Profile',
        path: '/account/profile',
        description: 'Your Profile'
      },
      {
        icon: Settings,
        label: 'Settings',
        path: '/account/settings',
        description: 'Account Settings'
      }
    ];

    if (user?.role === 'teacher') {
      return [
        {
          icon: LayoutDashboard,
          label: 'Dashboard',
          path: '/dashboard',
          description: 'Teacher Overview'
        },
        {
          icon: PlusCircle,
          label: 'Create Exam',
          path: '/create-exam',
          description: 'New Exam'
        },
        ...commonItems
      ];
    } else {
      return [
        {
          icon: GraduationCap,
          label: 'Dashboard',
          path: '/student-dashboard',
          description: 'Student Overview'
        },
        ...commonItems,
        {
          icon: BarChart3,
          label: 'Results',
          path: '/results',
          description: 'View Scores'
        }
      ];
    }
  };

  const navigationItems = getNavigationItems();

  return (
    <div className={`${isNeoBrutalism ? 'bg-white border-r-4 border-black neo-shadow-right' : 'bg-white border-r border-gray-200 shadow-lg'} transition-all duration-300 ${
      isCollapsed ? 'w-20' : 'w-80'
    } h-screen flex flex-col`}>
      
      {/* Header */}
      <div className={`p-6 ${isNeoBrutalism ? 'border-b-4 border-black bg-gray-50' : 'border-b border-gray-200 bg-gray-50'}`}>
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-4">
              <div className={`bg-blue-600 p-3 ${isNeoBrutalism ? 'neo-card' : 'rounded-lg shadow-md'}`}>
                <img 
                  src="/e930ff2adec300925a5290708203751d.jpg" 
                  alt="SriChAI Logo" 
                  className="h-10 w-10 object-contain"
                />
              </div>
              <div>
                <h1 className={`text-2xl text-black uppercase tracking-wider ${isNeoBrutalism ? 'font-black' : 'font-bold'}`}>SriChAI</h1>
                <p className={`text-sm text-blue-600 uppercase tracking-wider ${isNeoBrutalism ? 'font-bold' : 'font-medium'}`}>
                  {user?.role === 'teacher' ? 'Teacher Portal' : 'Student Portal'}
                </p>
              </div>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`p-3 hover:bg-gray-100 transition-colors ${isNeoBrutalism ? 'neo-card' : 'rounded-lg border border-gray-300 shadow-sm'}`}
          >
            {isCollapsed ? (
              <ChevronRight className="h-6 w-6" />
            ) : (
              <ChevronLeft className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* User Info */}
      {!isCollapsed && user && (
        <div className={`p-6 bg-blue-50 ${isNeoBrutalism ? 'border-b-4 border-black' : 'border-b border-gray-200'}`}>
          <div className="flex items-center space-x-4">
            <div className={`p-4 bg-blue-600 text-white ${isNeoBrutalism ? 'neo-card' : 'rounded-lg shadow-md'}`}>
              {user.role === 'teacher' ? (
                <GraduationCap className="h-8 w-8" />
              ) : (
                <BookOpen className="h-8 w-8" />
              )}
            </div>
            <div>
              <p className={`text-lg text-gray-900 uppercase tracking-wider ${isNeoBrutalism ? 'font-black' : 'font-bold'}`}>{user.name}</p>
              <p className={`text-sm text-gray-600 uppercase tracking-wider ${isNeoBrutalism ? 'font-bold' : 'font-medium'}`}>{user.role}</p>
              <p className={`text-sm text-gray-500 uppercase tracking-wider truncate ${isNeoBrutalism ? 'font-bold' : 'font-medium'}`}>{user.email}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-6 space-y-4 overflow-y-auto">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-4 p-4 transition-all duration-200 group ${
                isNeoBrutalism 
                  ? `neo-card ${active 
                      ? 'bg-blue-600 text-white transform scale-105'
                      : 'bg-white text-gray-900 hover:bg-gray-50 hover:transform hover:scale-105'
                    }`
                  : `rounded-lg shadow-sm border ${active 
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                      : 'bg-white text-gray-900 border-gray-200 hover:bg-gray-50 hover:shadow-md'
                    }`
              }`}
            >
              <Icon className={`h-6 w-6 ${active ? 'text-white' : 'text-gray-600 group-hover:text-gray-900'}`} />
              {!isCollapsed && (
                <div>
                  <span className={`text-lg uppercase tracking-wider ${isNeoBrutalism ? 'font-black' : 'font-bold'}`}>{item.label}</span>
                  <p className={`text-sm uppercase tracking-wide ${isNeoBrutalism ? 'font-bold' : 'font-medium'} ${
                    active ? 'text-white opacity-90' : 'text-gray-500 group-hover:text-gray-600'
                  }`}>
                    {item.description}
                  </p>
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Quick Stats Footer */}
      {!isCollapsed && (
        <div className={`p-6 bg-gray-50 ${isNeoBrutalism ? 'border-t-4 border-black' : 'border-t border-gray-200'}`}>
          <div className="space-y-4">
            <h3 className={`text-lg text-gray-900 uppercase tracking-wider ${isNeoBrutalism ? 'font-black' : 'font-bold'}`}>Quick Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className={`p-4 text-center ${isNeoBrutalism ? 'neo-card' : 'rounded-lg border border-gray-200 bg-white shadow-sm'}`}>
                <p className={`text-2xl text-blue-600 uppercase tracking-wider ${isNeoBrutalism ? 'font-black' : 'font-bold'}`}>
                  {user?.role === 'teacher' ? '12' : '8'}
                </p>
                <p className={`text-sm text-gray-600 uppercase tracking-wide ${isNeoBrutalism ? 'font-bold' : 'font-medium'}`}>
                  {user?.role === 'teacher' ? 'Exams' : 'Completed'}
                </p>
              </div>
              <div className={`p-4 text-center ${isNeoBrutalism ? 'neo-card' : 'rounded-lg border border-gray-200 bg-white shadow-sm'}`}>
                <p className={`text-2xl text-blue-600 uppercase tracking-wider ${isNeoBrutalism ? 'font-black' : 'font-bold'}`}>
                  {user?.role === 'teacher' ? '156' : '87%'}
                </p>
                <p className={`text-sm text-gray-600 uppercase tracking-wide ${isNeoBrutalism ? 'font-bold' : 'font-medium'}`}>
                  {user?.role === 'teacher' ? 'Graded' : 'Average'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Collapsed View Tooltips */}
      {isCollapsed && (
        <div className="p-3">
          <div className="space-y-3">
            {navigationItems.slice(0, 4).map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  title={item.label}
                  className={`flex items-center justify-center p-4 neo-card transition-all duration-200 ${
                    active 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-6 w-6" />
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
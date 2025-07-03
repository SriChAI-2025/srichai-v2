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

const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

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
    <div className={`bg-white border-r-4 border-black transition-all duration-300 ${
      isCollapsed ? 'w-20' : 'w-80'
    } h-screen flex flex-col neo-shadow-right`}>
      
      {/* Header */}
      <div className="p-6 border-b-4 border-black bg-gray-50">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-4">
              <div className="bg-blue-600 neo-card p-3">
                <img 
                  src="/e930ff2adec300925a5290708203751d.jpg" 
                  alt="SriChAI Logo" 
                  className="h-10 w-10 object-contain"
                />
              </div>
              <div>
                <h1 className="text-2xl font-black text-black uppercase tracking-wider">SriChAI</h1>
                <p className="text-sm font-bold text-blue-600 uppercase tracking-wider">
                  {user?.role === 'teacher' ? 'Teacher Portal' : 'Student Portal'}
                </p>
              </div>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="neo-card p-3 hover:bg-gray-100 transition-colors"
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
        <div className="p-6 border-b-4 border-black bg-blue-50">
          <div className="flex items-center space-x-4">
            <div className="neo-card p-4 bg-blue-600 text-white">
              {user.role === 'teacher' ? (
                <GraduationCap className="h-8 w-8" />
              ) : (
                <BookOpen className="h-8 w-8" />
              )}
            </div>
            <div>
              <p className="text-lg font-black text-gray-900 uppercase tracking-wider">{user.name}</p>
              <p className="text-sm font-bold text-gray-600 uppercase tracking-wider">{user.role}</p>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wider truncate">{user.email}</p>
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
              className={`flex items-center space-x-4 p-4 neo-card transition-all duration-200 group ${
                active 
                  ? 'bg-blue-600 text-white transform scale-105'
                  : 'bg-white text-gray-900 hover:bg-gray-50 hover:transform hover:scale-105'
              }`}
            >
              <Icon className={`h-6 w-6 ${active ? 'text-white' : 'text-gray-600 group-hover:text-gray-900'}`} />
              {!isCollapsed && (
                <div>
                  <span className="text-lg font-black uppercase tracking-wider">{item.label}</span>
                  <p className={`text-sm font-bold uppercase tracking-wide ${
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
        <div className="p-6 border-t-4 border-black bg-gray-50">
          <div className="space-y-4">
            <h3 className="text-lg font-black text-gray-900 uppercase tracking-wider">Quick Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="neo-card p-4 text-center">
                <p className="text-2xl font-black text-blue-600 uppercase tracking-wider">
                  {user?.role === 'teacher' ? '12' : '8'}
                </p>
                <p className="text-sm font-bold text-gray-600 uppercase tracking-wide">
                  {user?.role === 'teacher' ? 'Exams' : 'Completed'}
                </p>
              </div>
              <div className="neo-card p-4 text-center">
                <p className="text-2xl font-black text-blue-600 uppercase tracking-wider">
                  {user?.role === 'teacher' ? '156' : '87%'}
                </p>
                <p className="text-sm font-bold text-gray-600 uppercase tracking-wide">
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
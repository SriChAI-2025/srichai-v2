import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  BarChart3, 
  FileText, 
  User,
  Settings,
  LogOut,
  Zap,
  X
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, isCollapsed, onToggleCollapse }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { 
      path: '/dashboard', 
      label: 'DASHBOARD', 
      icon: BarChart3,
      description: 'OVERVIEW & STATS'
    },
    { 
      path: '/exams', 
      label: 'EXAMS', 
      icon: FileText,
      description: 'MANAGE EXAMS'
    },
  ];

  const accountItems = [
    {
      path: '/account/profile',
      label: 'PROFILE',
      icon: User,
      description: 'USER SETTINGS'
    },
    {
      path: '/account/settings',
      label: 'SETTINGS',
      icon: Settings,
      description: 'APP PREFERENCES'
    }
  ];

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const handleLinkClick = () => {
    // Close sidebar on mobile when a link is clicked (only if not collapsed)
    if (window.innerWidth < 1024 && !isCollapsed) {
      onClose();
    }
  };

  // Dynamic width based on collapsed state - works for both mobile and desktop
  const sidebarWidth = isCollapsed ? 'w-16' : 'w-72';

  return (
    <>
      {/* Overlay for mobile (only when sidebar is open and not collapsed) */}
      {isOpen && !isCollapsed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed lg:static inset-y-0 left-0 z-50 ${sidebarWidth} bg-white border-r-4 border-black shadow-[4px_0px_0px_0px_rgba(0,0,0,1)] h-screen overflow-y-auto hide-scrollbar transform transition-all duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        {/* Close Button (Mobile Only - only show when not collapsed) */}
        {!isCollapsed && (
          <div className="lg:hidden absolute top-4 right-4 z-10">
            <button
              onClick={onClose}
              className="bg-red-500 text-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-2 transform transition-all duration-200 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px]"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Logo Section */}
        <div className="p-6 border-b-4 border-black bg-blue-600">
          <button 
            onClick={onToggleCollapse}
            className="flex items-center space-x-3 w-full text-left hover:bg-blue-700 transition-colors rounded p-2 -m-2"
          >
            <div className="bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-2 transform hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all duration-200 flex-shrink-0">
              <img 
                src="/e930ff2adec300925a5290708203751d.jpg" 
                alt="SriChAI Logo" 
                className="h-8 w-8 object-contain"
              />
            </div>
            {!isCollapsed && (
              <div>
                <span className="text-2xl font-black text-white uppercase tracking-wider">SriChAI</span>
                <p className="text-blue-100 text-xs font-bold uppercase tracking-wider">AI EXAM GRADING</p>
              </div>
            )}
          </button>
        </div>

        {/* User Info */}
        {!isCollapsed && (
          <div className="p-6 border-b-4 border-black bg-gray-50">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-3">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-lg font-black text-gray-900 uppercase tracking-wider">{user?.name}</p>
                <p className="text-sm font-bold text-gray-600 uppercase tracking-wide">{user?.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Collapsed User Icon */}
        {isCollapsed && (
          <div className="p-4 border-b-4 border-black bg-gray-50 flex justify-center">
            <div className="bg-blue-600 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-3" title={user?.name}>
              <User className="h-6 w-6 text-white" />
            </div>
          </div>
        )}

        {/* Main Navigation */}
        <div className={`${isCollapsed ? 'p-2' : 'p-6'} border-b-4 border-black`}>
          {!isCollapsed && (
            <h2 className="text-sm font-black text-gray-900 uppercase tracking-wider mb-4 flex items-center space-x-2">
              <Zap className="h-4 w-4" />
              <span>MAIN MENU</span>
            </h2>
          )}
          <nav className="space-y-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={handleLinkClick}
                  className={`block w-full ${isCollapsed ? 'p-3' : 'p-4'} border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform transition-all duration-200 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] ${
                    active
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-black hover:bg-gray-100'
                  }`}
                  title={isCollapsed ? item.label : undefined}
                >
                  {isCollapsed ? (
                    <div className="flex justify-center">
                      <Icon className="h-6 w-6" />
                    </div>
                  ) : (
                    <div className="flex items-center space-x-3">
                      <Icon className="h-6 w-6" />
                      <div>
                        <p className="text-lg font-black uppercase tracking-wider">{item.label}</p>
                        <p className={`text-xs font-bold uppercase tracking-wide ${
                          active ? 'text-blue-100' : 'text-gray-600'
                        }`}>
                          {item.description}
                        </p>
                      </div>
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Account Section */}
        <div className={`${isCollapsed ? 'p-2' : 'p-6'} border-b-4 border-black`}>
          {!isCollapsed && (
            <h2 className="text-sm font-black text-gray-900 uppercase tracking-wider mb-4 flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>ACCOUNT</span>
            </h2>
          )}
          <nav className="space-y-3">
            {accountItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={handleLinkClick}
                  className={`block w-full ${isCollapsed ? 'p-3' : 'p-4'} border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform transition-all duration-200 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] ${
                    active
                      ? 'bg-purple-600 text-white'
                      : 'bg-white text-black hover:bg-gray-100'
                  }`}
                  title={isCollapsed ? item.label : undefined}
                >
                  {isCollapsed ? (
                    <div className="flex justify-center">
                      <Icon className="h-5 w-5" />
                    </div>
                  ) : (
                    <div className="flex items-center space-x-3">
                      <Icon className="h-5 w-5" />
                      <div>
                        <p className="text-base font-black uppercase tracking-wider">{item.label}</p>
                        <p className={`text-xs font-bold uppercase tracking-wide ${
                          active ? 'text-purple-100' : 'text-gray-600'
                        }`}>
                          {item.description}
                        </p>
                      </div>
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Logout Button */}
        <div className={`${isCollapsed ? 'p-2' : 'p-6'}`}>
          <button
            onClick={() => {
              logout();
              onClose();
            }}
            className={`w-full ${isCollapsed ? 'p-3' : 'p-4'} bg-red-500 text-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-black uppercase tracking-wider transform transition-all duration-200 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px]`}
            title={isCollapsed ? 'LOGOUT' : undefined}
          >
            {isCollapsed ? (
              <div className="flex justify-center">
                <LogOut className="h-5 w-5" />
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-3">
                <LogOut className="h-5 w-5" />
                <span>LOGOUT</span>
              </div>
            )}
          </button>
        </div>

        {/* Footer */}
        {!isCollapsed && (
          <div className="p-6 border-t-4 border-black bg-gray-50">
            <div className="text-center">
              <p className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                POWERED BY AI
              </p>
              <p className="text-xs font-black text-gray-900 uppercase tracking-wider">
                SRICHAI v2.0
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Sidebar;
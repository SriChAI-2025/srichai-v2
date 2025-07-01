import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  GraduationCap, 
  BarChart3, 
  FileText, 
  LogOut, 
  User 
} from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', label: 'DASHBOARD', icon: BarChart3 },
    { path: '/exams', label: 'EXAMS', icon: FileText },
  ];

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <nav className="neo-navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-3">
              <div className="bg-blue-600 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-2 transform hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all duration-200">
                <img 
                  src="/e930ff2adec300925a5290708203751d.jpg" 
                  alt="SriChAI Logo" 
                  className="h-8 w-8 object-contain"
                />
              </div>
              <span className="text-2xl font-black text-black uppercase tracking-wider">SriChAI</span>
            </Link>
            
            <div className="hidden md:ml-12 md:flex md:space-x-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-2 px-6 py-3 font-bold uppercase tracking-wider text-sm border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform transition-all duration-200 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] ${
                      isActive(item.path)
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-black hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3 bg-gray-100 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] px-4 py-2">
              <div className="bg-blue-600 border-2 border-black p-1">
                <User className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-bold uppercase tracking-wider text-black">{user?.name}</span>
            </div>
            
            <button
              onClick={logout}
              className="flex items-center space-x-2 px-4 py-3 font-bold uppercase tracking-wider text-sm bg-red-500 text-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform transition-all duration-200 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px]"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden md:inline">LOGOUT</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
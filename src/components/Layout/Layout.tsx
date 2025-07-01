import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const toggleSidebarCollapse = () => {
    setSidebarCollapsed(!sidebarCollapsed);
    // On mobile, if we're collapsing, make sure sidebar stays open
    if (!sidebarCollapsed && window.innerWidth < 1024) {
      setSidebarOpen(true);
    }
  };

  return (
    <div className="h-screen bg-gray-100 flex overflow-hidden">
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={closeSidebar}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={toggleSidebarCollapse}
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full transition-all duration-300">
        {/* Mobile Header with Hamburger Menu */}
        <div className="lg:hidden bg-white border-b-4 border-black shadow-[0px_4px_0px_0px_rgba(0,0,0,1)] p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={toggleSidebar}
              className="bg-blue-600 text-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-3 transform transition-all duration-200 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px]"
            >
              <Menu className="h-6 w-6" />
            </button>
            
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-2">
                <img 
                  src="/e930ff2adec300925a5290708203751d.jpg" 
                  alt="SriChAI Logo" 
                  className="h-6 w-6 object-contain"
                />
              </div>
              <span className="text-xl font-black text-black uppercase tracking-wider">SriChAI</span>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          <div className="w-full px-4 py-4">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
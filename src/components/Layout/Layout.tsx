import React from 'react';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="h-screen bg-gray-100 flex overflow-hidden">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full transition-all duration-300">
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
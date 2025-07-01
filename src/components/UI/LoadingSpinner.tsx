import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  text = 'LOADING...' 
}) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-16 w-16',
    lg: 'h-24 w-24'
  };

  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 transform">
        <div className={`animate-spin border-4 border-black border-t-blue-600 ${sizeClasses[size]} mx-auto mb-4`}></div>
        {text && (
          <p className="text-xl font-black text-gray-900 uppercase tracking-wider text-center">{text}</p>
        )}
      </div>
    </div>
  );
};

export default LoadingSpinner;
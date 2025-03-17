import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiHome, FiActivity, FiPlus } from 'react-icons/fi';

const Navbar: React.FC = () => {
  const pathname = usePathname();
  
  const isActive = (path: string) => {
    return pathname === path;
  };
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-lg border-t border-gray-200 dark:border-gray-700 sm:hidden">
      <div className="flex justify-around items-center h-16">
        <Link 
          href="/" 
          className={`flex flex-col items-center justify-center w-full h-full ${
            isActive('/') ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'
          }`}
        >
          <FiHome size={20} />
          <span className="text-xs mt-1">首页</span>
        </Link>
        
        <Link 
          href="/status" 
          className={`flex flex-col items-center justify-center w-full h-full ${
            isActive('/status') ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'
          }`}
        >
          <FiActivity size={20} />
          <span className="text-xs mt-1">状态</span>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar; 
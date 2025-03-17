import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiActivity, FiPlus } from 'react-icons/fi';

const Header: React.FC<{ title: string }> = ({ title }) => {
  const pathname = usePathname();
  
  return (
    <header className="bg-white dark:bg-gray-800 shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
          
          <div className="hidden sm:flex space-x-4">
            <Link 
              href="/" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                pathname === '/' 
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' 
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              首页
            </Link>
            
            <Link 
              href="/status" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                pathname === '/status' 
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' 
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              <span className="flex items-center">
                <FiActivity className="mr-1" />
                状态
              </span>
            </Link>
            
            {pathname === '/' && (
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('open-add-modal'))}
                className="inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FiPlus className="mr-1" />
                添加服务
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 
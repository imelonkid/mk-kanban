import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiActivity, FiPlus, FiPieChart } from 'react-icons/fi';

const Header: React.FC<{ title: string }> = ({ title }) => {
  const pathname = usePathname();
  
  return (
    <header className="bg-white dark:bg-gray-800 shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="focus:outline-none">
              <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-400 dark:to-purple-500 hover:from-blue-600 hover:to-purple-700 dark:hover:from-blue-500 dark:hover:to-purple-600 transition-all duration-300 transform hover:scale-105 select-none">
                Papaya
              </h1>
            </Link>
          </div>
          
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
              href="/dashboard" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                pathname === '/dashboard' 
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' 
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              <span className="flex items-center">
                <FiPieChart className="mr-1" />
                数据
              </span>
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
                监控
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
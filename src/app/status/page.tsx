'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiExternalLink, FiActivity } from 'react-icons/fi';
import { Service } from '@/types';
import Header from '@/components/Header';
import Navbar from '@/components/Navbar';
import CustomDropdown from '@/components/CustomDropdown';
import { getServicesApi, updateServiceStatusApi } from '@/lib/api';

export default function StatusPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  
  useEffect(() => {
    const loadServices = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const servicesData = await getServicesApi();
        setServices(servicesData);
      } catch (err) {
        console.error('加载服务失败:', err);
        setError('加载服务失败，请稍后再试');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadServices();
  }, []);
  
  const handleStatusChange = async (id: string, status: Service['status']) => {
    try {
      setUpdatingStatus(id);
      const updatedService = await updateServiceStatusApi(id, status);
      if (updatedService) {
        setServices(prev => 
          prev.map(service => 
            service.id === updatedService.id ? updatedService : service
          )
        );
      } else {
        setError('更新服务状态失败，请稍后再试');
      }
    } catch (err) {
      console.error('更新服务状态失败:', err);
      setError('更新服务状态失败，请稍后再试');
    } finally {
      setUpdatingStatus(null);
    }
  };
  
  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-red-500',
    maintenance: 'bg-yellow-500'
  };
  
  const statusText = {
    online: '在线',
    offline: '离线',
    maintenance: '维护中'
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">加载中...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-16 sm:pb-0">
      <Header title="服务运行状态" />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
            <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setError(null)}>
              <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <title>关闭</title>
                <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
              </svg>
            </span>
          </div>
        )}
        
        {services.length > 0 ? (
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      服务名称
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      状态
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      分类
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {services.map(service => (
                    <tr key={service.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              <Link href={`/services/${service.id}`} className="hover:underline">
                                {service.name}
                              </Link>
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                              {service.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className={`inline-block w-3 h-3 rounded-full mr-2 ${statusColors[service.status]}`}></span>
                          {updatingStatus === service.id ? (
                            <div className="animate-pulse flex items-center">
                              <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                            </div>
                          ) : (
                            <CustomDropdown
                              options={[
                                { value: 'online', label: '在线' },
                                { value: 'offline', label: '离线' },
                                { value: 'maintenance', label: '维护中' }
                              ]}
                              value={service.status}
                              onChange={(value) => handleStatusChange(service.id, value as Service['status'])}
                              icon={<FiActivity />}
                              className="w-32"
                            />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {service.category ? (
                          <span className="inline-block bg-gray-100 dark:bg-gray-700 rounded-full px-3 py-1 text-xs font-semibold text-gray-700 dark:text-gray-300">
                            {service.category}
                          </span>
                        ) : (
                          <span className="text-gray-400 dark:text-gray-500 text-sm">无分类</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <a 
                          href={service.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          访问
                          <FiExternalLink size={14} className="ml-1" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">没有服务，请添加一个新服务。</p>
            <Link 
              href="/"
              className="inline-flex items-center mt-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              返回首页添加服务
            </Link>
          </div>
        )}
      </main>
      
      {/* 底部导航栏 */}
      <Navbar />
    </div>
  );
} 
'use client';

import React, { useState, useEffect } from 'react';
import { Service } from '@/types';
import Header from '@/components/Header';
import Navbar from '@/components/Navbar';
import ServiceDashboard from '@/components/ServiceDashboard';
import { getServicesApi } from '@/lib/api';
import { FiPieChart, FiBarChart2, FiActivity } from 'react-icons/fi';

export default function DashboardPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
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
  
  // 计算各状态服务数量
  const totalServices = services.length;
  const onlineServices = services.filter(service => service.status === 'online').length;
  const offlineServices = services.filter(service => service.status === 'offline').length;
  const maintenanceServices = services.filter(service => service.status === 'maintenance').length;
  
  // 计算在线率
  const onlineRate = totalServices > 0 ? Math.round((onlineServices / totalServices) * 100) : 0;
  
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
      <Header title="服务数据中心" />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
            <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setError(null)}>
              <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <title>关闭</title>
                <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
              </svg>
            </span>
          </div>
        )}
        
        {/* 服务状态大盘 */}
        <ServiceDashboard services={services} />
        
        {/* 额外的统计信息 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* 服务状态分布 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <FiPieChart className="text-blue-500 mr-2" size={20} />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">服务状态分布</h2>
            </div>
            
            <div className="flex items-center justify-center h-64">
              <div className="relative w-48 h-48">
                {/* 简单的饼图实现 */}
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  {/* 在线服务扇区 */}
                  {onlineServices > 0 && (
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke="#10B981"
                      strokeWidth="20"
                      strokeDasharray={`${onlineServices / totalServices * 251.2} 251.2`}
                      transform="rotate(-90 50 50)"
                    />
                  )}
                  
                  {/* 离线服务扇区 */}
                  {offlineServices > 0 && (
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke="#EF4444"
                      strokeWidth="20"
                      strokeDasharray={`${offlineServices / totalServices * 251.2} 251.2`}
                      strokeDashoffset={`${-onlineServices / totalServices * 251.2}`}
                      transform="rotate(-90 50 50)"
                    />
                  )}
                  
                  {/* 维护中服务扇区 */}
                  {maintenanceServices > 0 && (
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke="#F59E0B"
                      strokeWidth="20"
                      strokeDasharray={`${maintenanceServices / totalServices * 251.2} 251.2`}
                      strokeDashoffset={`${-(onlineServices + offlineServices) / totalServices * 251.2}`}
                      transform="rotate(-90 50 50)"
                    />
                  )}
                </svg>
                
                {/* 中心文字 */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">{totalServices}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">总服务数</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2 mt-4">
              <div className="flex flex-col items-center">
                <div className="flex items-center">
                  <span className="w-3 h-3 bg-green-500 rounded-full mr-1"></span>
                  <span className="text-sm text-gray-600 dark:text-gray-300">在线</span>
                </div>
                <span className="text-lg font-semibold text-gray-900 dark:text-white">{onlineServices}</span>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="flex items-center">
                  <span className="w-3 h-3 bg-red-500 rounded-full mr-1"></span>
                  <span className="text-sm text-gray-600 dark:text-gray-300">离线</span>
                </div>
                <span className="text-lg font-semibold text-gray-900 dark:text-white">{offlineServices}</span>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="flex items-center">
                  <span className="w-3 h-3 bg-yellow-500 rounded-full mr-1"></span>
                  <span className="text-sm text-gray-600 dark:text-gray-300">维护</span>
                </div>
                <span className="text-lg font-semibold text-gray-900 dark:text-white">{maintenanceServices}</span>
              </div>
            </div>
          </div>
          
          {/* 服务在线率趋势 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <FiActivity className="text-blue-500 mr-2" size={20} />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">服务在线率</h2>
            </div>
            
            <div className="flex flex-col items-center justify-center h-64">
              <div className="w-full max-w-xs">
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-600 bg-green-200">
                        在线率
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold inline-block text-green-600">
                        {onlineRate}%
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-6 mb-4 text-xs flex rounded bg-green-200">
                    <div style={{ width: `${onlineRate}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500">
                      {onlineRate > 10 && `${onlineRate}%`}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 text-center">
                <p className="text-gray-600 dark:text-gray-300 mb-2">服务健康状态</p>
                <div className="text-4xl font-bold">
                  {onlineRate >= 90 ? (
                    <span className="text-green-500">优秀</span>
                  ) : onlineRate >= 75 ? (
                    <span className="text-blue-500">良好</span>
                  ) : onlineRate >= 50 ? (
                    <span className="text-yellow-500">一般</span>
                  ) : (
                    <span className="text-red-500">需关注</span>
                  )}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  {onlineRate >= 90 ? (
                    '大部分服务运行正常，系统健康'
                  ) : onlineRate >= 75 ? (
                    '多数服务正常，少数需要关注'
                  ) : onlineRate >= 50 ? (
                    '部分服务异常，建议检查'
                  ) : (
                    '多数服务异常，需要紧急处理'
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Navbar />
    </div>
  );
} 
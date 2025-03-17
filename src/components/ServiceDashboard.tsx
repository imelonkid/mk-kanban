import React from 'react';
import { Service } from '@/types';
import { FiServer, FiCheckCircle, FiXCircle, FiAlertTriangle } from 'react-icons/fi';

interface ServiceDashboardProps {
  services: Service[];
}

const ServiceDashboard: React.FC<ServiceDashboardProps> = ({ services }) => {
  // 计算各状态服务数量
  const totalServices = services.length;
  const onlineServices = services.filter(service => service.status === 'online').length;
  const offlineServices = services.filter(service => service.status === 'offline').length;
  const maintenanceServices = services.filter(service => service.status === 'maintenance').length;
  
  // 计算在线率
  const onlineRate = totalServices > 0 ? Math.round((onlineServices / totalServices) * 100) : 0;
  
  // 按分类统计服务
  const servicesByCategory = services.reduce((acc, service) => {
    const category = service.category || '未分类';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(service);
    return acc;
  }, {} as Record<string, Service[]>);
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">服务概览</h2>
      
      {/* 状态统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <div className="flex items-center">
            <FiServer className="text-blue-500 mr-3" size={24} />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">总服务数</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalServices}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
          <div className="flex items-center">
            <FiCheckCircle className="text-green-500 mr-3" size={24} />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">在线服务</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{onlineServices}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
          <div className="flex items-center">
            <FiXCircle className="text-red-500 mr-3" size={24} />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">离线服务</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{offlineServices}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
          <div className="flex items-center">
            <FiAlertTriangle className="text-yellow-500 mr-3" size={24} />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">维护中</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{maintenanceServices}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* 在线率进度条 */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">服务在线率</p>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{onlineRate}%</p>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
          <div 
            className="bg-green-500 h-2.5 rounded-full" 
            style={{ width: `${onlineRate}%` }}
          ></div>
        </div>
      </div>
      
      {/* 分类统计 */}
      {Object.keys(servicesByCategory).length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">按分类统计</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(servicesByCategory).map(([category, services]) => (
              <div key={category} className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{category}</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{services.length}</p>
                <div className="mt-2 flex items-center space-x-2">
                  <span className="inline-block w-3 h-3 rounded-full bg-green-500"></span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {services.filter(s => s.status === 'online').length} 在线
                  </span>
                  
                  <span className="inline-block w-3 h-3 rounded-full bg-red-500"></span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {services.filter(s => s.status === 'offline').length} 离线
                  </span>
                  
                  <span className="inline-block w-3 h-3 rounded-full bg-yellow-500"></span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {services.filter(s => s.status === 'maintenance').length} 维护
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceDashboard; 
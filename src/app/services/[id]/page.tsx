'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiArrowLeft, FiExternalLink, FiEdit, FiTrash2 } from 'react-icons/fi';
import { Service, ServiceFormData } from '@/types';
import Modal from '@/components/Modal';
import ServiceForm from '@/components/ServiceForm';
import Navbar from '@/components/Navbar';
import { getServiceApi, updateServiceApi, deleteServiceApi } from '@/lib/api';

interface ServiceDetailPageProps {
  params: {
    id: string;
  };
}

export default function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const { id } = params;
  const router = useRouter();
  const [service, setService] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  
  useEffect(() => {
    const fetchService = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const serviceData = await getServiceApi(id);
        setService(serviceData);
      } catch (err) {
        console.error('获取服务详情失败:', err);
        setError('获取服务详情失败，请稍后再试');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchService();
  }, [id]);
  
  const handleEditService = async (serviceData: ServiceFormData) => {
    if (!service) return;
    
    try {
      setIsUpdating(true);
      setError(null);
      const updatedService = await updateServiceApi(service.id, serviceData);
      if (updatedService) {
        setService(updatedService);
        setIsEditModalOpen(false);
      } else {
        setError('更新服务失败，请稍后再试');
      }
    } catch (err) {
      console.error('更新服务失败:', err);
      setError('更新服务失败，请稍后再试');
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleDeleteService = async () => {
    if (!service) return;
    
    if (window.confirm('确定要删除这个服务吗？')) {
      try {
        setIsUpdating(true);
        setError(null);
        const success = await deleteServiceApi(service.id);
        if (success) {
          router.push('/');
        } else {
          setError('删除服务失败，请稍后再试');
        }
      } catch (err) {
        console.error('删除服务失败:', err);
        setError('删除服务失败，请稍后再试');
      } finally {
        setIsUpdating(false);
      }
    }
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
  
  if (!service) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">服务未找到</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">找不到ID为 {id} 的服务</p>
          <Link 
            href="/"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FiArrowLeft className="mr-2" />
            返回首页
          </Link>
        </div>
      </div>
    );
  }
  
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
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN');
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-16 sm:pb-0">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center">
            <Link 
              href="/"
              className="mr-4 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
            >
              <FiArrowLeft size={20} />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{service.name}</h1>
          </div>
        </div>
      </header>
      
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
        
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="flex items-center mb-2">
                  <span className={`inline-block w-3 h-3 rounded-full mr-2 ${statusColors[service.status]}`}></span>
                  <span className="text-sm text-gray-600 dark:text-gray-300 capitalize">{statusText[service.status as keyof typeof statusText]}</span>
                </div>
                {service.category && (
                  <div className="mb-2">
                    <span className="inline-block bg-gray-100 dark:bg-gray-700 rounded-full px-3 py-1 text-xs font-semibold text-gray-700 dark:text-gray-300">
                      {service.category}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="flex space-x-2">
                <button 
                  onClick={() => setIsEditModalOpen(true)}
                  className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                  aria-label="编辑服务"
                  disabled={isUpdating}
                >
                  <FiEdit size={18} />
                </button>
                <button 
                  onClick={handleDeleteService}
                  className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                  aria-label="删除服务"
                  disabled={isUpdating}
                >
                  <FiTrash2 size={18} />
                </button>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">描述</h3>
              <p className="text-gray-600 dark:text-gray-300">{service.description}</p>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">URL</h3>
              <a 
                href={service.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
              >
                {service.url}
                <FiExternalLink size={16} className="ml-2" />
              </a>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">创建时间</h3>
                <p className="text-gray-600 dark:text-gray-300">{formatDate(service.createdAt)}</p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">最后更新</h3>
                <p className="text-gray-600 dark:text-gray-300">{formatDate(service.updatedAt)}</p>
              </div>
            </div>
            
            <div className="mt-8">
              <a 
                href={service.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                访问服务
                <FiExternalLink size={16} className="ml-2" />
              </a>
            </div>
          </div>
        </div>
      </main>
      
      {/* 编辑服务模态框 */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="编辑服务"
      >
        <ServiceForm
          initialData={service}
          onSubmit={handleEditService}
          onCancel={() => setIsEditModalOpen(false)}
          isSubmitting={isUpdating}
        />
      </Modal>
      
      {/* 底部导航栏 */}
      <Navbar />
    </div>
  );
} 
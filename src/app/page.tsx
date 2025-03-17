'use client';

import React, { useState, useEffect } from 'react';
import { FiPlus, FiFilter, FiSearch, FiActivity, FiTag } from 'react-icons/fi';
import { Service, ServiceFormData } from '@/types';
import ServiceCard from '@/components/ServiceCard';
import ServiceForm from '@/components/ServiceForm';
import ServiceDashboard from '@/components/ServiceDashboard';
import CustomDropdown from '@/components/CustomDropdown';
import Modal from '@/components/Modal';
import Header from '@/components/Header';
import Navbar from '@/components/Navbar';
import { getServicesApi, addServiceApi, updateServiceApi, deleteServiceApi } from '@/lib/api';

export default function Home() {
  const [services, setServices] = useState<Service[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentService, setCurrentService] = useState<Service | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 加载服务数据
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
    
    // 添加事件监听器，以便在点击顶部导航栏的添加按钮时打开模态框
    const handleOpenAddModal = () => {
      setCurrentService(undefined);
      setIsModalOpen(true);
    };
    
    window.addEventListener('open-add-modal', handleOpenAddModal);
    
    return () => {
      window.removeEventListener('open-add-modal', handleOpenAddModal);
    };
  }, []);

  // 处理添加服务
  const handleAddService = async (serviceData: ServiceFormData) => {
    try {
      const newService = await addServiceApi(serviceData);
      if (newService) {
        setServices(prev => [...prev, newService]);
        setIsModalOpen(false);
      } else {
        setError('添加服务失败，请稍后再试');
      }
    } catch (err) {
      console.error('添加服务失败:', err);
      setError('添加服务失败，请稍后再试');
    }
  };

  // 处理编辑服务
  const handleEditService = async (serviceData: ServiceFormData) => {
    if (!currentService) return;
    
    try {
      const updatedService = await updateServiceApi(currentService.id, serviceData);
      if (updatedService) {
        setServices(prev => 
          prev.map(service => 
            service.id === updatedService.id ? updatedService : service
          )
        );
        setIsModalOpen(false);
        setCurrentService(undefined);
      } else {
        setError('更新服务失败，请稍后再试');
      }
    } catch (err) {
      console.error('更新服务失败:', err);
      setError('更新服务失败，请稍后再试');
    }
  };

  // 处理删除服务
  const handleDeleteService = async (id: string) => {
    if (window.confirm('确定要删除这个服务吗？')) {
      try {
        const success = await deleteServiceApi(id);
        if (success) {
          setServices(prev => prev.filter(service => service.id !== id));
        } else {
          setError('删除服务失败，请稍后再试');
        }
      } catch (err) {
        console.error('删除服务失败:', err);
        setError('删除服务失败，请稍后再试');
      }
    }
  };

  // 打开编辑模态框
  const openEditModal = (service: Service) => {
    setCurrentService(service);
    setIsModalOpen(true);
  };

  // 打开添加模态框
  const openAddModal = () => {
    setCurrentService(undefined);
    setIsModalOpen(false);
    setTimeout(() => setIsModalOpen(true), 0);
  };

  // 关闭模态框
  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentService(undefined);
  };

  // 获取所有唯一的分类
  const categories = [...new Set(services.map(service => service.category).filter(Boolean))];

  // 过滤服务
  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || service.category === categoryFilter;
    const matchesStatus = !statusFilter || service.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

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
      <Header title="Papaya" />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">服务总览</h1>
          
          <div className="relative mt-3 sm:mt-0 w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="搜索服务..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
        
        {/* 服务状态大盘 */}
        <ServiceDashboard services={services} />
        
        {/* 筛选 */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="font-medium text-gray-700 dark:text-gray-300">筛选：</div>
            
            <CustomDropdown
              options={[
                { value: '', label: '所有分类' },
                ...categories.map(category => ({ value: category || '', label: category || '' }))
              ]}
              value={categoryFilter}
              onChange={setCategoryFilter}
              icon={<FiTag />}
              className="w-40"
            />
            
            <CustomDropdown
              options={[
                { value: '', label: '所有状态' },
                { value: 'online', label: '在线' },
                { value: 'offline', label: '离线' },
                { value: 'maintenance', label: '维护中' }
              ]}
              value={statusFilter}
              onChange={setStatusFilter}
              icon={<FiActivity />}
              className="w-40"
            />
            
            <button
              onClick={openAddModal}
              className="inline-flex items-center ml-auto px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:hidden"
            >
              <FiPlus className="mr-2" />
              添加服务
            </button>
          </div>
        </div>
        
        {/* 服务列表 */}
        {filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map(service => (
              <ServiceCard
                key={service.id}
                service={service}
                onEdit={openEditModal}
                onDelete={handleDeleteService}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              {services.length === 0 ? '没有服务，请添加一个新服务。' : '没有匹配的服务。'}
            </p>
            <button
              onClick={openAddModal}
              className="inline-flex items-center mt-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FiPlus className="mr-2" />
              添加服务
            </button>
          </div>
        )}
      </main>
      
      {/* 添加/编辑服务模态框 */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={currentService ? '编辑服务' : '添加服务'}
      >
        <ServiceForm
          initialData={currentService}
          onSubmit={currentService ? handleEditService : handleAddService}
          onCancel={closeModal}
        />
      </Modal>
      
      {/* 底部导航栏 */}
      <Navbar />
    </div>
  );
}

import { Service, ServiceFormData } from '@/types';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'mk-kanban-services';

// 从localStorage获取所有服务
export const getServices = (): Service[] => {
  if (typeof window === 'undefined') return [];
  
  const servicesJson = localStorage.getItem(STORAGE_KEY);
  if (!servicesJson) return [];
  
  try {
    return JSON.parse(servicesJson);
  } catch (error) {
    console.error('Failed to parse services from localStorage:', error);
    return [];
  }
};

// 获取单个服务
export const getService = (id: string): Service | undefined => {
  const services = getServices();
  return services.find(service => service.id === id);
};

// 添加新服务
export const addService = (serviceData: ServiceFormData): Service => {
  const services = getServices();
  
  const newService: Service = {
    ...serviceData,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  const updatedServices = [...services, newService];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedServices));
  
  return newService;
};

// 更新服务
export const updateService = (id: string, serviceData: Partial<ServiceFormData>): Service | null => {
  const services = getServices();
  const serviceIndex = services.findIndex(service => service.id === id);
  
  if (serviceIndex === -1) return null;
  
  const updatedService: Service = {
    ...services[serviceIndex],
    ...serviceData,
    updatedAt: new Date().toISOString(),
  };
  
  services[serviceIndex] = updatedService;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(services));
  
  return updatedService;
};

// 删除服务
export const deleteService = (id: string): boolean => {
  const services = getServices();
  const updatedServices = services.filter(service => service.id !== id);
  
  if (updatedServices.length === services.length) return false;
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedServices));
  return true;
};

// 更新服务状态
export const updateServiceStatus = (id: string, status: Service['status']): Service | null => {
  return updateService(id, { status });
}; 
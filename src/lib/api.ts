import { Service, ServiceFormData } from '@/types';

// 获取当前主机名和协议
const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    // 浏览器环境
    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    const backendPort = process.env.NEXT_PUBLIC_BACKEND_PORT || '3001';
    return `${protocol}//${hostname}:${backendPort}/api`;
  }
  // 服务器端渲染环境
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || getBaseUrl();

// 添加调试日志
console.log('API基础URL:', API_BASE_URL);

// 获取所有服务
export const getServicesApi = async (): Promise<Service[]> => {
  try {
    console.log('请求API:', `${API_BASE_URL}/services`);
    const response = await fetch(`${API_BASE_URL}/services`);
    if (!response.ok) {
      throw new Error(`API错误: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('获取服务列表失败:', error);
    return [];
  }
};

// 获取单个服务
export const getServiceApi = async (id: string): Promise<Service | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/services/${id}`);
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`API错误: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`获取服务 ${id} 失败:`, error);
    return null;
  }
};

// 添加新服务
export const addServiceApi = async (serviceData: ServiceFormData): Promise<Service | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/services`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(serviceData),
    });
    
    if (!response.ok) {
      throw new Error(`API错误: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('添加服务失败:', error);
    return null;
  }
};

// 更新服务
export const updateServiceApi = async (id: string, serviceData: Partial<ServiceFormData>): Promise<Service | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/services/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(serviceData),
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`API错误: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`更新服务 ${id} 失败:`, error);
    return null;
  }
};

// 删除服务
export const deleteServiceApi = async (id: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/services/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok && response.status !== 204) {
      if (response.status === 404) {
        return false;
      }
      throw new Error(`API错误: ${response.status}`);
    }
    
    return true;
  } catch (error) {
    console.error(`删除服务 ${id} 失败:`, error);
    return false;
  }
};

// 更新服务状态
export const updateServiceStatusApi = async (id: string, status: Service['status']): Promise<Service | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/services/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`API错误: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`更新服务 ${id} 状态失败:`, error);
    return null;
  }
}; 
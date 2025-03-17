import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Service } from '@/types';
import { FiExternalLink, FiEdit, FiTrash2, FiInfo, FiServer, FiDatabase, FiGlobe, FiMonitor, FiCloud, FiMail, FiFileText, FiCalendar, FiShield, FiTool } from 'react-icons/fi';

interface ServiceCardProps {
  service: Service;
  onEdit: (service: Service) => void;
  onDelete: (id: string) => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onEdit, onDelete }) => {
  const [faviconUrl, setFaviconUrl] = useState<string | null>(null);
  const [faviconError, setFaviconError] = useState(false);

  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-red-500',
    maintenance: 'bg-yellow-500'
  };

  // 预设图标映射
  const iconMap = {
    server: <FiServer size={24} className="text-blue-500" />,
    database: <FiDatabase size={24} className="text-blue-500" />,
    globe: <FiGlobe size={24} className="text-blue-500" />,
    monitor: <FiMonitor size={24} className="text-blue-500" />,
    cloud: <FiCloud size={24} className="text-blue-500" />,
    mail: <FiMail size={24} className="text-blue-500" />,
    file: <FiFileText size={24} className="text-blue-500" />,
    calendar: <FiCalendar size={24} className="text-blue-500" />,
    shield: <FiShield size={24} className="text-blue-500" />,
    tool: <FiTool size={24} className="text-blue-500" />,
  };

  // 尝试获取网站的favicon
  useEffect(() => {
    if (!service.icon && !faviconError) {
      try {
        // 从URL中提取域名
        const url = new URL(service.url);
        const domain = url.hostname;
        
        // 尝试获取favicon
        const faviconUrl = `https://${domain}/favicon.ico`;
        
        // 创建一个Image对象来检查favicon是否存在
        const img = new Image();
        img.onload = () => {
          setFaviconUrl(faviconUrl);
        };
        img.onerror = () => {
          // 如果直接的favicon.ico不存在，尝试使用Google的favicon服务
          const googleFaviconUrl = `https://www.google.com/s2/favicons?domain=${domain}`;
          setFaviconUrl(googleFaviconUrl);
        };
        img.src = faviconUrl;
      } catch (error) {
        console.error('获取favicon失败:', error);
        setFaviconError(true);
      }
    }
  }, [service.url, service.icon, faviconError]);

  // 获取服务图标
  const getServiceIcon = () => {
    // 如果有自定义图标，优先使用
    if (service.icon) {
      if (service.icon.startsWith('http')) {
        // 如果是URL，显示图片
        return (
          <img 
            src={service.icon} 
            alt={`${service.name} 图标`} 
            className="w-8 h-8 object-contain mr-3"
            onError={() => setFaviconError(true)}
          />
        );
      } else {
        // 如果是预设图标名称
        return (
          <div className="mr-3">
            {iconMap[service.icon as keyof typeof iconMap] || <FiServer size={24} className="text-blue-500" />}
          </div>
        );
      }
    }
    
    // 如果没有自定义图标但成功获取了favicon
    if (faviconUrl) {
      return (
        <img 
          src={faviconUrl} 
          alt={`${service.name} 图标`} 
          className="w-8 h-8 object-contain mr-3"
          onError={() => setFaviconError(true)}
        />
      );
    }
    
    // 默认图标
    return <FiServer size={24} className="text-blue-500 mr-3" />;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg">
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center">
            {getServiceIcon()}
            <Link href={`/services/${service.id}`} className="hover:underline">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{service.name}</h3>
            </Link>
          </div>
          <div className="flex items-center">
            <span className={`inline-block w-3 h-3 rounded-full mr-2 ${statusColors[service.status]}`}></span>
            <span className="text-sm text-gray-600 dark:text-gray-300 capitalize">{service.status}</span>
          </div>
        </div>
        
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">{service.description}</p>
        
        {service.category && (
          <div className="mb-4">
            <span className="inline-block bg-gray-100 dark:bg-gray-700 rounded-full px-3 py-1 text-xs font-semibold text-gray-700 dark:text-gray-300">
              {service.category}
            </span>
          </div>
        )}
        
        <div className="flex justify-between items-center mt-4">
          <div className="flex space-x-2">
            <Link 
              href={`/services/${service.id}`}
              className="p-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
              aria-label="查看服务详情"
            >
              <FiInfo size={18} />
            </Link>
            <button 
              onClick={() => onEdit(service)}
              className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
              aria-label="编辑服务"
            >
              <FiEdit size={18} />
            </button>
            <button 
              onClick={() => onDelete(service.id)}
              className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors"
              aria-label="删除服务"
            >
              <FiTrash2 size={18} />
            </button>
          </div>
          
          <a 
            href={service.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors"
          >
            访问
            <FiExternalLink size={16} className="ml-2" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard; 
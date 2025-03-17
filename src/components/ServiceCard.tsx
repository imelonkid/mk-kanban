import React from 'react';
import Link from 'next/link';
import { Service } from '@/types';
import { FiExternalLink, FiEdit, FiTrash2, FiInfo } from 'react-icons/fi';

interface ServiceCardProps {
  service: Service;
  onEdit: (service: Service) => void;
  onDelete: (id: string) => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onEdit, onDelete }) => {
  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-red-500',
    maintenance: 'bg-yellow-500'
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg">
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <Link href={`/services/${service.id}`} className="hover:underline">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{service.name}</h3>
          </Link>
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
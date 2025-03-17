import React, { useState, useEffect } from 'react';
import { ServiceFormData } from '@/types';
import { FiServer, FiDatabase, FiGlobe, FiMonitor, FiCloud, FiMail, FiFileText, FiCalendar, FiShield, FiTool, FiDownload } from 'react-icons/fi';

interface ServiceFormProps {
  initialData?: any;
  onSubmit: (data: ServiceFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const ServiceForm: React.FC<ServiceFormProps> = ({ initialData, onSubmit, onCancel, isSubmitting = false }) => {
  const [formData, setFormData] = useState<ServiceFormData>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    url: initialData?.url || '',
    status: initialData?.status || 'online',
    icon: initialData?.icon || '',
    category: initialData?.category || '',
  });

  const [showIconSelector, setShowIconSelector] = useState(false);
  const [faviconUrl, setFaviconUrl] = useState<string | null>(null);
  const [isFetchingFavicon, setIsFetchingFavicon] = useState(false);

  // 预定义图标选项
  const iconOptions = [
    { icon: <FiServer />, name: 'server', label: '服务器' },
    { icon: <FiDatabase />, name: 'database', label: '数据库' },
    { icon: <FiGlobe />, name: 'globe', label: '网站' },
    { icon: <FiMonitor />, name: 'monitor', label: '监控' },
    { icon: <FiCloud />, name: 'cloud', label: '云服务' },
    { icon: <FiMail />, name: 'mail', label: '邮件' },
    { icon: <FiFileText />, name: 'file', label: '文档' },
    { icon: <FiCalendar />, name: 'calendar', label: '日历' },
    { icon: <FiShield />, name: 'shield', label: '安全' },
    { icon: <FiTool />, name: 'tool', label: '工具' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // 当URL改变时，重置favicon
    if (name === 'url') {
      setFaviconUrl(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const selectIcon = (iconName: string) => {
    setFormData(prev => ({ ...prev, icon: iconName }));
    setShowIconSelector(false);
  };

  // 获取网站favicon
  const fetchFavicon = async () => {
    if (!formData.url) return;
    
    try {
      setIsFetchingFavicon(true);
      
      // 从URL中提取域名
      const url = new URL(formData.url);
      const domain = url.hostname;
      
      // 尝试获取favicon
      const directFaviconUrl = `https://${domain}/favicon.ico`;
      
      // 创建一个Image对象来检查favicon是否存在
      const img = new Image();
      
      const checkImage = new Promise<string>((resolve, reject) => {
        img.onload = () => resolve(directFaviconUrl);
        img.onerror = () => {
          // 如果直接的favicon.ico不存在，尝试使用Google的favicon服务
          resolve(`https://www.google.com/s2/favicons?domain=${domain}`);
        };
      });
      
      img.src = directFaviconUrl;
      
      const result = await checkImage;
      setFaviconUrl(result);
    } catch (error) {
      console.error('获取favicon失败:', error);
    } finally {
      setIsFetchingFavicon(false);
    }
  };

  // 使用favicon作为图标
  const useFaviconAsIcon = () => {
    if (faviconUrl) {
      setFormData(prev => ({ ...prev, icon: faviconUrl }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          服务名称 *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          placeholder="输入服务名称"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          描述 *
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          placeholder="输入服务描述"
        />
      </div>

      <div>
        <label htmlFor="url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          URL *
        </label>
        <div className="flex space-x-2">
          <input
            type="url"
            id="url"
            name="url"
            value={formData.url}
            onChange={handleChange}
            required
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="输入服务URL"
          />
          <button
            type="button"
            onClick={fetchFavicon}
            disabled={!formData.url || isFetchingFavicon}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            {isFetchingFavicon ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                获取中
              </span>
            ) : (
              <span className="flex items-center">
                <FiDownload className="mr-1" />
                获取图标
              </span>
            )}
          </button>
        </div>
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          服务状态 *
        </label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
        >
          <option value="online">在线</option>
          <option value="offline">离线</option>
          <option value="maintenance">维护中</option>
        </select>
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          分类
        </label>
        <input
          type="text"
          id="category"
          name="category"
          value={formData.category || ''}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          placeholder="输入服务分类"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          图标
        </label>
        <div className="flex items-center space-x-2">
          <div 
            className="w-10 h-10 flex items-center justify-center border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700"
          >
            {formData.icon ? (
              formData.icon.startsWith('http') ? (
                <img src={formData.icon} alt="图标" className="w-6 h-6" />
              ) : (
                <div className="text-blue-500">
                  {iconOptions.find(opt => opt.name === formData.icon)?.icon || <FiServer />}
                </div>
              )
            ) : faviconUrl ? (
              <img src={faviconUrl} alt="网站图标" className="w-6 h-6" />
            ) : (
              <FiServer className="text-gray-400" />
            )}
          </div>
          
          <div className="flex-1">
            <input
              type="text"
              id="icon"
              name="icon"
              value={formData.icon || ''}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="输入图标URL或选择预设图标"
            />
          </div>
          
          <div className="flex space-x-2">
            {faviconUrl && !formData.icon && (
              <button 
                type="button"
                onClick={useFaviconAsIcon}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                使用
              </button>
            )}
            <button 
              type="button"
              onClick={() => setShowIconSelector(!showIconSelector)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              选择
            </button>
          </div>
        </div>
        
        {showIconSelector && (
          <div className="mt-2 p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800">
            <div className="grid grid-cols-5 gap-2">
              {iconOptions.map((option) => (
                <button
                  key={option.name}
                  type="button"
                  onClick={() => selectIcon(option.name)}
                  className={`p-2 flex flex-col items-center justify-center rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 ${
                    formData.icon === option.name ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300' : ''
                  }`}
                >
                  <div className="text-xl mb-1">{option.icon}</div>
                  <span className="text-xs">{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
          disabled={isSubmitting}
        >
          取消
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? '提交中...' : initialData ? '更新' : '添加'}
        </button>
      </div>
    </form>
  );
};

export default ServiceForm; 
// 动态配置文件，在运行时确定API地址

// 获取当前主机名和协议
export const getApiBaseUrl = (): string => {
  if (typeof window !== 'undefined') {
    // 浏览器环境
    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    const backendPort = process.env.BACKEND_PORT; // 后端端口
    
    // 使用当前主机名，但使用后端端口
    return `${protocol}//${hostname}:${backendPort}/api`;
  }
  
  // 服务器端渲染环境，使用环境变量或默认值
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
};

// 导出配置
const config = {
  apiBaseUrl: getApiBaseUrl(),
};

export default config; 
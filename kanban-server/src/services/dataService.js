const fs = require('fs-extra');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// 数据文件路径
const DATA_DIR = path.join(__dirname, '../../data');
const SERVICES_FILE = path.join(DATA_DIR, 'services.json');
const LOG_FILE = path.join(DATA_DIR, 'operations.log');

// 日志记录函数
const logOperation = async (operation, details) => {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${operation}: ${JSON.stringify(details)}\n`;
  
  try {
    await fs.appendFile(LOG_FILE, logEntry);
    console.log(`日志已记录: ${operation}`);
    
  } catch (error) {
    console.error('记录日志失败:', error);
  }
};

// 确保数据目录存在
fs.ensureDirSync(DATA_DIR);

// 如果数据文件不存在，创建一个空的数据文件
if (!fs.existsSync(SERVICES_FILE)) {
  fs.writeJSONSync(SERVICES_FILE, [], { spaces: 2 });
  logOperation('初始化', { message: '创建了空的服务数据文件' });
}

// 读取所有服务
const getServices = async () => {
  try {
    const services = await fs.readJSON(SERVICES_FILE);
    logOperation('读取服务列表', { count: services.length });
    return services;
  } catch (error) {
    console.error('读取服务数据失败:', error);
    logOperation('读取服务列表失败', { error: String(error) });
    return [];
  }
};

// 获取单个服务
const getService = async (id) => {
  try {
    const services = await getServices();
    const service = services.find(service => service.id === id);
    logOperation('读取单个服务', { id, found: !!service });
    return service || null;
  } catch (error) {
    console.error(`获取服务 ${id} 失败:`, error);
    logOperation('读取单个服务失败', { id, error: String(error) });
    return null;
  }
};

// 添加新服务
const addService = async (serviceData) => {
  try {
    const services = await getServices();
    
    const newService = {
      ...serviceData,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    const updatedServices = [...services, newService];
    await fs.writeJSON(SERVICES_FILE, updatedServices, { spaces: 2 });
    
    logOperation('添加服务', { 
      id: newService.id, 
      name: newService.name,
      status: newService.status
    });
    
    return newService;
  } catch (error) {
    console.error('添加服务失败:', error);
    logOperation('添加服务失败', { 
      name: serviceData.name, 
      error: String(error) 
    });
    throw new Error('添加服务失败');
  }
};

// 更新服务
const updateService = async (id, serviceData) => {
  try {
    const services = await getServices();
    const serviceIndex = services.findIndex(service => service.id === id);
    
    if (serviceIndex === -1) {
      logOperation('更新服务失败', { id, reason: '服务不存在' });
      return null;
    }
    
    const updatedService = {
      ...services[serviceIndex],
      ...serviceData,
      updatedAt: new Date().toISOString(),
    };
    
    services[serviceIndex] = updatedService;
    await fs.writeJSON(SERVICES_FILE, services, { spaces: 2 });
    
    logOperation('更新服务', { 
      id, 
      name: updatedService.name,
      status: updatedService.status,
      fields: Object.keys(serviceData)
    });
    
    return updatedService;
  } catch (error) {
    console.error(`更新服务 ${id} 失败:`, error);
    logOperation('更新服务失败', { id, error: String(error) });
    throw new Error(`更新服务 ${id} 失败`);
  }
};

// 删除服务
const deleteService = async (id) => {
  try {
    const services = await getServices();
    const serviceToDelete = services.find(service => service.id === id);
    const updatedServices = services.filter(service => service.id !== id);
    
    if (updatedServices.length === services.length) {
      logOperation('删除服务失败', { id, reason: '服务不存在' });
      return false;
    }
    
    await fs.writeJSON(SERVICES_FILE, updatedServices, { spaces: 2 });
    
    logOperation('删除服务', { 
      id, 
      name: serviceToDelete?.name,
      status: serviceToDelete?.status
    });
    
    return true;
  } catch (error) {
    console.error(`删除服务 ${id} 失败:`, error);
    logOperation('删除服务失败', { id, error: String(error) });
    throw new Error(`删除服务 ${id} 失败`);
  }
};

// 更新服务状态
const updateServiceStatus = async (id, status) => {
  // 验证状态值
  if (!['online', 'offline', 'maintenance'].includes(status)) {
    logOperation('更新服务状态失败', { id, status, reason: '无效的状态值' });
    throw new Error('无效的状态值');
  }
  
  try {
    // 确保status是有效的枚举值
    const validStatus = status;
    const service = await getService(id);
    const oldStatus = service?.status;
    
    const updatedService = await updateService(id, { status: validStatus });
    
    if (updatedService) {
      logOperation('更新服务状态', { 
        id, 
        name: updatedService.name,
        oldStatus,
        newStatus: validStatus
      });
    }
    
    return updatedService;
  } catch (error) {
    console.error(`更新服务 ${id} 状态失败:`, error);
    logOperation('更新服务状态失败', { id, status, error: String(error) });
    throw error;
  }
};

module.exports = {
  getServices,
  getService,
  addService,
  updateService,
  deleteService,
  updateServiceStatus
}; 
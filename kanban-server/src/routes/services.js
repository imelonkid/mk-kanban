const express = require('express');
const { 
  getServices, 
  getService, 
  addService, 
  updateService, 
  deleteService, 
  updateServiceStatus 
} = require('../services/dataService');

const router = express.Router();

// 获取所有服务
router.get('/', async (req, res) => {
  try {
    const services = await getServices();
    res.json(services);
  } catch (error) {
    console.error('获取服务列表失败:', error);
    res.status(500).json({ error: '获取服务列表失败' });
  }
});

// 获取单个服务
router.get('/:id', async (req, res) => {
  try {
    const service = await getService(req.params.id);
    if (!service) {
      return res.status(404).json({ error: '服务不存在' });
    }
    res.json(service);
  } catch (error) {
    console.error(`获取服务 ${req.params.id} 失败:`, error);
    res.status(500).json({ error: `获取服务 ${req.params.id} 失败` });
  }
});

// 添加新服务
router.post('/', async (req, res) => {
  try {
    const serviceData = req.body;
    
    // 验证必填字段
    if (!serviceData.name || !serviceData.description || !serviceData.url || !serviceData.status) {
      return res.status(400).json({ error: '缺少必填字段' });
    }
    
    const newService = await addService(serviceData);
    res.status(201).json(newService);
  } catch (error) {
    console.error('添加服务失败:', error);
    res.status(500).json({ error: '添加服务失败' });
  }
});

// 更新服务
router.put('/:id', async (req, res) => {
  try {
    const serviceData = req.body;
    const updatedService = await updateService(req.params.id, serviceData);
    
    if (!updatedService) {
      return res.status(404).json({ error: '服务不存在' });
    }
    
    res.json(updatedService);
  } catch (error) {
    console.error(`更新服务 ${req.params.id} 失败:`, error);
    res.status(500).json({ error: `更新服务 ${req.params.id} 失败` });
  }
});

// 删除服务
router.delete('/:id', async (req, res) => {
  try {
    const success = await deleteService(req.params.id);
    
    if (!success) {
      return res.status(404).json({ error: '服务不存在' });
    }
    
    res.status(204).end();
  } catch (error) {
    console.error(`删除服务 ${req.params.id} 失败:`, error);
    res.status(500).json({ error: `删除服务 ${req.params.id} 失败` });
  }
});

// 更新服务状态
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status || !['online', 'offline', 'maintenance'].includes(status)) {
      return res.status(400).json({ error: '无效的状态值' });
    }
    
    // 确保status是有效的枚举值
    const validStatus = status;
    const updatedService = await updateServiceStatus(req.params.id, validStatus);
    
    if (!updatedService) {
      return res.status(404).json({ error: '服务不存在' });
    }
    
    res.json(updatedService);
  } catch (error) {
    console.error(`更新服务 ${req.params.id} 状态失败:`, error);
    res.status(500).json({ error: `更新服务 ${req.params.id} 状态失败` });
  }
});

module.exports = router; 
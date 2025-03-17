const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');
const servicesRouter = require('./routes/services');

// 创建Express应用
const app = express();
const PORT = process.env.BACKEND_PORT || process.env.PORT || 3001;

// 中间件
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// API路由
app.use('/api/services', servicesRouter);

// 添加根API路由
app.get('/api', (req, res) => {
  res.json({ 
    message: 'Papaya API 服务正常运行中',
    version: '1.0.0',
    endpoints: [
      '/api/services - 获取所有服务',
      '/api/services/:id - 获取单个服务',
      '/health - 健康检查'
    ],
    timestamp: new Date().toISOString()
  });
});

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 启动服务器
app.listen(PORT, '0.0.0.0', () => {
  console.log(`服务器运行在 http://0.0.0.0:${PORT}`);
  console.log(`API可在 http://0.0.0.0:${PORT}/api/services 访问`);
}); 
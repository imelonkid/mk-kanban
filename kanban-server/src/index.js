const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');
const servicesRouter = require('./routes/services');

// 创建Express应用
const app = express();
const PORT = process.env.BACKEND_PORT || process.env.PORT || 3001;

// 动态拼接前端域名和端口
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost';
const FRONTEND_PORT = process.env.FRONTEND_PORT || 3000;
const ALLOWED_ORIGIN = `${FRONTEND_URL}:${FRONTEND_PORT}`;

// 改进的CORS配置
app.use(cors({
  origin: ALLOWED_ORIGIN, // 允许的前端域名
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // 允许的HTTP方法
  allowedHeaders: ['Content-Type'], // 允许的请求头
  credentials: true // 允许跨域请求携带凭据
}));

// 其他中间件
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
  console.log(`已启用CORS，允许所有跨域请求`);
}); 
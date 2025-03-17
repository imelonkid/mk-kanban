const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');
const servicesRouter = require('./routes/services');

// 加载环境变量 - 指定路径
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
console.log('尝试加载环境变量，当前目录:', __dirname);
console.log('环境变量加载状态:', process.env.NEXT_PUBLIC_API_URL ? '成功' : '失败');

// 创建Express应用
const app = express();
const PORT = process.env.BACKEND_PORT || process.env.PORT || 3001;

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost';
console.log(`容许访问的前端地址 ${FRONTEND_URL}`);

// 简化CORS配置 - 允许所有来源
app.use(cors({
  origin: FRONTEND_URL, // 允许所有来源
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: true
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
  console.log(`环境变量: BACKEND_PORT=${process.env.BACKEND_PORT}, PORT=${process.env.FRONTEND_PORT}`);
}); 
# MK-Kanban 后端服务

MK-Kanban 服务管理看板的后端 API 服务，提供服务数据的管理和持久化存储。

## 功能特点

- 🔄 RESTful API：提供完整的服务管理 API
- 💾 文件系统存储：使用 JSON 文件持久化数据
- 📝 操作日志：记录所有数据操作
- 🔍 错误处理：提供详细的错误信息和状态码

## 技术栈

- **Express.js**: Node.js Web 应用框架
- **fs-extra**: 文件系统操作增强库
- **uuid**: 生成唯一标识符
- **cors**: 跨域资源共享中间件
- **morgan**: HTTP 请求日志中间件

## 项目结构

```
kanban-server/
├── src/              # 源代码
│   ├── index.js      # 应用入口
│   ├── routes/       # API 路由定义
│   │   └── services.js  # 服务相关路由
│   ├── services/     # 业务逻辑
│   │   └── dataService.js  # 数据操作服务
│   └── types/        # 类型定义
│       └── index.js  # 服务类型定义
├── data/             # 数据存储
│   ├── services.json # 服务数据
│   └── operations.log # 操作日志
└── package.json      # 项目配置
```

## API 接口

### 服务管理

- `GET /api/services` - 获取所有服务
- `GET /api/services/:id` - 获取单个服务
- `POST /api/services` - 添加新服务
- `PUT /api/services/:id` - 更新服务
- `DELETE /api/services/:id` - 删除服务
- `PATCH /api/services/:id/status` - 更新服务状态

### 健康检查

- `GET /health` - 服务健康状态检查

## 快速开始

### 前提条件

- Node.js (v18 或更高版本)
- npm 或 yarn

### 安装

```bash
# 安装依赖
npm install
```

### 运行

```bash
# 开发模式
npm run dev

# 生产模式
npm start
```

服务器默认在 http://localhost:3001 上运行。

## 数据模型

### 服务 (Service)

```typescript
{
  id: string;            // 唯一标识符
  name: string;          // 服务名称
  description: string;   // 服务描述
  url: string;           // 服务URL
  status: 'online' | 'offline' | 'maintenance';  // 服务状态
  icon?: string;         // 图标URL（可选）
  category?: string;     // 分类（可选）
  createdAt: string;     // 创建时间
  updatedAt: string;     // 更新时间
}
```

## 开发指南

### 添加新路由

1. 在 `src/routes` 目录下创建新的路由文件
2. 在 `src/index.js` 中注册路由

### 修改数据模型

1. 更新 `src/types/index.js` 中的类型定义
2. 相应地更新 `src/services/dataService.js` 中的数据操作函数

## 许可证

[MIT](../LICENSE) 
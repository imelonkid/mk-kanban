# MK-Papaya 个人服务治理工具

一个现代化的服务管理看板应用，用于监控和管理各种服务的状态和信息。

![服务管理看板](https://via.placeholder.com/800x400?text=MK-Kanban+服务管理看板)

## 功能特点

- 📋 服务管理：添加、编辑、删除和查看服务
- 🚦 状态监控：实时监控和更新服务状态（在线、离线、维护中）
- 🔍 搜索和过滤：根据名称、描述、分类和状态筛选服务
- 📱 响应式设计：适配桌面和移动设备
- 🌙 深色模式：支持明亮和暗黑主题
- 💾 数据持久化：所有数据安全存储在后端

## 技术栈

### 前端
- **Next.js**: React 框架，用于构建用户界面
- **TypeScript**: 类型安全的 JavaScript 超集
- **Tailwind CSS**: 实用优先的 CSS 框架
- **React Icons**: 图标库

### 后端
- **Express.js**: Node.js Web 应用框架
- **fs-extra**: 文件系统操作增强库
- **uuid**: 生成唯一标识符

## 项目结构

```
mk-kanban/
├── src/                  # 前端源代码
│   ├── app/              # Next.js 页面
│   ├── components/       # React 组件
│   ├── lib/              # 工具函数和 API 客户端
│   └── types/            # TypeScript 类型定义
├── kanban-server/        # 后端服务
│   ├── src/              # 后端源代码
│   │   ├── routes/       # API 路由
│   │   ├── services/     # 数据服务
│   │   └── types/        # 类型定义
│   └── data/             # 数据存储
└── public/               # 静态资源
```

## 快速开始

### 前提条件

- Node.js (v18 或更高版本)
- npm 或 yarn

### 安装

1. 克隆仓库
```bash
git clone https://github.com/yourusername/mk-kanban.git
cd mk-kanban
```

2. 安装前端依赖
```bash
npm install
```

3. 安装后端依赖
```bash
cd kanban-server
npm install
cd ..
```

### 运行

1. 启动后端服务
```bash
cd kanban-server
npm run dev
```

2. 在新的终端窗口中启动前端应用
```bash
npm run dev
```

3. 打开浏览器访问 http://localhost:3000

## API 接口

### 服务管理

- `GET /api/services` - 获取所有服务
- `GET /api/services/:id` - 获取单个服务
- `POST /api/services` - 添加新服务
- `PUT /api/services/:id` - 更新服务
- `DELETE /api/services/:id` - 删除服务
- `PATCH /api/services/:id/status` - 更新服务状态

## 使用指南

### 添加新服务

1. 点击首页右上角的"+"按钮
2. 填写服务信息（名称、描述、URL、状态等）
3. 点击"添加服务"按钮

### 更新服务状态

1. 导航到"状态"页面
2. 在服务列表中找到目标服务
3. 使用状态下拉菜单选择新状态（在线、离线、维护中）

### 编辑或删除服务

1. 点击服务卡片进入详情页面
2. 使用编辑按钮修改服务信息
3. 使用删除按钮移除服务

## 许可证

[MIT](LICENSE)

## 联系方式

如有问题或建议，请提交 issue 或联系 [your-email@example.com](mailto:your-email@example.com)

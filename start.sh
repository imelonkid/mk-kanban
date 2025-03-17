#!/bin/bash

# 定义颜色
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # 无颜色

echo -e "${GREEN}正在启动 Papaya 服务...${NC}"

# 加载环境变量
if [ -f .env ]; then
  echo -e "${GREEN}加载环境变量...${NC}"
  export $(grep -v '^#' .env | xargs)
fi

# 设置默认端口
FRONTEND_PORT=${PORT:-3000}
BACKEND_PORT=${BACKEND_PORT:-3001}

# 检查端口是否被占用的函数
check_port() {
  if command -v lsof >/dev/null 2>&1; then
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null 2>&1; then
      return 0
    else
      return 1
    fi
  elif command -v netstat >/dev/null 2>&1; then
    if netstat -tuln | grep ":$1 " >/dev/null 2>&1; then
      return 0
    else
      return 1
    fi
  elif command -v ss >/dev/null 2>&1; then
    if ss -tuln | grep ":$1 " >/dev/null 2>&1; then
      return 0
    else
      return 1
    fi
  else
    echo "警告: 未找到lsof、netstat或ss命令，无法检查端口"
    return 1
  fi
}

# 创建日志目录
mkdir -p logs

# 检查后端端口
if check_port $BACKEND_PORT; then
  echo -e "${YELLOW}警告: 端口 $BACKEND_PORT 已被占用，后端服务可能已经在运行${NC}"
else
  # 安装必要的依赖
  if ! command -v npm >/dev/null 2>&1; then
    echo -e "${YELLOW}警告: 未找到npm命令，请先安装Node.js${NC}"
    exit 1
  fi
  
  # 启动后端服务
  echo -e "${GREEN}启动后端服务...${NC}"
  cd kanban-server
  BACKEND_PORT=$BACKEND_PORT nohup npm run dev > ../logs/server.log 2>&1 &
  BACKEND_PID=$!
  echo $BACKEND_PID > ../logs/server.pid
  cd ..
  echo -e "${GREEN}后端服务已在后台启动 (PID: $BACKEND_PID)${NC}"
  
  # 等待后端服务启动
  echo -e "${GREEN}等待后端服务启动...${NC}"
  sleep 5
fi

# 检查前端端口
if check_port $FRONTEND_PORT; then
  echo -e "${YELLOW}警告: 端口 $FRONTEND_PORT 已被占用，前端服务可能已经在运行${NC}"
else
  # 启动前端服务
  echo -e "${GREEN}启动前端服务...${NC}"
  PORT=$FRONTEND_PORT NEXT_PUBLIC_API_URL=http://localhost:$BACKEND_PORT/api nohup npm run dev > logs/frontend.log 2>&1 &
  FRONTEND_PID=$!
  echo $FRONTEND_PID > logs/frontend.pid
  echo -e "${GREEN}前端服务已在后台启动 (PID: $FRONTEND_PID)${NC}"
fi

echo -e "${GREEN}所有服务已启动${NC}"
echo -e "${GREEN}前端访问地址: http://localhost:$FRONTEND_PORT${NC}"
echo -e "${GREEN}后端API地址: http://localhost:$BACKEND_PORT/api${NC}"
echo -e "${YELLOW}日志文件位于 logs/ 目录${NC}"
echo -e "${YELLOW}使用 ./stop.sh 停止所有服务${NC}" 
#!/bin/bash

# 定义颜色
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # 无颜色

echo -e "${GREEN}正在启动 Papaya 服务...${NC}"

# 检查端口是否被占用的函数
check_port() {
  if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
    return 0
  else
    return 1
  fi
}

# 检查后端端口
if check_port 3001; then
  echo -e "${YELLOW}警告: 端口 3001 已被占用，后端服务可能已经在运行${NC}"
else
  # 启动后端服务
  echo -e "${GREEN}启动后端服务...${NC}"
  cd kanban-server
  nohup npm run dev > ../logs/server.log 2>&1 &
  BACKEND_PID=$!
  echo $BACKEND_PID > ../logs/server.pid
  cd ..
  echo -e "${GREEN}后端服务已在后台启动 (PID: $BACKEND_PID)${NC}"
  
  # 等待后端服务启动
  echo -e "${GREEN}等待后端服务启动...${NC}"
  sleep 5
fi

# 检查前端端口
if check_port 3000; then
  echo -e "${YELLOW}警告: 端口 3000 已被占用，前端服务可能已经在运行${NC}"
else
  # 创建日志目录
  mkdir -p logs
  
  # 启动前端服务
  echo -e "${GREEN}启动前端服务...${NC}"
  nohup npm run dev > logs/frontend.log 2>&1 &
  FRONTEND_PID=$!
  echo $FRONTEND_PID > logs/frontend.pid
  echo -e "${GREEN}前端服务已在后台启动 (PID: $FRONTEND_PID)${NC}"
fi

echo -e "${GREEN}所有服务已启动${NC}"
echo -e "${GREEN}前端访问地址: http://localhost:3000${NC}"
echo -e "${GREEN}后端API地址: http://localhost:3001/api${NC}"
echo -e "${YELLOW}日志文件位于 logs/ 目录${NC}"
echo -e "${YELLOW}使用 ./stop.sh 停止所有服务${NC}" 
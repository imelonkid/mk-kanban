#!/bin/bash

# 定义颜色
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # 无颜色

echo -e "${YELLOW}正在停止 Papaya 服务...${NC}"

# 停止前端服务
if [ -f logs/frontend.pid ]; then
  FRONTEND_PID=$(cat logs/frontend.pid)
  if ps -p $FRONTEND_PID > /dev/null; then
    echo -e "${YELLOW}停止前端服务 (PID: $FRONTEND_PID)...${NC}"
    kill $FRONTEND_PID
    echo -e "${GREEN}前端服务已停止${NC}"
  else
    echo -e "${RED}前端服务 (PID: $FRONTEND_PID) 未运行${NC}"
  fi
  rm -f logs/frontend.pid
else
  echo -e "${RED}未找到前端服务PID文件${NC}"
fi

# 停止后端服务
if [ -f logs/server.pid ]; then
  BACKEND_PID=$(cat logs/server.pid)
  if ps -p $BACKEND_PID > /dev/null; then
    echo -e "${YELLOW}停止后端服务 (PID: $BACKEND_PID)...${NC}"
    kill $BACKEND_PID
    echo -e "${GREEN}后端服务已停止${NC}"
  else
    echo -e "${RED}后端服务 (PID: $BACKEND_PID) 未运行${NC}"
  fi
  rm -f logs/server.pid
else
  echo -e "${RED}未找到后端服务PID文件${NC}"
fi

# 检查是否有残留的Node进程
if command -v pgrep >/dev/null 2>&1; then
  NODE_PIDS=$(pgrep -f "node.*npm run dev" 2>/dev/null)
elif command -v ps >/dev/null 2>&1; then
  NODE_PIDS=$(ps aux | grep "node.*npm run dev" | grep -v grep | awk '{print $2}')
else
  NODE_PIDS=""
  echo -e "${RED}无法检查残留进程，未找到pgrep或ps命令${NC}"
fi

if [ ! -z "$NODE_PIDS" ]; then
  echo -e "${YELLOW}发现可能的残留Node进程:${NC}"
  for pid in $NODE_PIDS; do
    if command -v ps >/dev/null 2>&1; then
      ps -p $pid -o pid,cmd 2>/dev/null || ps $pid 2>/dev/null
    else
      echo "PID: $pid"
    fi
  done
  
  echo -e "${YELLOW}是否要终止这些进程? (y/n)${NC}"
  read -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    for pid in $NODE_PIDS; do
      echo -e "${YELLOW}终止进程 $pid...${NC}"
      kill $pid 2>/dev/null
    done
    echo -e "${GREEN}所有Node进程已终止${NC}"
  fi
fi

echo -e "${GREEN}所有服务已停止${NC}" 
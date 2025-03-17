#!/bin/bash

# 定义颜色
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # 无颜色

echo -e "${BLUE}Papaya 服务状态检查${NC}"
echo "----------------------------------------"

# 检查端口是否被占用的函数
check_port() {
  if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
    return 0
  else
    return 1
  fi
}

# 检查前端服务
echo -e "${BLUE}前端服务:${NC}"
if [ -f logs/frontend.pid ]; then
  FRONTEND_PID=$(cat logs/frontend.pid)
  if ps -p $FRONTEND_PID > /dev/null; then
    echo -e "  状态: ${GREEN}运行中${NC} (PID: $FRONTEND_PID)"
    
    if check_port 3000; then
      echo -e "  端口: ${GREEN}3000 (可访问)${NC}"
      echo -e "  URL: ${GREEN}http://localhost:3000${NC}"
    else
      echo -e "  端口: ${RED}3000 (无法访问)${NC}"
    fi
    
    # 显示运行时间
    FRONTEND_START=$(ps -p $FRONTEND_PID -o lstart=)
    echo -e "  启动时间: $FRONTEND_START"
    
    # 显示日志文件最后几行
    if [ -f logs/frontend.log ]; then
      echo -e "  最近日志:"
      echo -e "${YELLOW}$(tail -n 3 logs/frontend.log)${NC}"
    fi
  else
    echo -e "  状态: ${RED}未运行${NC} (PID: $FRONTEND_PID 不存在)"
  fi
else
  echo -e "  状态: ${RED}未启动${NC} (未找到PID文件)"
  
  # 检查端口是否被其他进程占用
  if check_port 3000; then
    PORT_PID=$(lsof -Pi :3000 -sTCP:LISTEN -t)
    echo -e "  警告: ${YELLOW}端口 3000 被进程 $PORT_PID 占用${NC}"
  fi
fi

echo "----------------------------------------"

# 检查后端服务
echo -e "${BLUE}后端服务:${NC}"
if [ -f logs/server.pid ]; then
  BACKEND_PID=$(cat logs/server.pid)
  if ps -p $BACKEND_PID > /dev/null; then
    echo -e "  状态: ${GREEN}运行中${NC} (PID: $BACKEND_PID)"
    
    if check_port 3001; then
      echo -e "  端口: ${GREEN}3001 (可访问)${NC}"
      echo -e "  API: ${GREEN}http://localhost:3001/api${NC}"
      
      # 测试API健康状态
      if curl -s http://localhost:3001/health > /dev/null; then
        echo -e "  健康检查: ${GREEN}通过${NC}"
      else
        echo -e "  健康检查: ${RED}失败${NC}"
      fi
    else
      echo -e "  端口: ${RED}3001 (无法访问)${NC}"
    fi
    
    # 显示运行时间
    BACKEND_START=$(ps -p $BACKEND_PID -o lstart=)
    echo -e "  启动时间: $BACKEND_START"
    
    # 显示日志文件最后几行
    if [ -f logs/server.log ]; then
      echo -e "  最近日志:"
      echo -e "${YELLOW}$(tail -n 3 logs/server.log)${NC}"
    fi
  else
    echo -e "  状态: ${RED}未运行${NC} (PID: $BACKEND_PID 不存在)"
  fi
else
  echo -e "  状态: ${RED}未启动${NC} (未找到PID文件)"
  
  # 检查端口是否被其他进程占用
  if check_port 3001; then
    PORT_PID=$(lsof -Pi :3001 -sTCP:LISTEN -t)
    echo -e "  警告: ${YELLOW}端口 3001 被进程 $PORT_PID 占用${NC}"
  fi
fi

echo "----------------------------------------"
echo -e "${BLUE}系统资源使用情况:${NC}"
echo -e "  CPU使用率: $(top -bn1 | grep "Cpu(s)" | awk '{print $2}')%"
echo -e "  内存使用率: $(free -m | awk 'NR==2{printf "%.2f%%", $3*100/$2}')"
echo -e "  磁盘使用率: $(df -h | awk '$NF=="/"{printf "%s", $5}')"

echo "----------------------------------------"
echo -e "${BLUE}可用命令:${NC}"
echo -e "  ${GREEN}./start.sh${NC} - 启动所有服务"
echo -e "  ${GREEN}./stop.sh${NC} - 停止所有服务"
echo -e "  ${GREEN}./status.sh${NC} - 查看服务状态" 
#!/bin/bash

# 定义颜色
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # 无颜色

echo -e "${BLUE}Papaya 服务状态检查${NC}"
echo "----------------------------------------"

# 加载环境变量
if [ -f .env ]; then
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

# 获取进程ID的函数
get_port_pid() {
  if command -v lsof >/dev/null 2>&1; then
    lsof -Pi :$1 -sTCP:LISTEN -t 2>/dev/null
  elif command -v netstat >/dev/null 2>&1; then
    netstat -tuln | grep ":$1 " | awk '{print $7}' | cut -d'/' -f1
  elif command -v ss >/dev/null 2>&1; then
    ss -tuln | grep ":$1 " | awk '{print $7}' | cut -d',' -f2 | cut -d'=' -f2
  else
    echo "未知"
  fi
}

# 检查前端服务
echo -e "${BLUE}前端服务:${NC}"
if [ -f logs/frontend.pid ]; then
  FRONTEND_PID=$(cat logs/frontend.pid)
  if ps -p $FRONTEND_PID > /dev/null; then
    echo -e "  状态: ${GREEN}运行中${NC} (PID: $FRONTEND_PID)"
    
    if check_port $FRONTEND_PORT; then
      echo -e "  端口: ${GREEN}$FRONTEND_PORT (可访问)${NC}"
      echo -e "  URL: ${GREEN}http://localhost:$FRONTEND_PORT${NC}"
    else
      echo -e "  端口: ${RED}$FRONTEND_PORT (无法访问)${NC}"
    fi
    
    # 显示运行时间
    FRONTEND_START=$(ps -p $FRONTEND_PID -o lstart= 2>/dev/null || ps -p $FRONTEND_PID -o start= 2>/dev/null)
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
  if check_port $FRONTEND_PORT; then
    PORT_PID=$(get_port_pid $FRONTEND_PORT)
    echo -e "  警告: ${YELLOW}端口 $FRONTEND_PORT 被进程 $PORT_PID 占用${NC}"
  fi
fi

echo "----------------------------------------"

# 检查后端服务
echo -e "${BLUE}后端服务:${NC}"
if [ -f logs/server.pid ]; then
  BACKEND_PID=$(cat logs/server.pid)
  if ps -p $BACKEND_PID > /dev/null; then
    echo -e "  状态: ${GREEN}运行中${NC} (PID: $BACKEND_PID)"
    
    if check_port $BACKEND_PORT; then
      echo -e "  端口: ${GREEN}$BACKEND_PORT (可访问)${NC}"
      echo -e "  API: ${GREEN}http://localhost:$BACKEND_PORT/api${NC}"
      
      # 测试API健康状态
      if command -v curl >/dev/null 2>&1; then
        if curl -s http://localhost:$BACKEND_PORT/health > /dev/null 2>&1; then
          echo -e "  健康检查: ${GREEN}通过${NC}"
        else
          echo -e "  健康检查: ${RED}失败${NC}"
        fi
      else
        echo -e "  健康检查: ${YELLOW}跳过 (未找到curl命令)${NC}"
      fi
    else
      echo -e "  端口: ${RED}$BACKEND_PORT (无法访问)${NC}"
    fi
    
    # 显示运行时间
    BACKEND_START=$(ps -p $BACKEND_PID -o lstart= 2>/dev/null || ps -p $BACKEND_PID -o start= 2>/dev/null)
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
  if check_port $BACKEND_PORT; then
    PORT_PID=$(get_port_pid $BACKEND_PORT)
    echo -e "  警告: ${YELLOW}端口 $BACKEND_PORT 被进程 $PORT_PID 占用${NC}"
  fi
fi

echo "----------------------------------------"
echo -e "${BLUE}系统资源使用情况:${NC}"

# 检查CPU使用率
if command -v top >/dev/null 2>&1; then
  if top -b -n 1 >/dev/null 2>&1; then
    CPU_USAGE=$(top -b -n 1 | grep "Cpu(s)" | awk '{print $2}')
    echo -e "  CPU使用率: ${CPU_USAGE}%"
  else
    CPU_USAGE=$(ps -eo pcpu | grep -v "%CPU" | sort -r | head -1)
    echo -e "  CPU使用率: 约${CPU_USAGE}% (最高进程)"
  fi
else
  echo -e "  CPU使用率: ${YELLOW}无法获取 (未找到top命令)${NC}"
fi

# 检查内存使用率
if command -v free >/dev/null 2>&1; then
  MEM_USAGE=$(free -m | awk 'NR==2{printf "%.2f%%", $3*100/$2}')
  echo -e "  内存使用率: ${MEM_USAGE}"
else
  MEM_TOTAL=$(grep MemTotal /proc/meminfo | awk '{print $2}')
  MEM_FREE=$(grep MemFree /proc/meminfo | awk '{print $2}')
  MEM_USAGE=$(awk "BEGIN {printf \"%.2f%%\", ($MEM_TOTAL-$MEM_FREE)*100/$MEM_TOTAL}")
  echo -e "  内存使用率: ${MEM_USAGE}"
fi

# 检查磁盘使用率
if command -v df >/dev/null 2>&1; then
  DISK_USAGE=$(df -h | awk '$NF=="/"{printf "%s", $5}')
  echo -e "  磁盘使用率: ${DISK_USAGE}"
else
  echo -e "  磁盘使用率: ${YELLOW}无法获取 (未找到df命令)${NC}"
fi

echo "----------------------------------------"
echo -e "${BLUE}环境配置:${NC}"
echo -e "  前端端口: ${FRONTEND_PORT}"
echo -e "  后端端口: ${BACKEND_PORT}"
echo -e "  API地址: ${NEXT_PUBLIC_API_URL:-http://localhost:$BACKEND_PORT/api}"

echo "----------------------------------------"
echo -e "${BLUE}可用命令:${NC}"
echo -e "  ${GREEN}./start.sh${NC} - 启动所有服务"
echo -e "  ${GREEN}./stop.sh${NC} - 停止所有服务"
echo -e "  ${GREEN}./status.sh${NC} - 查看服务状态" 
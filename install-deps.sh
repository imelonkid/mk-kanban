#!/bin/bash

# 定义颜色
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # 无颜色

echo -e "${GREEN}正在安装 Papaya 服务所需的依赖...${NC}"

# 检查是否为root用户
if [ "$(id -u)" != "0" ]; then
   echo -e "${RED}此脚本需要root权限，请使用sudo运行${NC}"
   exit 1
fi

# 检测系统类型
if [ -f /etc/redhat-release ]; then
    # CentOS/RHEL系统
    echo -e "${GREEN}检测到CentOS/RHEL系统${NC}"
    
    # 安装基本工具
    echo -e "${GREEN}安装基本工具...${NC}"
    yum update -y
    yum install -y curl wget lsof net-tools epel-release
    
    # 安装Node.js
    if ! command -v node >/dev/null 2>&1; then
        echo -e "${GREEN}安装Node.js...${NC}"
        curl -sL https://rpm.nodesource.com/setup_18.x | bash -
        yum install -y nodejs
    else
        echo -e "${YELLOW}Node.js已安装，版本: $(node -v)${NC}"
    fi
    
elif [ -f /etc/debian_version ]; then
    # Debian/Ubuntu系统
    echo -e "${GREEN}检测到Debian/Ubuntu系统${NC}"
    
    # 安装基本工具
    echo -e "${GREEN}安装基本工具...${NC}"
    apt-get update
    apt-get install -y curl wget lsof net-tools
    
    # 安装Node.js
    if ! command -v node >/dev/null 2>&1; then
        echo -e "${GREEN}安装Node.js...${NC}"
        curl -sL https://deb.nodesource.com/setup_18.x | bash -
        apt-get install -y nodejs
    else
        echo -e "${YELLOW}Node.js已安装，版本: $(node -v)${NC}"
    fi
    
else
    echo -e "${RED}不支持的系统类型${NC}"
    exit 1
fi

# 检查Node.js和npm是否安装成功
if command -v node >/dev/null 2>&1; then
    echo -e "${GREEN}Node.js安装成功，版本: $(node -v)${NC}"
else
    echo -e "${RED}Node.js安装失败${NC}"
    exit 1
fi

if command -v npm >/dev/null 2>&1; then
    echo -e "${GREEN}npm安装成功，版本: $(npm -v)${NC}"
else
    echo -e "${RED}npm安装失败${NC}"
    exit 1
fi

# 安装项目依赖
echo -e "${GREEN}安装项目依赖...${NC}"
cd "$(dirname "$0")"

echo -e "${GREEN}安装前端依赖...${NC}"
npm install

echo -e "${GREEN}安装后端依赖...${NC}"
cd kanban-server
npm install
cd ..

# 设置脚本执行权限
echo -e "${GREEN}设置脚本执行权限...${NC}"
chmod +x start.sh stop.sh status.sh

echo -e "${GREEN}所有依赖安装完成!${NC}"
echo -e "${GREEN}现在可以使用 ./start.sh 启动服务了${NC}" 
#!/bin/bash

# DefendSphere Quick Start Script
# Быстрый запуск проекта

set -e

# Цвета для вывода
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Переменные
PROJECT_NAME="DefendSphere"
FRONTEND_PORT=3000
BACKEND_PORT=5000
REDIS_PORT=6379

# Функция для вывода сообщений
print_message() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}  $PROJECT_NAME Quick Start${NC}"
    echo -e "${BLUE}================================${NC}"
}

# Проверка зависимостей
check_dependencies() {
    print_message "Проверка зависимостей..."
    
    # Проверка Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js не установлен. Установите Node.js 18+"
        exit 1
    fi
    
    # Проверка npm
    if ! command -v npm &> /dev/null; then
        print_error "npm не установлен"
        exit 1
    fi
    
    # Проверка Docker
    if ! command -v docker &> /dev/null; then
        print_warning "Docker не установлен. Будет использован локальный Redis"
    fi
    
    # Проверка Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        print_warning "Docker Compose не установлен"
    fi
    
    print_message "Все зависимости проверены"
}

# Установка зависимостей
install_dependencies() {
    print_message "Установка зависимостей..."
    
    # Frontend зависимости
    if [ ! -d "node_modules" ]; then
        print_message "Установка frontend зависимостей..."
        npm install
    fi
    
    # Backend зависимости
    if [ ! -d "backend/node_modules" ]; then
        print_message "Установка backend зависимостей..."
        cd backend && npm install && cd ..
    fi
    
    # Scripts зависимости
    if [ ! -d "scripts/node_modules" ]; then
        print_message "Установка scripts зависимостей..."
        cd scripts && npm install && cd ..
    fi
    
    print_message "Зависимости установлены"
}

# Инициализация Redis
init_redis() {
    print_message "Инициализация Redis..."
    
    if command -v docker &> /dev/null && command -v docker-compose &> /dev/null; then
        # Использование Docker
        print_message "Запуск Redis в Docker..."
        docker-compose up -d redis
        
        # Ожидание запуска Redis
        print_message "Ожидание запуска Redis..."
        sleep 5
        
        # Проверка Redis
        if docker exec defendsphere-redis-1 redis-cli ping | grep -q "PONG"; then
            print_message "Redis запущен в Docker"
        else
            print_error "Ошибка запуска Redis в Docker"
            exit 1
        fi
    else
        # Использование локального Redis
        print_message "Проверка локального Redis..."
        if ! redis-cli -p $REDIS_PORT ping &> /dev/null; then
            print_warning "Локальный Redis не запущен. Запустите: redis-server --port $REDIS_PORT"
            print_message "Или установите Docker для автоматического запуска"
            exit 1
        fi
    fi
    
    # Инициализация данных
    print_message "Инициализация данных по умолчанию..."
    cd scripts && npm run init && cd ..
    
    print_message "Redis инициализирован"
}

# Запуск backend
start_backend() {
    print_message "Запуск backend сервера..."
    
    # Создание .env файла если не существует
    if [ ! -f ".env" ]; then
        print_message "Создание .env файла..."
        cp .env.example .env
        print_warning "Отредактируйте .env файл при необходимости"
    fi
    
    # Запуск backend в фоне
    cd backend && npm run dev > ../backend.log 2>&1 &
    BACKEND_PID=$!
    cd ..
    
    # Ожидание запуска backend
    print_message "Ожидание запуска backend..."
    sleep 3
    
    # Проверка backend
    if curl -s http://localhost:$BACKEND_PORT/api/health &> /dev/null; then
        print_message "Backend запущен (PID: $BACKEND_PID)"
    else
        print_error "Ошибка запуска backend"
        exit 1
    fi
}

# Запуск frontend
start_frontend() {
    print_message "Запуск frontend..."
    
    # Запуск frontend в фоне
    npm run dev > frontend.log 2>&1 &
    FRONTEND_PID=$!
    
    # Ожидание запуска frontend
    print_message "Ожидание запуска frontend..."
    sleep 5
    
    # Проверка frontend
    if curl -s http://localhost:$FRONTEND_PORT &> /dev/null; then
        print_message "Frontend запущен (PID: $FRONTEND_PID)"
    else
        print_error "Ошибка запуска frontend"
        exit 1
    fi
}

# Показ информации
show_info() {
    echo ""
    echo -e "${BLUE}================================${NC}"
    echo -e "${GREEN}🎉 $PROJECT_NAME успешно запущен!${NC}"
    echo -e "${BLUE}================================${NC}"
    echo ""
    echo -e "${YELLOW}Доступные URL:${NC}"
    echo -e "  Frontend:     ${GREEN}http://localhost:$FRONTEND_PORT${NC}"
    echo -e "  Backend API:  ${GREEN}http://localhost:$BACKEND_PORT${NC}"
    echo -e "  Admin Panel:  ${GREEN}http://localhost:$FRONTEND_PORT/admin${NC}"
    echo ""
    echo -e "${YELLOW}Тестовые пользователи:${NC}"
    echo -e "  Admin:        ${GREEN}admin / admin${NC}"
    echo -e "  User 1:       ${GREEN}user1 / user1${NC}"
    echo -e "  User 2:       ${GREEN}user2 / user2${NC}"
    echo ""
    echo -e "${YELLOW}Управление:${NC}"
    echo -e "  Остановка:    ${GREEN}make stop${NC} или ${GREEN}Ctrl+C${NC}"
    echo -e "  Логи:         ${GREEN}make logs${NC}"
    echo -e "  Статус:       ${GREEN}make status${NC}"
    echo ""
    echo -e "${BLUE}================================${NC}"
}

# Обработка сигналов
cleanup() {
    print_message "Остановка сервисов..."
    
    # Остановка frontend
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null || true
    fi
    
    # Остановка backend
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null || true
    fi
    
    # Остановка Docker контейнеров
    if command -v docker-compose &> /dev/null; then
        docker-compose down 2>/dev/null || true
    fi
    
    print_message "Сервисы остановлены"
    exit 0
}

# Установка обработчиков сигналов
trap cleanup SIGINT SIGTERM

# Главная функция
main() {
    print_header
    
    check_dependencies
    install_dependencies
    init_redis
    start_backend
    start_frontend
    show_info
    
    # Ожидание сигнала завершения
    print_message "Нажмите Ctrl+C для остановки..."
    wait
}

# Запуск скрипта
main "$@"
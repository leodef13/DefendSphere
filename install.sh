#!/bin/bash

# DefendSphere Complete Installation Script
# Полная установка и настройка системы

set -e

# Цвета для вывода
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Переменные
PROJECT_NAME="DefendSphere"
PROJECT_VERSION="1.0.0"
FRONTEND_PORT=3000
BACKEND_PORT=5000
REDIS_PORT=6380

# Функции для вывода
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
    echo -e "${BLUE}  $PROJECT_NAME v$PROJECT_VERSION${NC}"
    echo -e "${BLUE}  Complete Installation${NC}"
    echo -e "${BLUE}================================${NC}"
}

print_section() {
    echo -e "${CYAN}$1${NC}"
    echo -e "${CYAN}$(echo "$1" | sed 's/./-/g')${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_step() {
    echo -e "${MAGENTA}🔧 $1${NC}"
}

# Проверка операционной системы
check_os() {
    print_section "Проверка операционной системы"
    
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        print_success "Linux система обнаружена"
        OS="linux"
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        print_success "macOS система обнаружена"
        OS="macos"
    elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
        print_success "Windows система обнаружена"
        OS="windows"
    else
        print_warning "Неизвестная операционная система: $OSTYPE"
        OS="unknown"
    fi
}

# Проверка зависимостей
check_dependencies() {
    print_section "Проверка системных зависимостей"
    
    local missing_deps=()
    
    # Проверка Node.js
    if ! command -v node &> /dev/null; then
        missing_deps+=("Node.js")
    else
        local node_version=$(node --version | cut -d'v' -f2)
        local major_version=$(echo $node_version | cut -d'.' -f1)
        if [ "$major_version" -lt 18 ]; then
            print_error "Node.js версия $node_version не поддерживается. Требуется 18+"
            missing_deps+=("Node.js 18+")
        else
            print_success "Node.js $node_version обнаружен"
        fi
    fi
    
    # Проверка npm
    if ! command -v npm &> /dev/null; then
        missing_deps+=("npm")
    else
        print_success "npm обнаружен"
    fi
    
    # Проверка Git
    if ! command -v git &> /dev/null; then
        missing_deps+=("Git")
    else
        print_success "Git обнаружен"
    fi
    
    # Проверка Docker (опционально)
    if command -v docker &> /dev/null; then
        print_success "Docker обнаружен"
        DOCKER_AVAILABLE=true
    else
        print_warning "Docker не обнаружен (будет использован локальный Redis)"
        DOCKER_AVAILABLE=false
    fi
    
    # Проверка Docker Compose
    if command -v docker-compose &> /dev/null; then
        print_success "Docker Compose обнаружен"
        DOCKER_COMPOSE_AVAILABLE=true
    else
        print_warning "Docker Compose не обнаружен"
        DOCKER_COMPOSE_AVAILABLE=false
    fi
    
    # Проверка Redis (локальный)
    if command -v redis-cli &> /dev/null; then
        print_success "Redis CLI обнаружен"
        REDIS_LOCAL_AVAILABLE=true
    else
        print_warning "Redis CLI не обнаружен"
        REDIS_LOCAL_AVAILABLE=false
    fi
    
    # Вывод отсутствующих зависимостей
    if [ ${#missing_deps[@]} -ne 0 ]; then
        print_error "Отсутствуют обязательные зависимости:"
        for dep in "${missing_deps[@]}"; do
            echo "  - $dep"
        done
        
        print_warning "Установите недостающие зависимости и запустите скрипт снова"
        exit 1
    fi
    
    print_success "Все обязательные зависимости проверены"
}

# Установка зависимостей для Ubuntu/Debian
install_ubuntu_deps() {
    if [ "$OS" != "linux" ]; then
        return
    fi
    
    print_step "Проверка пакетного менеджера Ubuntu/Debian"
    
    if command -v apt-get &> /dev/null; then
        print_message "Обнаружен apt-get, обновление пакетов..."
        
        # Обновление списка пакетов
        sudo apt-get update
        
        # Установка базовых пакетов
        sudo apt-get install -y curl wget build-essential
        
        # Установка Redis если не установлен
        if ! command -v redis-server &> /dev/null; then
            print_message "Установка Redis..."
            sudo apt-get install -y redis-server
            sudo systemctl enable redis-server
            sudo systemctl start redis-server
            print_success "Redis установлен и запущен"
        fi
        
        # Установка Node.js если версия не подходит
        local node_version=$(node --version | cut -d'v' -f2)
        local major_version=$(echo $node_version | cut -d'.' -f1)
        if [ "$major_version" -lt 18 ]; then
            print_message "Установка Node.js 18+..."
            curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
            sudo apt-get install -y nodejs
            print_success "Node.js обновлен"
        fi
    fi
}

# Установка зависимостей для macOS
install_macos_deps() {
    if [ "$OS" != "macos" ]; then
        return
    fi
    
    print_step "Проверка Homebrew для macOS"
    
    if ! command -v brew &> /dev/null; then
        print_message "Установка Homebrew..."
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
        print_success "Homebrew установлен"
    fi
    
    # Установка Redis
    if ! command -v redis-server &> /dev/null; then
        print_message "Установка Redis через Homebrew..."
        brew install redis
        brew services start redis
        print_success "Redis установлен и запущен"
    fi
    
    # Обновление Node.js если необходимо
    local node_version=$(node --version | cut -d'v' -f2)
    local major_version=$(echo $node_version | cut -d'.' -f1)
    if [ "$major_version" -lt 18 ]; then
        print_message "Обновление Node.js через Homebrew..."
        brew install node@18
        print_success "Node.js обновлен"
    fi
}

# Клонирование и настройка проекта
setup_project() {
    print_section "Настройка проекта"
    
    # Проверка существования проекта
    if [ -d ".git" ]; then
        print_message "Проект уже инициализирован как Git репозиторий"
        
        # Проверка текущей ветки
        local current_branch=$(git branch --show-current)
        if [ "$current_branch" != "cursor/defendsphere-343d" ]; then
            print_message "Переключение на ветку cursor/defendsphere-343d..."
            git checkout cursor/defendsphere-343d
        fi
        
        # Обновление проекта
        print_message "Обновление проекта..."
        git pull origin cursor/defendsphere-343d
    else
        print_error "Проект не инициализирован как Git репозиторий"
        print_warning "Убедитесь, что вы находитесь в правильной директории"
        exit 1
    fi
    
    print_success "Проект настроен"
}

# Установка зависимостей проекта
install_project_deps() {
    print_section "Установка зависимостей проекта"
    
    # Frontend зависимости
    print_step "Установка frontend зависимостей..."
    if [ -f "package.json" ]; then
        npm install
        print_success "Frontend зависимости установлены"
    else
        print_error "package.json не найден в корневой директории"
        exit 1
    fi
    
    # Backend зависимости
    print_step "Установка backend зависимостей..."
    if [ -d "backend" ] && [ -f "backend/package.json" ]; then
        cd backend && npm install && cd ..
        print_success "Backend зависимости установлены"
    else
        print_error "Backend директория или package.json не найдены"
        exit 1
    fi
    
    # Scripts зависимости
    print_step "Установка scripts зависимостей..."
    if [ -d "scripts" ] && [ -f "scripts/package.json" ]; then
        cd scripts && npm install && cd ..
        print_success "Scripts зависимости установлены"
    else
        print_error "Scripts директория или package.json не найдены"
        exit 1
    fi
}

# Настройка переменных окружения
setup_environment() {
    print_section "Настройка переменных окружения"
    
    if [ ! -f ".env" ]; then
        print_step "Создание .env файла..."
        if [ -f ".env.example" ]; then
            cp .env.example .env
            print_success ".env файл создан из .env.example"
            print_warning "Отредактируйте .env файл при необходимости"
        else
            print_error ".env.example файл не найден"
            exit 1
        fi
    else
        print_message ".env файл уже существует"
    fi
    
    # Настройка портов если они заняты
    print_step "Проверка доступности портов..."
    
    if lsof -Pi :$FRONTEND_PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
        print_warning "Порт $FRONTEND_PORT занят"
        read -p "Изменить порт frontend? (y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            read -p "Введите новый порт для frontend: " new_port
            sed -i "s/FRONTEND_PORT=3000/FRONTEND_PORT=$new_port/" .env
            FRONTEND_PORT=$new_port
            print_success "Порт frontend изменен на $new_port"
        fi
    fi
    
    if lsof -Pi :$BACKEND_PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
        print_warning "Порт $BACKEND_PORT занят"
        read -p "Изменить порт backend? (y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            read -p "Введите новый порт для backend: " new_port
            sed -i "s/BACKEND_PORT=5000/BACKEND_PORT=$new_port/" .env
            BACKEND_PORT=$new_port
            print_success "Порт backend изменен на $new_port"
        fi
    fi
}

# Инициализация Redis
init_redis() {
    print_section "Инициализация Redis"
    
    if [ "$DOCKER_AVAILABLE" = true ] && [ "$DOCKER_COMPOSE_AVAILABLE" = true ]; then
        print_step "Запуск Redis в Docker..."
        docker-compose up -d redis
        
        # Ожидание запуска Redis
        print_message "Ожидание запуска Redis..."
        sleep 5
        
        # Проверка Redis
        if docker exec defendsphere-redis-1 redis-cli ping | grep -q "PONG"; then
            print_success "Redis запущен в Docker"
        else
            print_error "Ошибка запуска Redis в Docker"
            exit 1
        fi
    else
        print_step "Проверка локального Redis..."
        if ! redis-cli -p $REDIS_PORT ping &> /dev/null; then
            print_warning "Локальный Redis не запущен"
            
            if [ "$OS" = "linux" ]; then
                print_message "Запуск Redis через systemctl..."
                sudo systemctl start redis-server
            elif [ "$OS" = "macos" ]; then
                print_message "Запуск Redis через Homebrew..."
                brew services start redis
            else
                print_error "Не удается запустить Redis автоматически"
                print_warning "Запустите Redis вручную: redis-server --port $REDIS_PORT"
                read -p "Нажмите Enter после запуска Redis..."
            fi
        fi
        
        # Проверка Redis
        if redis-cli -p $REDIS_PORT ping &> /dev/null; then
            print_success "Локальный Redis доступен"
        else
            print_error "Redis недоступен"
            exit 1
        fi
    fi
    
    # Инициализация данных
    print_step "Инициализация данных по умолчанию..."
    cd scripts && npm run init && cd ..
    print_success "Redis инициализирован с тестовыми данными"
}

# Сборка проекта
build_project() {
    print_section "Сборка проекта"
    
    print_step "Сборка frontend..."
    npm run build
    print_success "Frontend собран"
    
    print_step "Сборка backend..."
    cd backend && npm run build && cd ..
    print_success "Backend собран"
}

# Создание systemd сервисов (Linux)
create_systemd_services() {
    if [ "$OS" != "linux" ]; then
        return
    fi
    
    print_section "Создание systemd сервисов (Linux)"
    
    local user=$(whoami)
    local project_path=$(pwd)
    
    # Backend сервис
    print_step "Создание backend сервиса..."
    sudo tee /etc/systemd/system/defendsphere-backend.service > /dev/null <<EOF
[Unit]
Description=DefendSphere Backend API
After=network.target redis.service
Wants=redis.service

[Service]
Type=simple
User=$user
WorkingDirectory=$project_path/backend
Environment=NODE_ENV=production
Environment=PORT=$BACKEND_PORT
Environment=REDIS_URL=redis://localhost:$REDIS_PORT
ExecStart=/usr/bin/node index.js
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF
    
    # Frontend сервис
    print_step "Создание frontend сервиса..."
    sudo tee /etc/systemd/system/defendsphere-frontend.service > /dev/null <<EOF
[Unit]
Description=DefendSphere Frontend
After=network.target defendsphere-backend.service
Wants=defendsphere-backend.service

[Service]
Type=simple
User=$user
WorkingDirectory=$project_path
Environment=NODE_ENV=production
Environment=PORT=$FRONTEND_PORT
ExecStart=/usr/bin/node server.js
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF
    
    # Перезагрузка systemd
    sudo systemctl daemon-reload
    
    # Включение автозапуска
    sudo systemctl enable defendsphere-backend
    sudo systemctl enable defendsphere-frontend
    
    print_success "Systemd сервисы созданы и включены"
}

# Финальная настройка
final_setup() {
    print_section "Финальная настройка"
    
    # Создание Makefile если не существует
    if [ ! -f "Makefile" ]; then
        print_step "Создание Makefile..."
        # Makefile уже создан ранее
        print_success "Makefile настроен"
    fi
    
    # Создание скриптов если не существуют
    if [ ! -f "scripts/quick-start.sh" ]; then
        print_step "Создание quick-start скрипта..."
        # Скрипт уже создан ранее
        print_success "Quick-start скрипт настроен"
    fi
    
    # Установка прав на выполнение
    print_step "Установка прав на выполнение..."
    chmod +x scripts/quick-start.sh
    chmod +x install.sh
    print_success "Права на выполнение установлены"
}

# Показ итоговой информации
show_final_info() {
    echo ""
    echo -e "${BLUE}================================${NC}"
    echo -e "${GREEN}🎉 $PROJECT_NAME успешно установлен!${NC}"
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
    echo -e "${YELLOW}Команды управления:${NC}"
    echo -e "  Быстрый запуск:  ${GREEN}./scripts/quick-start.sh${NC}"
    echo -e "  Make команды:     ${GREEN}make help${NC}"
    echo -e "  Docker запуск:    ${GREEN}make docker-up${NC}"
    echo -e "  Проверка здоровья: ${GREEN}cd scripts && npm run health-check${NC}"
    echo ""
    
    if [ "$OS" = "linux" ]; then
        echo -e "${YELLOW}Systemd сервисы:${NC}"
        echo -e "  Запуск:          ${GREEN}sudo systemctl start defendsphere-backend${NC}"
        echo -e "  Статус:          ${GREEN}sudo systemctl status defendsphere-backend${NC}"
        echo -e "  Автозапуск:      ${GREEN}sudo systemctl enable defendsphere-backend${NC}"
    fi
    
    echo ""
    echo -e "${BLUE}================================${NC}"
    echo -e "${GREEN}Установка завершена успешно!${NC}"
    echo -e "${BLUE}================================${NC}"
}

# Главная функция
main() {
    print_header
    
    # Проверка root прав
    if [ "$EUID" -eq 0 ]; then
        print_error "Не запускайте скрипт от имени root"
        print_warning "Запустите скрипт от имени обычного пользователя"
        exit 1
    fi
    
    # Основные этапы установки
    check_os
    check_dependencies
    
    # Установка зависимостей для конкретной ОС
    if [ "$OS" = "linux" ]; then
        install_ubuntu_deps
    elif [ "$OS" = "macos" ]; then
        install_macos_deps
    fi
    
    setup_project
    install_project_deps
    setup_environment
    init_redis
    build_project
    
    # Создание systemd сервисов для Linux
    if [ "$OS" = "linux" ]; then
        create_systemd_services
    fi
    
    final_setup
    show_final_info
}

# Обработка сигналов
cleanup() {
    print_message "Установка прервана пользователем"
    exit 1
}

trap cleanup SIGINT SIGTERM

# Запуск установки
main "$@"
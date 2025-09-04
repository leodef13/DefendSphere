# DefendSphere Makefile
# Упрощенные команды для управления проектом

.PHONY: help install build start stop clean logs test docker-build docker-up docker-down

# Цвета для вывода
GREEN = \033[0;32m
YELLOW = \033[1;33m
RED = \033[0;31m
NC = \033[0m # No Color

# Переменные
PROJECT_NAME = defendsphere
FRONTEND_PORT = 3000
BACKEND_PORT = 5000
REDIS_PORT = 6380

help: ## Показать справку по командам
	@echo "$(GREEN)DefendSphere - Команды управления проектом$(NC)"
	@echo ""
	@echo "$(YELLOW)Основные команды:$(NC)"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(GREEN)%-20s$(NC) %s\n", $$1, $$2}'

install: ## Установить зависимости для frontend и backend
	@echo "$(GREEN)Установка зависимостей...$(NC)"
	@npm install
	@cd backend && npm install
	@echo "$(GREEN)Зависимости установлены!$(NC)"

build: ## Собрать frontend и backend
	@echo "$(GREEN)Сборка проекта...$(NC)"
	@npm run build
	@cd backend && npm run build
	@echo "$(GREEN)Проект собран!$(NC)"

start: ## Запустить проект в режиме разработки
	@echo "$(GREEN)Запуск проекта в режиме разработки...$(NC)"
	@echo "$(YELLOW)Frontend: http://localhost:$(FRONTEND_PORT)$(NC)"
	@echo "$(YELLOW)Backend: http://localhost:$(BACKEND_PORT)$(NC)"
	@echo "$(YELLOW)Redis: localhost:$(REDIS_PORT)$(NC)"
	@echo "$(YELLOW)Для остановки нажмите Ctrl+C$(NC)"
	@concurrently "npm run dev" "cd backend && npm run dev" "redis-server --port $(REDIS_PORT)"

stop: ## Остановить все процессы
	@echo "$(YELLOW)Остановка процессов...$(NC)"
	@pkill -f "npm run dev" || true
	@pkill -f "redis-server" || true
	@echo "$(GREEN)Процессы остановлены!$(NC)"

clean: ## Очистить build файлы и node_modules
	@echo "$(YELLOW)Очистка проекта...$(NC)"
	@rm -rf dist/ build/ node_modules/
	@cd backend && rm -rf node_modules/
	@echo "$(GREEN)Проект очищен!$(NC)"

logs: ## Показать логи Docker контейнеров
	@echo "$(GREEN)Логи контейнеров:$(NC)"
	@docker-compose logs -f

test: ## Запустить тесты
	@echo "$(GREEN)Запуск тестов...$(NC)"
	@npm test
	@cd backend && npm test

# Docker команды
docker-build: ## Собрать Docker образы
	@echo "$(GREEN)Сборка Docker образов...$(NC)"
	@docker-compose build
	@echo "$(GREEN)Docker образы собраны!$(NC)"

docker-up: ## Запустить проект в Docker
	@echo "$(GREEN)Запуск проекта в Docker...$(NC)"
	@docker-compose up -d
	@echo "$(GREEN)Проект запущен!$(NC)"
	@echo "$(YELLOW)Frontend: http://localhost:$(FRONTEND_PORT)$(NC)"
	@echo "$(YELLOW)Backend: http://localhost:$(BACKEND_PORT)$(NC)"
	@echo "$(YELLOW)Admin Panel: http://localhost:$(FRONTEND_PORT)/admin$(NC)"

docker-down: ## Остановить Docker контейнеры
	@echo "$(YELLOW)Остановка Docker контейнеров...$(NC)"
	@docker-compose down
	@echo "$(GREEN)Контейнеры остановлены!$(NC)"

docker-restart: ## Перезапустить Docker контейнеры
	@echo "$(YELLOW)Перезапуск Docker контейнеров...$(NC)"
	@docker-compose restart
	@echo "$(GREEN)Контейнеры перезапущены!$(NC)"

# Redis команды
redis-init: ## Инициализировать Redis с данными по умолчанию
	@echo "$(GREEN)Инициализация Redis...$(NC)"
	@cd scripts && npm run init
	@echo "$(GREEN)Redis инициализирован!$(NC)"

redis-cli: ## Подключиться к Redis CLI
	@echo "$(GREEN)Подключение к Redis CLI...$(NC)"
	@docker exec -it $(PROJECT_NAME)-redis-1 redis-cli

# Админ команды
admin-users: ## Показать список пользователей в системе
	@echo "$(GREEN)Список пользователей:$(NC)"
	@curl -s http://localhost:$(BACKEND_PORT)/api/admin/users | jq '.[] | {username: .username, role: .role, email: .email}' || echo "$(RED)Ошибка получения пользователей$(NC)"

# Мониторинг
status: ## Показать статус всех сервисов
	@echo "$(GREEN)Статус сервисов:$(NC)"
	@docker-compose ps
	@echo ""
	@echo "$(YELLOW)Проверка доступности:$(NC)"
	@curl -s -o /dev/null -w "Frontend: %{http_code}\n" http://localhost:$(FRONTEND_PORT) || echo "$(RED)Frontend недоступен$(NC)"
	@curl -s -o /dev/null -w "Backend: %{http_code}\n" http://localhost:$(BACKEND_PORT)/api/health || echo "$(RED)Backend недоступен$(NC)"
	@redis-cli -p $(REDIS_PORT) ping 2>/dev/null && echo "$(GREEN)Redis: доступен$(NC)" || echo "$(RED)Redis недоступен$(NC)"

# Разработка
dev-setup: ## Полная настройка для разработки
	@echo "$(GREEN)Настройка окружения для разработки...$(NC)"
	@make install
	@make redis-init
	@echo "$(GREEN)Окружение настроено!$(NC)"
	@echo "$(YELLOW)Теперь запустите: make start$(NC)"

prod-setup: ## Настройка для продакшена
	@echo "$(GREEN)Настройка окружения для продакшена...$(NC)"
	@make docker-build
	@make docker-up
	@echo "$(GREEN)Продакшен окружение настроено!$(NC)"
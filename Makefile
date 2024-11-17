DOCKER_COMPOSE = docker compose
PROJECT_NAME = ft_transcendence
DOCKER_ENV_FILE ?= .env

GREEN := \033[0;32m
YELLOW := \033[0;33m
RED := \033[0;31m
RESET := \033[0m

.DEFAULT_GOAL := all

help:
	@echo "Usage: make ${GREEN}[target]${RESET}"
	@echo
	@echo "${YELLOW}Available targets:${RESET}"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  ${GREEN}%-20s${RESET} %s\n", $$1, $$2}'

all: build up

up: ## Start containers in detached mode
	@echo "${GREEN}Starting containers...${RESET}"
	@$(DOCKER_COMPOSE) up -d

build: ## Build all containers
	@echo "${GREEN}Building containers...${RESET}"
	@$(DOCKER_COMPOSE) build

down: ## Stop and remove containers
	@echo "${RED}Stopping containers...${RESET}"
	@$(DOCKER_COMPOSE) down

## Rebuild commands
rebuild: down ## Full rebuild of all containers
	@echo "${YELLOW}Performing full rebuild...${RESET}"
	@$(DOCKER_COMPOSE) down --volumes --remove-orphans
	@$(DOCKER_COMPOSE) build --no-cache
	@$(DOCKER_COMPOSE) up -d

rebuild-frontend: ## Rebuild only frontend container
	@echo "${YELLOW}Rebuilding frontend...${RESET}"
	@$(DOCKER_COMPOSE) down frontend
	@$(DOCKER_COMPOSE) build frontend
	@$(DOCKER_COMPOSE) up -d frontend

rebuild-backend: ## Rebuild only backend container
	@echo "${YELLOW}Rebuilding backend...${RESET}"
	@$(DOCKER_COMPOSE) down backend
	@$(DOCKER_COMPOSE) build backend
	@$(DOCKER_COMPOSE) up -d backend

## Utility commands
clean: ## Remove all containers, images, volumes and prune system
	@echo "${RED}Cleaning up everything...${RESET}"
	@$(DOCKER_COMPOSE) down --volumes --rmi all --remove-orphans
	@docker system prune -a --volumes -f

logs: ## Display logs for all containers
	@$(DOCKER_COMPOSE) logs -f

status: ## Show container status
	@$(DOCKER_COMPOSE) ps

restart: ## Restart all containers
	@echo "${YELLOW}Restarting containers...${RESET}"
	@$(DOCKER_COMPOSE) restart

## Development commands
dev-logs: ## Display logs for a specific service
	@$(DOCKER_COMPOSE) logs -f $(filter-out $@,$(MAKECMDGOALS))

dev-shell: ## Open a shell in a container
	@$(DOCKER_COMPOSE) exec $(filter-out $@,$(MAKECMDGOALS)) sh

## System information
system-info: ## Display Docker system information
	@echo "${GREEN}Docker Info:${RESET}"
	@docker info
	@echo "\n${GREEN}Docker Compose Version:${RESET}"
	@$(DOCKER_COMPOSE) version
	@echo "\n${GREEN}Disk Usage:${RESET}"
	@docker system df

## Health check
health: ## Check the health of all services
	@echo "${GREEN}Checking services health...${RESET}"
	@$(DOCKER_COMPOSE) ps --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}"

%:
	@:

.PHONY: help all up build down rebuild rebuild-frontend rebuild-backend clean logs status restart dev-logs dev-shell system-info health
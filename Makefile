# Color definitions
BOLD := \033[1m
DIM := \033[2m
ITALIC := \033[3m
UNDERLINE := \033[4m
GREEN := \033[0;32m
YELLOW := \033[0;33m
RED := \033[0;31m
BLUE := \033[0;34m
MAGENTA := \033[0;35m
CYAN := \033[0;36m
WHITE := \033[0;37m
RESET := \033[0m

# Project configuration
DOCKER_COMPOSE = docker compose
PROJECT_NAME = ft_transcendence
DOCKER_ENV_FILE ?= .env

.DEFAULT_GOAL := all

# Main help command with improved formatting
help: ## Display this help message
	@printf "$(BOLD)$(PROJECT_NAME)$(RESET) - Docker Compose Project Manager\n\n"
	@printf "$(BOLD)USAGE:$(RESET)\n"
	@printf "  make $(GREEN)[target]$(RESET)\n\n"
	@printf "$(BOLD)TARGETS:$(RESET)\n"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(GREEN)%-20s$(RESET) %s\n", $$1, $$2}'

# Main commands
all: build up ## Build and start all containers (default)

up: ## Start containers in detached mode
	@printf "$(BOLD)$(GREEN)Starting$(RESET) containers...\n"
	@$(DOCKER_COMPOSE) up -d
	@printf "$(DIM)Run '$(CYAN)make logs$(DIM)' to follow container logs$(RESET)\n"

build: ## Build all containers
	@printf "$(BOLD)$(GREEN)Building$(RESET) containers...\n"
	@$(DOCKER_COMPOSE) build

down: ## Stop and remove containers
	@printf "$(BOLD)$(RED)Stopping$(RESET) containers...\n"
	@$(DOCKER_COMPOSE) down

# Rebuild commands
rebuild: down ## Full rebuild of all containers
	@printf "$(BOLD)$(YELLOW)Rebuilding$(RESET) all containers...\n"
	@$(DOCKER_COMPOSE) down --volumes --remove-orphans
	@$(DOCKER_COMPOSE) build --no-cache
	@$(DOCKER_COMPOSE) up -d
	@printf "$(GREEN)✓$(RESET) Rebuild complete\n"

rebuild-frontend: ## Rebuild only frontend container
	@printf "$(BOLD)$(YELLOW)Rebuilding$(RESET) frontend...\n"
	@$(DOCKER_COMPOSE) down frontend
	@$(DOCKER_COMPOSE) build frontend
	@$(DOCKER_COMPOSE) up -d frontend
	@printf "$(GREEN)✓$(RESET) Frontend rebuild complete\n"

rebuild-backend: ## Rebuild only backend container
	@printf "$(BOLD)$(YELLOW)Rebuilding$(RESET) backend...\n"
	@$(DOCKER_COMPOSE) down backend
	@$(DOCKER_COMPOSE) build backend
	@$(DOCKER_COMPOSE) up -d backend
	@printf "$(GREEN)✓$(RESET) Backend rebuild complete\n"

# Utility commands
clean: ## Remove all containers, images, volumes and prune system
	@printf "$(BOLD)$(RED)Cleaning$(RESET) project resources...\n"
	@$(DOCKER_COMPOSE) down --volumes --rmi all --remove-orphans
	@docker system prune -a --volumes -f
	@printf "$(GREEN)✓$(RESET) Cleanup complete\n"

logs: ## Display logs for all containers
	@printf "$(BOLD)Following container logs$(RESET) (Ctrl+C to exit)...\n"
	@$(DOCKER_COMPOSE) logs -f

status: ## Show container status
	@printf "$(BOLD)Container Status:$(RESET)\n"
	@$(DOCKER_COMPOSE) ps

restart: ## Restart all containers
	@printf "$(BOLD)$(YELLOW)Restarting$(RESET) containers...\n"
	@$(DOCKER_COMPOSE) restart
	@printf "$(GREEN)✓$(RESET) Restart complete\n"

# Development commands
dev-logs-frontend: ## Display logs for the frontend service
	@printf "$(BOLD)Following logs for $(CYAN)frontend$(RESET)\n"
	@$(DOCKER_COMPOSE) logs -f frontend

dev-logs-backend: ## Display logs for the backend service
	@printf "$(BOLD)Following logs for $(CYAN)backend$(RESET)\n"
	@$(DOCKER_COMPOSE) logs -f backend

dev-shell-frontend: ## Open a shell in the frontend container
	@printf "$(BOLD)Opening shell in $(CYAN)frontend$(RESET)\n"
	@$(DOCKER_COMPOSE) exec frontend bash

dev-shell-backend: ## Open a shell in the backend container
	@printf "$(BOLD)Opening shell in $(CYAN)backend$(RESET)\n"
	@$(DOCKER_COMPOSE) exec backend bash

# System information
system-info: ## Display Docker system information
	@printf "$(BOLD)Docker System Information:$(RESET)\n"
	@printf "$(UNDERLINE)Docker Info:$(RESET)\n"
	@docker info
	@printf "\n$(UNDERLINE)Docker Compose Version:$(RESET)\n"
	@$(DOCKER_COMPOSE) version
	@printf "\n$(UNDERLINE)Disk Usage:$(RESET)\n"
	@docker system df

# Health check
health: ## Check the health of all services
	@printf "$(BOLD)Service Health Status:$(RESET)\n"
	@$(DOCKER_COMPOSE) ps --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}"
	@printf "\n$(DIM)Use 'make logs' to view detailed logs$(RESET)\n"

version: ## Display project version information
	@printf "$(BOLD)$(PROJECT_NAME)$(RESET) v1.0.0\n"
	@printf "Docker Compose Version: $(DOCKER_COMPOSE) $(shell $(DOCKER_COMPOSE) version --short)\n"
	@printf "Docker Version: $(shell docker version --format '{{.Server.Version}}')\n"

%:
	@:

.PHONY: help all up build down rebuild rebuild-frontend rebuild-backend clean logs status restart dev-logs-frontend dev-logs-backend dev-shell system-info dev-shell-frontend dev-shell-backend health version
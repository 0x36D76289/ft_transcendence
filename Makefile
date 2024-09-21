DOCKER_COMPOSE = docker compose
PROJECT_NAME = ft_transcendence

all: build up

up:
	$(DOCKER_COMPOSE) up -d

build:
	$(DOCKER_COMPOSE) build

down:
	$(DOCKER_COMPOSE) down

rebuild: down
	$(DOCKER_COMPOSE) down --volumes --remove-orphans
	$(DOCKER_COMPOSE) build
	$(DOCKER_COMPOSE) up -d

rebuild-frontend: 
	$(DOCKER_COMPOSE) down frontend
	$(DOCKER_COMPOSE) build frontend
	$(DOCKER_COMPOSE) up -d

rebuild-backend: 
	$(DOCKER_COMPOSE) down backend
	$(DOCKER_COMPOSE) build backend
	$(DOCKER_COMPOSE) up -d

clean:
	$(DOCKER_COMPOSE) down --volumes --rmi all --remove-orphans
	docker system prune -a --volumes -f

logs:
	$(DOCKER_COMPOSE) logs -f

status:
	$(DOCKER_COMPOSE) ps

restart:
	$(DOCKER_COMPOSE) restart

exec:
	$(DOCKER_COMPOSE) exec $(service) $(cmd)

.PHONY: all up build down rebuild rebuild-frontend rebuild-backend clean logs status restart exec

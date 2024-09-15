DOCKER_COMPOSE = docker-compose
PROJECT_NAME = ft_transcendence

up:
	$(DOCKER_COMPOSE) up -d

down:
	$(DOCKER_COMPOSE) down

rebuild: down
	$(DOCKER_COMPOSE) down --volumes --remove-orphans
	$(DOCKER_COMPOSE) build
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

.PHONY: up down rebuild clean logs status restart exec

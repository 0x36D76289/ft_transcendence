DOCKER_DIR = ${USER}/goinfre.docker
APP_DIR = ${USER}/goinfre/app_data
COMPOSE_FILE = docker-compose.yml

config:
	@echo "DOCKER_DIR = $(DOCKER_DIR)"
	@echo "APP_DIR = $(APP_DIR)"
	@echo "COMPOSE_FILE = $(COMPOSE_FILE)"

	mkdir -p $(DOCKER_DIR)
	mkdir -p $(APP_DIR)
	
	switch $$SHELL in
		/bin/zsh)
			if ! grep -q "export DOCKER_ROOTLESS_ROOT=$(DOCKER_DIR)" ~/.zshrc; then \
				echo "export DOCKER_ROOTLESS_ROOT=$(DOCKER_DIR)" >> ~/.zshrc; \
			fi
			source ~/.zshrc
			;;
		/bin/bash)
			if ! grep -q "export DOCKER_ROOTLESS_ROOT=$(DOCKER_DIR)" ~/.bashrc; then \
				echo "export DOCKER_ROOTLESS_ROOT=$(DOCKER_DIR)" >> ~/.bashrc; \
			fi
			source ~/.bashrc
			;;
		*)
			echo "Unsupported shell"
			;;
	esac

	



all: build run

background: build
	docker-compose up -d

build:
	docker-compose build

run:
	docker-compose up

down:
	docker-compose down

clean: down
	docker-compose down --rmi all --volumes --remove-orphans

re: down clean all

.PHONY: all background build run down clean re
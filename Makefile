.PHONY: all config background build run down clean re

all: build run

config:
	sh ./config.sh

background: build
	docker-compose up -d

build:
	docker-compose build

run:
	docker-compose up

down:
	docker-compose down

clean:
	docker-compose stop
	docker-compose rm -f
	docker network prune -f
	docker volume prune -f

re: down clean all
.PHONY: all config background build run down clean re
.SILENT: clean

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
	docker stop $$(docker ps -qa); \
	docker rm $$(docker ps -qa); \
	docker rmi -f $$(docker images -qa); \
	docker volume rm $$(docker volume ls -q); \
	docker network rm $$(docker network ls -q)

re: down clean all

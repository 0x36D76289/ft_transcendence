
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
.PHONY: all
all: build up

.PHONY: up
up:
	docker-compose up

.PHONY: down
down:
	docker-compose down

.PHONY: build
build:
	docker-compose build

.PHONY: clean
clean: down
	docker-compose rm -f

.PHONY: fclean
fclean: clean
	docker-compose rmi -f

.PHONY: re
re: fclean all

.PHONY: restart
restart: down up
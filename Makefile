# Path to your compose file
COMPOSE = docker-compose -f docker-compose.yml

.PHONY: build build-no-cache build-service pull up down logs shell deploy clean help

build:
  # Builds all services based on docker-compose.yml
	@$(COMPOSE) build

build-no-cache:
  # Builds all services without using cache
	@$(COMPOSE) build --no-cache

build-service:
  # Builds a single service; requires SERVICE=name
	@if [ -z "$(SERVICE)" ]; then \
	  echo "ERROR: specify SERVICE, e.g. make build-service SERVICE=v1-bot"; exit 1; \
	fi
	@$(COMPOSE) build $(SERVICE)

pull:
  # Pulls updates for base images (e.g. node:18-alpine)
	@$(COMPOSE) build --pull

up:
  # Starts services in detached mode
	@if [ -z "$(SERVICE)" ]; then \
	  $(COMPOSE) up -d; \
	else \
	  $(COMPOSE) up -d $(SERVICE); \
	fi

up-deploy:
  # Starts all services, forces a rebuild, and sets DEPLOY_ON_STARTUP so entrypoint.sh will run `npm run deploy`
  # Opens a shell in a service; requires SERVICE=name
	@if [ -z "$(SERVICE)" ]; then \
	  DEPLOY_ON_STARTUP=true $(COMPOSE) up -d --build; \
	else \
	  DEPLOY_ON_STARTUP=true $(COMPOSE) up -d --build $(SERVICE); \
	fi

down:
  # Stops and removes all containers
	@$(COMPOSE) down

logs:
  # Tails logs for all services
	@$(COMPOSE) logs -f

shell:
  # Opens a shell in a service; requires SERVICE=name
	@if [ -z "$(SERVICE)" ]; then \
	  echo "ERROR: specify SERVICE, e.g. make shell SERVICE=v1-bot"; exit 1; \
	fi
	@$(COMPOSE) run --rm $(SERVICE) sh

deploy:
  # Runs your `npm run deploy` script inside a service; requires SERVICE=name
  # ``make up-deploy SERVICE=v1-bot`` 
	@if [ -z "$(SERVICE)" ]; then \
	  echo "ERROR: specify SERVICE, e.g. make deploy SERVICE=v1-bot"; exit 1; \
	fi
	@$(COMPOSE) run --rm $(SERVICE) npm run deploy

clean:
  # Stops containers and removes volumes & local images
	@$(COMPOSE) down --volumes --rmi local

help:
  # Shows this help message
	@echo "Usage: make [target] [SERVICE=name]"
	@echo ""
	@echo "Targets:"
	@echo "  build           Build all services"
	@echo "  build-no-cache  Build without cache"
	@echo "  build-service   Build one service (SERVICE=name)"
	@echo "  pull            Pull latest base images"
	@echo "  up              Start all services (SERVICE=name)"
	@echo "  down            Stop and remove containers"
	@echo "  logs            Tail logs"
	@echo "  shell           Shell into a service (SERVICE=name)"
	@echo "  deploy          Deploy commands in a service (SERVICE=name)"
	@echo "  clean           Remove containers, volumes, images"
	@echo ""
	@echo "Note:"
	@echo "  SERVICE         SERVICE is case and space sensitive."
	@echo "                  To launch multiple, inclose with quotation marks"
	@echo "                  I.E. SERVICE=\"v1-bot v2-bot\""

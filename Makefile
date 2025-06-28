# Path to your compose file
COMPOSE = docker-compose -f docker-compose.yml
INSTALL_DOS2UNIX ?= sudo apt-get update && sudo apt-get install -y dos2unix

#
#  Detect & define how to install dos2unix if it’s missing
#
ifeq (,$(shell command -v dos2unix))
  ifneq (,$(shell command -v apt-get))
    INSTALL_DOS2UNIX = sudo apt-get update && sudo apt-get install -y dos2unix
  else ifneq (,$(shell command -v yum))
    INSTALL_DOS2UNIX = sudo yum install -y dos2unix
  else ifneq (,$(shell command -v brew))
    INSTALL_DOS2UNIX = brew install dos2unix
  else
    INSTALL_DOS2UNIX = @echo "Could not detect package manager; install dos2unix manually."
  endif
endif

.PHONY: build build-no-cache build-service pull up up-deploy down logs shell deploy clean dos2unix help

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

dos2unix:
  # Installs dos2unix if missing, then converts all files to Unix-style (LF) endings
	@command -v dos2unix >/dev/null 2>&1 \
		|| ( echo "⚙️ dos2unix not found. Installing..."; \
		     $(INSTALL_DOS2UNIX) )
	@echo "🔄 Converting all files to LF endings…"
	@find . -type f -print0 | xargs -0 dos2unix || true


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
	@echo "  up-deploy        Start + rebuild + deploy on startup"
	@echo "  down            Stop and remove containers"
	@echo "  logs            Tail logs"
	@echo "  shell           Shell into a service (SERVICE=name)"
	@echo "  deploy          Deploy commands in a service (SERVICE=name)"
	@echo "  clean           Remove containers, volumes, images"
	@echo "  dos2unix         Install (if needed) & normalize line endings"
	@echo "  help             Show this message"
	@echo ""
	@echo "Note:"
	@echo "  SERVICE         SERVICE is case and space sensitive."
	@echo "                  To launch multiple, inclose with quotation marks"
	@echo "                  I.E. SERVICE=\"v1-bot v2-bot\""

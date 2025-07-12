## Contents

- [About](#about)
- [Local Development Setup](#local-development-setup)
- [Startup Procedures](#startup-procedures)
- [Utility Commands](#utility-commands)
- [Working on the Application](#working-on-the-application)
- [Micro-services in Development Environment](#micro-services-in-development-environment)

## About

This repository contains Dockerized Discord bots built with `Node.js` and the `discord.js` library.
The project is containerized with Docker so that each service can run in isolation.
Currently the only service is **v1-bot**, but the structure supports adding more bots or related services in the future.

## Local Development Setup

1. Install [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/).
2. Clone this repository.
3. Copy the example environment file and update it with your credentials based on the location of `.env.example`:
   ```sh
   cp bots/v1-bot/.env.example bots/v1-bot/.env
   ```
4. Build the images using the provided `Makefile`:
   ```sh
   make build
   ```
   You can build a specific service with `make build-service SERVICE=v1-bot`.

## Startup Procedures

- Start all services in the background:
  ```sh
  make up
  ```
- To deploy slash commands automatically on startup, run:
  ```sh
  make up-deploy
  ```
  You can build also deploy a specific service with `make up SERVICE=v1-bot`, `make up-deploy SERVICE=v1-bot`, `make deploy SERVICE=v1-bot`.
- Stop and remove all containers with:
  ```sh
  make down
  ```
  You can build a specific service with `make up SERVICE=v1-bot`, `make up-deploy SERVICE=v1-bot`, `make deploy SERVICE=v1-bot`.

## Utility Commands

- Convert Windows line endings to Unix

  ```sh
  make dos2unix
  ```

  What this does:
  1. **Detects** whether `dos2unix` is installed.
  2. **Installs** it automatically via `apt-get`, `yum`, or Homebrew if missing.
  3. **Traverse** the entire repo and **normalize** all files to Unix-style (LF) line endings.

## Working on the Application

- The bot source code lives in `bots/repo/src` respectively.
- Containers mount this directory, so changes will apply without rebuilding.
- Use `make logs` to stream logs from the running services.
- Open a shell inside a service with:
  ```sh
  make shell SERVICE=v1-bot
  ```
- Rebuild the container after dependency or configuration changes using `make build-service SERVICE=v1-bot`.

## Micro-services in Development Environment

The development environment is orchestrated via `docker-compose.yml` and currently includes the following service:

| Service    | Description                                                  |
| ---------- | ------------------------------------------------------------ |
| **v1-bot** | Node.js application providing the Discord bot functionality. |

Additional micro-services can be added by extending the `docker-compose.yml` file and following the same pattern as the existing bot service.

# bots/v1-bot/Dockerfile

# ─── Test Stage ────────────────────────────────────────────────────────────────
FROM node:20-slim AS test

# 1. Set working dir
WORKDIR /usr/src/app

# 2. Copy package manifests and install ALL deps (including dev)
COPY package*.json ./
RUN npm ci

# 3. Copy everything (including tests, config, src, etc.)
COPY . .

# ─── Runtime Stage ─────────────────────────────────────────────────────────────
FROM node:20-slim AS runtime

# 1. Set working dir
WORKDIR /usr/src/app

# 2. Copy package manifests and install only production deps
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# 3. Copy just the runtime source
COPY src/ ./src

# 4. Copy your entrypoint and make it executable
COPY entrypoint.sh ./
RUN chmod +x entrypoint.sh

# 5. Launch via entrypoint
ENTRYPOINT ["./entrypoint.sh"]
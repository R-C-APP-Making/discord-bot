FROM node:20-slim AS runtime
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --only=production

COPY src/ ./src
COPY entrypoint.sh ./
RUN chmod +x entrypoint.sh

ENTRYPOINT ["./entrypoint.sh"]

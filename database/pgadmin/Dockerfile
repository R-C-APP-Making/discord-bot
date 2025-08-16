FROM dpage/pgadmin4:latest

ENV PGADMIN_DEFAULT_EMAIL=admin@admin.com \
    PGADMIN_DEFAULT_PASSWORD=password \
    PGADMIN_LISTEN_PORT=8001 \
    PGADMIN_CONFIG_SERVER_MODE=False \
    PGADMIN_SERVER_JSON_FILE=/servers.json

COPY servers.json /servers.json

EXPOSE 8001

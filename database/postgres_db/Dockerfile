# 1. Pull the official PostgreSQL 17 Alpine image (latest minor patch).
FROM postgres:17-alpine

# 2. Work in /app if you have application artifacts to add:
WORKDIR /app

# 3. Ensure the default PGDATA directory is writable by 'postgres' user.
USER root
RUN chown -R postgres:postgres /var/lib/postgresql/data

# 4. Switch to the built-in 'postgres' user (created by the base image).
USER postgres

# 5. Healthcheck to verify Postgres is ready to accept connections.
#    - Interval: 30s
#    - Timeout: 10s
#    - Start-period: 30s
#    - Retries: 3
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD pg_isready -d "$$POSTGRES_DB" -U "$$POSTGRES_USER" || exit 1

FROM node:22-bookworm

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV PNPM_PACKAGE_IMPORT_METHOD="copy"

WORKDIR /app

RUN corepack enable

COPY docker/app-entrypoint.sh /usr/local/bin/app-entrypoint.sh
RUN chmod +x /usr/local/bin/app-entrypoint.sh

ENTRYPOINT ["app-entrypoint.sh"]
CMD ["pnpm", "dev", "--hostname", "0.0.0.0"]

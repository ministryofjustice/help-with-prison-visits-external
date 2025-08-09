# Stage: base image
FROM node:22.18-bookworm-slim AS base

ARG BUILD_NUMBER
ARG GIT_REF
ARG GIT_BRANCH

LABEL maintainer="HMPPS Digital Studio <info@digital.justice.gov.uk>"

ENV TZ=Europe/London
RUN ln -snf "/usr/share/zoneinfo/$TZ" /etc/localtime && echo "$TZ" > /etc/timezone

RUN addgroup --gid 2000 --system appgroup && \
    adduser --uid 2000 --system appuser --gid 2000

WORKDIR /app

# Cache breaking and ensure required build / git args defined
RUN test -n "$BUILD_NUMBER" || (echo "BUILD_NUMBER not set" && false)
RUN test -n "$GIT_REF" || (echo "GIT_REF not set" && false)
RUN test -n "$GIT_BRANCH" || (echo "GIT_BRANCH not set" && false)

# Define env variables for runtime health / info
ENV BUILD_NUMBER=${BUILD_NUMBER}
ENV GIT_REF=${GIT_REF}
ENV GIT_BRANCH=${GIT_BRANCH}

RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get autoremove -y && \
    rm -rf /var/lib/apt/lists/*

# Stage: build assets
FROM base AS build

ARG BUILD_NUMBER
ARG GIT_REF
ARG GIT_BRANCH

COPY package*.json ./
RUN CYPRESS_INSTALL_BINARY=0 npm ci --no-audit

COPY . .
RUN npm run css-build

RUN export BUILD_NUMBER=${BUILD_NUMBER} && \
    export GIT_REF=${GIT_REF} && \
    npm run record-build-info

RUN npm prune --no-audit --omit=dev

# Stage: copy production assets and dependencies
FROM base

RUN mkdir /app/logs && chown appuser:appgroup /app/logs
RUN mkdir /app/uploads && chown appuser:appgroup /app/uploads
RUN mkdir /app/tmp && chown appuser:appgroup /app/tmp

COPY --from=build --chown=appuser:appgroup \
        /app/package.json \
        /app/package-lock.json \
        /app/knexfile.js \
        /app/config.js \
        /app/build-info.json \
        /app/build-css \
        ./

COPY --from=build --chown=appuser:appgroup \
        /app/node_modules ./node_modules

COPY --from=build --chown=appuser:appgroup \
        /app/logs ./logs

COPY --from=build --chown=appuser:appgroup \
        /app/app ./app

ENV PORT=3000
EXPOSE 3000
USER 2000

HEALTHCHECK CMD curl --fail http://localhost:3000/status || exit 1

CMD [ "node", "./app/bin/www" ]

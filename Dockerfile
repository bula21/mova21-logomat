FROM node:14.5.0-stretch AS build

RUN adduser --no-create-home --disabled-password --gecos '' build
RUN mkdir /build && chown build:build /build
WORKDIR /build
USER build

COPY --chown=build:build package.json yarn.lock /build/
RUN yarn install

COPY --chown=build:build . .
RUN yarn build
# checkout dockerignored files for clean diff
RUN git checkout Dockerfile    \
                 README.md     \
                 .dockerignore
RUN /bin/sh write_version.sh

# prod image
FROM nginx:1.19.0-alpine AS release
COPY --from=build /build/dist /usr/share/nginx/html
ADD nginx.conf /etc/nginx/conf.d/default.conf

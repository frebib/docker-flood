FROM node:alpine
MAINTAINER Adam Dodman <adam.dodman@gmx.com>

ENV UID=899 GID=899 \
    FLOOD_DIR=/opt/flood

WORKDIR $FLOOD_DIR

RUN apk add --no-cache su-exec tini && \
    apk add --no-cache --virtual .build-deps curl jq tar git && \
    flood_release="$(curl -sX GET "https://api.github.com/repos/jfurrow/flood/releases/latest" | jq -r '.tag_name')" && \
    curl -L "https://github.com/jfurrow/flood/archive/${flood_release}.tar.gz" | \
        tar xz --strip-components=1 && \
    npm install --production && \
    apk del --no-cache .build-deps && \
    # Remove unused libraries & metadata from image
    rm -rf .git /tmp /root && \
    mkdir -p /tmp /root

COPY run-flood /usr/local/bin/
COPY config.js .

VOLUME /config
EXPOSE 3000

CMD ["/sbin/tini", "--", "run-flood"]

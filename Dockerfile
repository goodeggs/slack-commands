FROM goodeggs/platform-nodejs-base:2.3.1
ARG RANCH_BUILD_ENV
COPY --chown=docker:docker package.json yarn.lock .npmrc ./
RUN su docker -c 'yarn-install'
COPY --chown=docker:docker . ./

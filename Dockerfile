# ---- Base Node ----
FROM node:18-alpine AS base
# install node
RUN apk add --no-cache tini
# set working directory
WORKDIR /app
# Set tini as entrypoint
ENTRYPOINT ["/sbin/tini", "--"]
# copy project file
COPY package.json \
     package-lock.json \
     tsconfig.json \
     tsoa.json \
     .npmrc \
     ./

#
# ---- Dependencies ----
FROM base AS dependencies
ARG CI_JOB_TOKEN
# install node packages
RUN npm set progress=false && npm config set update-notifier false
RUN npm install --omit=dev
# copy production node_modules aside
RUN cp -R node_modules prod_node_modules
RUN npm install

#
# ---- Build ----
FROM dependencies AS build
ARG APP_VERSION

COPY src/ ./src
RUN npm version ${APP_VERSION}
RUN npm run build

#
# ---- Release ----
FROM base AS release
# copy production node_modules
COPY --from=dependencies /app/prod_node_modules ./node_modules
COPY --from=build /app/dist ./dist

# expose port and define CMD
EXPOSE 3000
CMD npm run start

# Common build stage
FROM node:14.14.0-alpine3.12 as common-build-stage

COPY . ./app

WORKDIR /app

RUN npm install
RUN npm install @craco/craco -g

EXPOSE 8000

# Development build stage
FROM common-build-stage as development-build-stage

ENV NODE_ENV development

CMD ["npm", "run", "start"]

# Production build stage
FROM common-build-stage as production-build-stage

RUN npm install -g serve
ENV NODE_ENV production

CMD ["npm", "run", "prod"]

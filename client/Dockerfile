FROM node:13.13.0-alpine

WORKDIR usr/src/app
ENV PATH /usr/src/app/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.json /usr/src/app/package.json

RUN yarn

EXPOSE 3000
CMD ["yarn", "dev"]

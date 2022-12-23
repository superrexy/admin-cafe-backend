FROM node:gallium-slim

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

# Install Yarn
RUN npm install -g yarn

# Bundle app source
COPY . .

# COPY .env
COPY .env ./

# Prisma Deploy
RUN yarn prisma generate
RUN yarn prisma deploy

EXPOSE 3000

CMD [ "yarn", "start" ]

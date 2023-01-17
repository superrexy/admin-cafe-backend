FROM node:18.12.1-buster-slim

# Create app directory
WORKDIR /usr/src/app

# Install OpenSSL
RUN apt-get update && apt-get install -y openssl

# Install app dependencies
COPY package*.json ./

# Bundle app source
COPY ./ ./

# COPY .env
COPY .env ./

# Install Dependencies
RUN yarn install

# Generate Swagger
RUN yarn swagger

EXPOSE 3000

CMD yarn prisma generate && yarn prisma migrate deploy && yarn prisma db seed && yarn start

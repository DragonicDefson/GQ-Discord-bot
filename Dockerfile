FROM node:lts-bullseye-slim

# Create working directory.
WORKDIR /usr/src/app

# Install latest updates.
RUN apt-get update && apt-get upgrade

# Install dump-init && WGET.
RUN apt-get install -y wget

RUN wget https://github.com/Yelp/dumb-init/releases/download/v1.2.5/dumb-init_1.2.5_amd64.deb
RUN dpkg -i dumb-init_1.2.5_amd64.deb

# Create necessary dependencies.
COPY package.json ./
COPY package-lock.json ./

# Instantiate NPM install for production.
RUN npm ci --only=production

# Enable production ready optimizations for ExpressJS.
ENV NODE_ENV=production

# Instantiate NPM install for non-production.
# RUN npm install

# Copy app source code.
COPY . .

# Expose network ports.
EXPOSE 8484

# Start application with dump-init.
ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD [ "node", "app.js" ]
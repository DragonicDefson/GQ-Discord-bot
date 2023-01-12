FROM node:lts-bullseye-slim

# Create working directory.
WORKDIR /usr/src/app

# Create necessary dependencies.
COPY package.json ./
COPY package-lock.json ./

# Instantiate NPM install for production.
RUN npm ci --only=production

# Instantiate NPM install for non-production.
# RUN npm install

# Copy app source code.
COPY . .

# Expose network ports.
EXPOSE 8484

# Start application.
CMD [ "node", "app.js" ]
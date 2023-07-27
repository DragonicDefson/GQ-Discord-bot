# GQ-Discord-bot
An Discord bot for querying game servers

# Supports
- Minecraft
- Valheim
- Ark: Survival Evolved
- Space Engineers
- Conan Exiles
- 7 Days to die

# How to install
- Install Node.JS v18 (v16 should work fine as well).
- Clone the bot's repository: `git clone https://github.com/DragonicDefson/GQ-Discord-bot.git`
- Run NPM update inside the repo directory: `npm update`
- Create a bot for every game server on: https://discord.com/developers/
- Add the generated tokens to the config.json configuration file inside the config directory.
- Change the IP's and ports suited per your situation in: ./config/config.json.
- Start the bot by running: `npm start`

# Additional information
- If you run an Ark Survival Evolved dedicated server on the same machine as a Conan Exiles server, make sure to change it's port in the Engine.ini file of the Conan Exiles server, and the port in the ./config/config.json of the bot. To prevent inteference between the servers.
- Enjoy :)
- If you want it to automatically start after a server reboot it's recommended to go for a Dockerized approach.

# How to build with Docker?
- It just requires a single command: `docker build . -t dragonicdefson/gq-discord-bot`

# How to deploy with Docker compose?
- If you've already pulled the image from Docker Hub, create a docker-compose.yml file on the system you want to deploy the bot with the below code:

```yml
version: '3.9'
services:
  gq-discord-bot:
    image: dragonicdefson/gq-discord-bot:latest
    container_name: gq-discord-bot
    network_mode: host
    ports:
      - "0.0.0.0:8484:8484/tcp"
    restart: unless-stopped
```

# Update (as of 11/26/2022)
- Includes an API for web interfaces now as well!

# Update (as of 07/27/2023)
- Docker image available.

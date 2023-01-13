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
- Install Node.JS (written and tested on Node.JS v16), (Update 0.0.5 uses Node.js v18 but v16 should still work fine.).
- Create a bot for every game server on: https://discord.com/developers/
- Add the generated tokens to the configuration.json configuration file inside the config directory.
- Change the IP's and ports suited per your situation in: ./config/configuration.json.

# Additional information
- If you run an Ark Survival Evolved dedicated server on the same machine as a Conan Exiles server, make sure to change it's port in the Engine.ini file of the Conan Exiles server, and the port in the ./config/configuration.json of the bot. To prevent inteference between the servers.
- Enjoy :)

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

# 🔥 FIRE 🔥

Financial Independence, Retire Early. Keep track of your finances and investments all in one application.

# Quickstart

1. Install docker https://docs.docker.com/get-docker/
1. Add the correct environment files to the services: server (.env.development.local | .env.test.local | .env.production.local), client (.env). root folder for docker-compose-prod.yml (.env). 
1. In root, run the following command (-d: background)

        docker-compose up -d --build

1. api will be at http://localhost:3000 and Client will be at http://localhost:8000

Have fun developing!


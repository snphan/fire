# Typescript PERN Stack with GraphQL Template

A template to work with Postgres, Express, React, Node.js and GraphQL. Based on https://github.com/ljlm0402/typescript-express-starter.

# Quickstart

1. Install docker https://docs.docker.com/get-docker/
1. In root, run the following command (-d: background)

        docker-compose up -d --build

1. api will be at http://localhost:3000 and Client will be at http://localhost:8000

Have fun developing!

# API Specifications

## Environment Variables

Some local .env files are needed for production, dev and testing. Here are samples. Testing environment uses sqlite to test the database and queries.

`.env.development.local`
```
# PORT
PORT = 3000

# DATABASE
DB_HOST = pg
DB_PORT = 5432
DB_USER = root
DB_PASSWORD = password
DB_DATABASE = dev

# TOKEN
SECRET_KEY = secretKey

# LOG
LOG_FORMAT = dev
LOG_DIR = ../logs

# CORS
ORIGIN = https://studio.apollographql.com
CREDENTIALS = true
```

`.env.production.local`
```
# PORT
PORT = 3000

# DATABASE
DB_HOST = localhost
DB_PORT = 5432
DB_USER = root
DB_PASSWORD = password
DB_DATABASE = prod

# TOKEN
SECRET_KEY = secretKey

# LOG
LOG_FORMAT = combined
LOG_DIR = ../logs

# CORS
ORIGIN = false
CREDENTIALS = true
```

`env.test.local`
```
# PORT
PORT = 3003

# DATABASE
DB_TYPE = sqlite
DB_HOST = localhost
DB_PORT = 5432
DB_USER = root
DB_PASSWORD = password
DB_DATABASE = test.sqlite3

# TOKEN
SECRET_KEY = secretKey

# LOG
LOG_FORMAT = dev
LOG_DIR = ../logs/tests

# CORS
ORIGIN = true
CREDENTIALS = true
```

# Some Extra Notes

* Repositories (typeORM) and Resolvers (graphQL) are kept separate because repositories provide functions to query and mutate the database. (You won't be able to get/mutate the data with the resolver methods inside your API).

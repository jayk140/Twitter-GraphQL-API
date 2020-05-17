# Twitter-GraphQL-API

Demonstration of Twitter-like backend built with GraphQL, Node.js, Express and PostgreSQL.

Dependencies: express, express-graphql, graphql, helmet, jsonwebtoken, knex, morgan, bcryptjs, cors, dotenv. 

To start server, run `npm install` and `npm run dev` and pass in environmental variables for the postgres databse url `DB_URL` and `JWT_SECRET` for json web token authentication.

Send GraphQL client queries to endpoint `/graphql` for single interface to API.

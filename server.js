require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const errorHandler = require('./error-handler')
var express_graphql = require('express-graphql');
var { buildSchema } = require('graphql');

const app = express()



const morganOption = (process.env.NODE_ENV === 'production') ? 'tiny' : 'common';
app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())


// Interface to database layer
const { UsersService, MessagesService } = require('./src/knex-service')



var schema = buildSchema('
    type Query {
        userById(id: Int!): User
        userByEmail(email: String!): User
        getMessagesByUser(user: Int!): [Messages]
    },

    type Mutation {
        createUser(email: String!, password: String!, full_name: String): User
        loginUser(email: String!, password: String!): String
        createMessage(content: String!, user: Int!): Message

    },

    type User {
        id: Int
        email: String
        password: String
        full_name: String
        phone: String
        city: String
    }

    type Message {
        id: Int
        content: String
        user: Int
    }
');


var root = {

    userById: UsersService.getById,
    userByEmail: UsersService.getByEmail,
    getMessagesByUser: MessagesService.getByUser,
    createUser: UsersService.createUser
    loginUser: UsersService.loginUser
    createMessage: MessagesService.createMessage

};


const PORT = process.env.PORT || 8000

app.use('/graphql', express_graphql({
    schema: schema,
    rootValue: root,
    graphiql: true
}));


app.use(errorHandler)


app.listen(PORT, () => {
  console.log(`Server listening at port: ${PORT}`)
})




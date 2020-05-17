const knex = require('knex')
const { DB_URL } = require('../config')


const knex = knex({
  client: 'pg',
  connection: DB_URL,
})

const UsersService = {
  getAllUsers() {
    return knex.select('*').from('users')
  },
  getById(id) {
    return knex.from('users').select('*').where('id', id).first()
  },
  insertUser(newUser) {
    return knex
      .insert(newUser)
      .into('users')
      .returning('*')
      .then(rows => {
        return rows[0]
      })
  },
  deleteUser(id) {
    return knex('users')
      .where({ id })
      .delete()
  },
  updateUser(id, newUserFields) {
    return knex('users')
      .where({ id })
      .update(newBookmarkFields)
  },
}

const MessagesService = {
  getAllMessages() {
    return knex.select('*').from('messages')
  },
  getById(id) {
    return knex.from('messages').select('*').where('id', id).first()
  },
  insertMessage(newMessage) {
    return knex
      .insert(newMessage)
      .into('messages')
      .returning('*')
      .then(rows => {
        return rows[0]
      })
  },
  deleteMessage(id) {
    return knex('messages')
      .where({ id })
      .delete()
  },
  updateMessage(id, newMessageFields) {
    return knex('messages')
      .where({ id })
      .update(newMessageFields)
  },
}

module.exports = {UsersService, MessagesService}


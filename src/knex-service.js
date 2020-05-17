const knex = require('knex')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { DB_URL } = require('../config')


const knex = knex({
  client: 'pg',
  connection: DB_URL,
})

const UsersService = {
    
    hasUserWithEmail(email) {
      return knex('users')
        .where({ email })
        .first()
        .then(user => !!user)
    },

    hashPassword(password) {
        return bcrypt.hash(password, 12)
    },

    comparePasswords(password, hash) {
        return bcrypt.compare(password, hash)
    },

    createJwt(subject, payload) {
        return jwt.sign(payload, config.JWT_SECRET, {
            subject,
            algorithm: 'HS256',
        })
    },

    verifyJwt(token) {
        return jwt.verify(token, config.JWT_SECRET, {
            algorithms: ['HS256'],
        })
    },

    getAllUsers() {
        return knex.select('*').from('users')
    },

    getById(id) {
        return knex.from('users').select('*').where('id', id).first()
    },

    getUserWithEmail(email) {
        return knex.from('users').select('*').where('email', email).first()
    }

    loginUser(email, password) {
        UsersService.getUserWithEmail(email)
            .then(user => {
                if (!user) {
                    return res.status(400).json({
                        error: 'Invalid email',
                    })
                }

            return UsersService.comparePasswords(password, user.password)
                .then(compareMatch => {
                    if (!compareMatch) {
                        return res.status(400).json({
                            error: 'Incorrect password',
                        })
                    }

                    const payload = { user_id: user.id }
                    res.json({authToken: UsersService.createJwt(user.email, payload)})
                })
            .catch(next)
    }

    insertUser(user) {
        UsersService.hasUserWithEmail(user.email)
            .then(hasUserWithEmail => {
                if (hasUserWithEmail)
                    return res.status(400).json({ error: 'Email already taken' })
                return UsersService.hashPassword(user.password)
                    .then(hashedPassword => {
                        const {email, full_name, phone, city} = user
                        const newUser = {
                            email,
                            password: hashedPassword,
                            full_name,
                            phone,
                            city
                        }
                    return knex.insert(newUser)
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


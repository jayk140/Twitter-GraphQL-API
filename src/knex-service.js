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

    getById(args) {
        return knex.from('users').select('*').where('id', args.id).first()
    },

    getByEmail(args) {
        return knex.from('users').select('*').where('email', args.email).first()
    }

    loginUser(args) {
        UsersService.getUserWithEmail(args.email)
            .then(user => {
                if (!user) {
                    return res.status(400).json({
                        error: 'Invalid email',
                    })
                }

            return UsersService.comparePasswords(args.password, user.password)
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

    createUser(args) {
        UsersService.hasUserWithEmail(args.email)
            .then(hasUserWithEmail => {
                if (hasUserWithEmail)
                    return res.status(400).json({ error: 'Email already taken' })
                return UsersService.hashPassword(args.password)
                    .then(hashedPassword => {
                        const newUser = {
                            args.email,
                            password: hashedPassword,
                            args.full_name
                        }
                    return knex.insert(newUser)
                            .into('users')
                            .returning('*')
                            .then(rows => {
                                return rows[0]
                            })
    },
    
    deleteUser(args) {
        return knex('users')
        .where({ args.id })
        .delete()
    },
    
    updateUser(args) {
        return knex('users')
        .where({ args.id })
        .update(args.newBookmarkFields)
    },
}

const MessagesService = {
  getAllMessages() {
    return knex.select('*').from('messages')
  },
  getById(args) {
    return knex.from('messages').select('*').where('id', args.id).first()
  },
  getByUser(args) {
    return knex.from('messages').select('*').where('user', args.user_id).first()
  }
  createMessage(args) {
    const newMessage = {args.content, args.user}
    return knex
      .insert(newMessage)
      .into('messages')
      .returning('*')
      .then(rows => {
        return rows[0]
      })
  },
  deleteMessage(args) {
    return knex('messages')
      .where({ args.id })
      .delete()
  },
  updateMessage(id, newMessageFields) {
    return knex('messages')
      .where({ id })
      .update(newMessageFields)
  },
}

module.exports = {UsersService, MessagesService}


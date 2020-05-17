const knex = require('knex')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { DB_URL } = require('../config')


const db = knex({
  client: 'pg',
  connection: DB_URL,
})

const UsersService = {
    
    hasUserWithEmail(email) {
      return db('users')
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
        return db.select('*').from('users')
    },

    getById(args) {
        return db.from('users').select('*').where('id', args.id).first()
    },

    getByEmail(args) {
        return db.from('users').select('*').where('email', args.email).first()
    },

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
        });
    },

    createUser(args) {
        UsersService.hasUserWithEmail(args.email)
            .then(hasUserWithEmail => {
                if (hasUserWithEmail)
                    return res.status(400).json({ error: 'Email already taken' })
                return UsersService.hashPassword(args.password)
                    .then(hashedPassword => {
                        const newUser = {
                            email: args.email,
                            password: hashedPassword,
                            full_name: args.full_name
                        }
                    return knex.insert(newUser)
                            .into('users')
                            .returning('*')
                            .then(rows => {
                                return rows[0]
                            })
                    });
                });
    },
    
    deleteUser(args) {
        return db('users')
        .where({ id: args.id })
        .delete()
    },
    
    updateUser(args) {
        return db('users')
        .where({ id: args.id })
        .update(args.newBookmarkFields)
    }
}

const MessagesService = {

  getAllMessages() {
    return db.select('*').from('messages')
  },

  getById(args) {
    return db.from('messages').select('*').where('id', args.id).first()
  },

  getByUser(args) {
    return db.from('messages').select('*').where('user', args.user_id).first()
  },

  createMessage(args) {
    const newMessage = {content: args.content, user: args.user}
    return db
      .insert(newMessage)
      .into('messages')
      .returning('*')
      .then(rows => {
        return rows[0]
      })
  },

  deleteMessage(args) {
    return db('messages')
      .where({ id: args.id })
      .delete()
  },

  updateMessage(id, newMessageFields) {
    return db('messages')
      .where({ id })
      .update(newMessageFields)
  }
}

module.exports = {UsersService, MessagesService}


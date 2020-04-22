const User = require('../models/user')
const { generateToken } = require('../helpers/token')
const { comparePassword } = require('../helpers/encrypt')

class UserController {

  static showMyTag(req,res, next) {
    let { _id } = req.decoded

    User.findById(_id)
        .then(user => {
          res.status(200).json(user.tags)
        })
        .catch(next)
  }
  
  static addTag(req, res, next) {
    let { _id } = req.decoded
    let tag = req.body.tag.toLowerCase()
    //validasi apakah tagnya sudah ada apa belum
    User.findOne({_id, tags:tag})
        .then(user => {
          if (user) next({status: 400, message: 'tag already choose'})
          else return User.findByIdAndUpdate({_id}, {
            $push: {
              tags: req.body.tag
            }
        }, {new: true})
        })
        .then(user => {
          res.status(200).json(user)
        })
        .catch(next)
  }

  static deleteTag(req, res, next) {
    let { _id } = req.decoded
    let tag = req.body.tag.toLowerCase()
    //validasi apakah tagnya sudah ada apa belum
    User.findOne({_id, tags:tag})
        .then(user => {
          if (!user) next({status: 400, message: 'tag doesn\'t exist'})
          else return User.findByIdAndUpdate({_id}, {
            $pull: {
              tags: req.body.tag
            }
        }, {new: true})
        })
        .then(user => {
          res.status(200).json(user)
        })
        .catch(next)
  }

  static signup(req, res, next) {
    const { name, email, password } = req.body

    User.create({ name, email, password })
      .then(user => {
        let payload = {
          _id: user._id,
          name: user.name,
          email: user.email
        }
        let token = generateToken(payload)
        
        res.status(201).json({ token, payload })
      })
      .catch(next)
  }

  static signin(req, res, next) {
    const { email, password } = req.body

    User.findOne({ email })
      .then(user => {
        if (user) {
          if (comparePassword(password, user.password)) {
            let payload = {
              _id: user._id,
              name: user.name,
              email: user.email
            }
            let token = generateToken(payload)

            res.status(201).json({ token, payload })
          } else {
            next({status: 400, message: 'Invalid email/password'})
          }
        } else {
          next({status: 400, message: 'Invalid email/password'})
        }
      })
  }
}

module.exports = UserController

const Question = require('../models/question')
const axios = require('axios')

class QuestionController {

  static job(req, res, next) {
    axios({
      method: 'GET',
      url: 'https://jobs.github.com/positions.json?description=vue&page=1',
    })
      .then(({data}) => {
        res.status(200).json(data)
      })
      .catch(next)
  }

  static findAll(req, res, next) {
    Question.find().sort([['createdAt', -1]]).populate('user')
    .then(questions => {
      res.status(200).json(questions)
    })
    .catch(next)
  }

  static findMyQuestions(req, res, next) {
    const user = req.decoded._id
    Question.find({ user }).sort([['createdAt', -1]]).populate('user')
    .then(questions => {
      res.status(200).json(questions)
    })
    .catch(next)
  }

  static findOne(req, res, next) {
    const _id = req.params.id

    Question.findOne({ _id })
    .populate({
      path: 'answers',
      model: 'Answer',
      // options: {
      //     sort: {
      //         'createdAt': -1
      //     }
      // },
      populate: {
          path: 'user',
          select: 'name email createdAt'
      }
    })
    .populate('user')
    .then(question => {
      res.status(200).json(question)
    })
    .catch(next) 
  }

  static findByTag(req, res, next) {
    const tag = req.params.tag
    Question.find({tags: tag})
            .populate('user')
            .then(questions => {
              res.status(200).json(questions)
            })
            .catch(next)
  }

  static create(req, res, next) {
    const { title, description } = req.body
    const tagString = req.body.tags
    const tags = tagString ? tagString.replace(/\s+/g, '').split(',') : []
    const user = req.decoded._id

    Question.create({ title, description, tags, user })
      .then(question => {
        res.status(201).json({
          message: 'Question added succesfully',
          question
        })
      })
      .catch(next)
  }

  static update(req, res, next) {
    const { title, description } = req.body
    const tagString = req.body.tags
    const tags = tagString ? tagString.replace(/\s+/g, '').split(',') : []    
    const _id = req.params.id

    Question.findById(_id)
      .then(question => {
        question.title = title
        question.description = description
        question.tags = tags
        return question.save()
      })
      .then(() => {
        res.status(200).json({
          message: 'Question updated successfully'
        })
      })
      .catch(next)
  }

  static delete(req, res, next) {
    const _id = req.params.id

    Question.deleteOne({ _id })
      .then(() => {
        res.status(200).json({
          message: 'Question deleted successfully'
        })
      })
  }

  static upvote(req, res, next) {
    const user = req.decoded._id
    const _id = req.params.id

    Question.findById(_id)
      .then(question => {
        if (question) {
          // cek downvotes dan upvotes
          let downvoteIndex = question.downvotes.indexOf(user)
          let upvoteIndex = question.upvotes.indexOf(user)

          // jika ditemukan downvote maka hapus
          if (downvoteIndex > -1) {
            question.downvotes.splice(downvoteIndex, 1)
          }

          // jika ditemukan upvote maka hapus, jika tidak maka tambah upvote
          if (upvoteIndex > -1) {
            question.upvotes.splice(upvoteIndex, 1)
          } else {
            question.upvotes.push(user)
          }

          return question.save()
        } else {
          next({status: 404, message: 'Question ID not found'})
        }
      })
      .then((question) => {
        res.status(200).json({ message: 'Update upvote success', question })
      })
      .catch(next)
  }

  static downvote(req, res, next) {
    const user = req.decoded._id
    const _id = req.params.id

    Question.findById(_id)
      .then(question => {
        if (question) {
          // cek downvotes dan upvotes
          let downvoteIndex = question.downvotes.indexOf(user)
          let upvoteIndex = question.upvotes.indexOf(user)

          // jika ditemukan upvote maka hapus
          if (upvoteIndex > -1) {
            question.upvotes.splice(upvoteIndex, 1)
          } 
          
          // ika ditemukan downvote maka hapus, jika tidak maka tambah downvote
          if (downvoteIndex > -1) {
            question.downvotes.splice(downvoteIndex, 1)
          } else {
            question.downvotes.push(user)
          }

          return question.save()
        } else {
          next({status: 404, message: 'Question ID not found'})
        }
      })
      .then((question) => {
        res.status(200).json({ message: 'Update downvote success', question })
      })
      .catch(next)
  }
}

module.exports = QuestionController

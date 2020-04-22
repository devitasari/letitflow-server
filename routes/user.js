const router = require('express').Router()
const UserController = require('../controllers/user')
const { authentication } = require('../middlewares/authentication')

router.post('/signin', UserController.signin)
router.post('/signup', UserController.signup)

router.use(authentication)
router.put('/tag', UserController.addTag)
router.put('/untag', UserController.deleteTag)
router.get('/tag', UserController.showMyTag)

module.exports = router

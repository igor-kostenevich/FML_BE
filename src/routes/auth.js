const router = require('express-promise-router')()

const { auth } = require('../controllers')

router.route('/login').post(auth.login)
router.route('/register').post(auth.register)
router.route('/refresh').post(auth.refreshToken)
router.route('/logout').post(auth.logout)
router.route('/reset').post(auth.resetPassword)

module.exports = router

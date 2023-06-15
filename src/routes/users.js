const router = require('express-promise-router')()
const { isAuth } = require('../middlewares/isAuth.middleware')
const { checkUserRole } = require('../middlewares/checkUserRole.middleware')
const { user } = require('../controllers')

router.route('/user/profile/:id').get(isAuth, checkUserRole, user.get)
router.route('/').get(isAuth, checkUserRole, user.getAll)
router.route('/user/profile/:id').put(isAuth, checkUserRole, user.update)
router.route('/user/profile/:id').delete(isAuth, checkUserRole, user.delete)

module.exports = router

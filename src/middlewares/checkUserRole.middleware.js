const { User } = require('../model')

const checkUserRole = async (req, res, next) => {
  const { userId, params: { id } } = req

  if(!userId) {
    return res.status(401).send({
      message: 'User not authorizated!'
    })
  }

  const user = await User.findById(userId)

  if(!user) {
    return res.sendStatus(403)
  }

  const userRole = user.role

  if(userRole === 'superadmin') {
    return next()
  }

  if (userRole === 'user' && id && id === userId) {
    return next()
  }

  return res.sendStatus(403)
}

module.exports = { checkUserRole }
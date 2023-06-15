require('dotenv').config()
const { verify } = require('jsonwebtoken')

const isAuth = (req, res, next) => {
  const { headers: { authorization } } = req

  if(authorization) {
    const token = authorization.split(' ')[1]

    verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if(err) {
        res.sendStatus(403)
        return next()
      }

      req.userId = decoded.userId
      return next()
    })
  } else {
    return res.sendStatus(403)
  }
}

module.exports = { isAuth }
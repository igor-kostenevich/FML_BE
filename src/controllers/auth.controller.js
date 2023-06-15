require('dotenv').config()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { User, Token } = require('../model')

module.exports = {
  async logout({ body: { refreshToken } }, res) {
    const foundToken = await Token.findOne({ token: refreshToken })

    if(!foundToken) {
      return res.status(401).send({
        message: 'User not authorizated!'
      })
    }

    await Token.findByIdAndDelete(foundToken._id)

    return res.status(200).send({
      message: 'Logout is success!'
    })
  },
  async refreshToken({ body: { refreshToken } }, res) {
    if(!refreshToken) {
      return res.status(403).send({
        message: 'This not access!'
      })
    }

    const currentToken = await Token.findOne({ token: refreshToken })

    if(!currentToken) {
      return res.status(403).send({
        message: 'This not access!'
      })
    }

    jwt.verify(refreshToken, process.env.JWT_SECRET_REFRESH, (err, user) => {
      if(err) {
        return res.status(403).send({
          message: 'This not access!'
        })
      }
      
      const accessToken = jwt.sign({
        userId: user._id,
        email: user.email
      }, process.env.JWT_SECRET, {
        expiresIn: '30day',
      })

      return res.status(200).send({
        accessToken,
        email: user.email
      })
    })
  },
  async login({ body: { email, password } }, res) {
    try {
      const user = await User.findOne({ email })

      if(!user) {
        return res.status(403).send({
          message: 'Login or password are not accepted',
          err
        })
      }

      const isPasswordCorrect = await bcrypt.compare(password, user.password)

      if(!isPasswordCorrect) {
        return res.status(403).send({
          message: 'Login or password are not accepted',
          err
        })
      }
  
      const accessToken = jwt.sign({
        userId: user._id,
        email: user.email
      }, process.env.JWT_SECRET, {
        expiresIn: '30day',
      })

      const refreshToken = jwt.sign({
        userId: user._id,
        email: user.email
      }, process.env.JWT_SECRET_REFRESH)

      const foundToken = await Token.findOne({
        user: user._id
      })

      if(foundToken) {
        await Token.findByIdAndUpdate(foundToken._id, { token: refreshToken })

        return res.status(200).send({
          accessToken,
          refreshToken,
          email: user.email
        })
      }

      const item = new Token({ token: refreshToken, user: user._id })
      await item.save()
      
      return res.status(200).send({
        accessToken,
        refreshToken,
        email: user.email
      })
    } catch (err) {
      return res.status(500).send({
        message: 'Login or password are not accepted',
        err
      })
    }
  },
  async register({ body: { first_name, email, password } }, res) {
    try {
      const foundUser = await User.findOne({ email })
      if(foundUser) {
        return res.status(403).send({
          message: 'This email is already in use',
          err
        })
      }

      const hashedPassword = await bcrypt.hash(password, 10)

      const createdUser = await new User({ 
        first_name, 
        email,
        password: hashedPassword
      })

      await createdUser.save()

      return res.status(200).send({
        message: 'User created!'
      })
      
      // TODO: email 

    } catch (err) {
      return res.status(500).send({
        message: 'Login or password are not accepted',
        err
      })
    }
  },
  async resetPassword({ body: {email, old_password, new_password} }, res) {
    try {
      const user = await User.findOne({ email })

      if(!user) {
        return res.status(403).send({
          message: 'Login or password are not accepted',
          err
        })
      }

      const isPasswordCorrect = await bcrypt.compare(old_password, user.password)

      if(!isPasswordCorrect) {
        return res.status(403).send({
          message: 'Login or password are not accepted',
          err
        })
      }

      const hashedNewPassword = await bcrypt.hash(new_password, 10)
      user.password = hashedNewPassword
      await user.save()

      return res.status(200).send({
        message: 'Password changed successfully'
      })
    } catch (err) {
      return res.status(500).send({
        message: 'Internal server error',
        err
      })
    }
  }
}
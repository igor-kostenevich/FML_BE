const genericCrud = require('./generic.controller')
const { User } = require('../model')

module.exports = {
  ...genericCrud(User),
}

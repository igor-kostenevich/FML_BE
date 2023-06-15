const {model, Schema} = require('mongoose')

const schema = new Schema({
  first_name: {
    type: String,
    default: '',
    required: true,
  },
  last_name: {
    type: String,
    default: '',
  },
  nick_name: {
    type: String,
    default: '',
  },
  email: {
    type: String,
    default: '',
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: Buffer,
  age: {
    type: Number,
    default: null
  },
  role: {
    type: String,
    default: 'user'
  },
}, { timestamps: true })

module.exports = model('User', schema)
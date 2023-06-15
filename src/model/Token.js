const {
  model,
  Schema,
  Schema: {
    Types: { ObjectId },
  }
} = require('mongoose')

const schema = new Schema({
  token: {
    type: String,
    default: '',
    required: true,
  },
  user: {
    type: ObjectId,
    ref: "User"
  }
}, { timestamps: true })

module.exports = model('Token', schema)
/* eslint-disable comma-dangle */
/* eslint-disable no-unused-vars */
const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
    default: 'Elise Bouer',
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
      message: 'Please, enter a valid URL',
    },
    default:
      'https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/wtwr-project/Elise.png',
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(value) {
        return validator.isEmail(value);
      },
      message: 'Please, enter a valid email',
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(
  email,
  password
) {};

module.exports = mongoose.model('user', userSchema);

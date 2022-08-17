// схема и модель для бд пользователя

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validEmail = require('validator/lib/isEmail'); // валидадация email

const ErrorLogin = require('../errors/ErrorLogin');

// схема бд пользователя
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (valueEmail) => validEmail(valueEmail),
      message: 'Введен некорректный email',
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false, // необходимо добавить поле select чтобы не возвращался хэш пароля
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new ErrorLogin('Ошибка email или пароля'));
      }
      return bcrypt.compare(password, user.password)
        .then((match) => {
          if (!match) {
            return Promise.reject(new ErrorLogin('Ошибка email или пароля'));
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);

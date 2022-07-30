// контроллер для пользователей по запросам

// подключаем модуль хеширования и создания токенов
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// подключились к схеме
const User = require('../models/user');

// подключаем кастомные классы ошибок
const ErrorBadData = require('../errors/ErrorBadData'); // 400
const ErrorNotFound = require('../errors/ErrorNotFound'); // 404
const ErrorBadEmail = require('../errors/ErrorBadEmail'); // 409
const ErrorOtherError = require('../errors/ErrorBadData'); // 500

const { OK } = require('../constants/constants');

// кодовые слова и длина соли хэша
const { SECRET_CODE, HASHSALT } = require('../constants/constants');

// запрос данных текущего пользователя
module.exports.getUserData = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        next(new ErrorNotFound('Пользователь с данным id не существует'));
        return;
      }
      res.status(OK).send({ user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ErrorBadData('Некорректные данные пользователя.'));
        return;
      }
      next(new ErrorOtherError('На сервере произошла ошибка'));
    });
};

// обновляем данные пользователя
module.exports.patchUserData = (req, res, next) => {
  const owner = req.user._id; // достали из пейлоуда после auth
  const { name, email } = req.body;

  // обновляем данные
  User.findByIdAndUpdate(owner, { name, email }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        next(new ErrorNotFound('Пользователь с данным id не существует'));
        return;
      }
      res.status(OK).send({ user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ErrorBadData('Некорректные данные пользователя.'));
        return;
      }
      next(new ErrorOtherError('На сервере произошла ошибка'));
    });
};

// создаем пользователя
module.exports.createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;

  bcrypt.hash(password, HASHSALT)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then((user) => res.status(OK).send({ user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ErrorBadData('Некорректные данные пользователя'));
        return;
      }
      if (err.code === 11000) {
        next(new ErrorBadEmail('Пользователь с данным емейл уже существует'));
        return;
      }
      next(new ErrorOtherError('На сервере произошла ошибка'));
    });
};

// обработка логина
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, SECRET_CODE, { expiresIn: '7d' });
      res.status(OK).send({ token });
    })
    .catch((err) => {
      if (err.statusCode === 401) {
        next(err);
        return;
      }
      next(new ErrorOtherError('На сервере произошла ошибка'));
    });
};

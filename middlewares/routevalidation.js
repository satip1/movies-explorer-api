// валидация через селебрейты для роутов

const { celebrate, Joi } = require('celebrate');
const { REG_LINK } = require('../constants/constants');

// валидация регистрации
const validateSignup = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

// валидация авторизации
const validateSignin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

// валидация роутера router.patch('/users/me') в users
const validateUserme = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
});

// валидация роутера router.post('/movies') в movies
const validatePostmovies = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required().min(2).max(4),
    description: Joi.string().required(),
    image: Joi.string().required().pattern(REG_LINK),
    trailerLink: Joi.string().required().pattern(REG_LINK),
    thumbnail: Joi.string().required().pattern(REG_LINK),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

// валидация роутера router.delete('/movies') в movies
const validateDeletemoviesid = celebrate({
  params: Joi.object().keys({
    _id: Joi.string().required().length(24).hex(),
  }),
});

module.exports = {
  validateSignup,
  validateSignin,
  validateUserme,
  validatePostmovies,
  validateDeletemoviesid,
};

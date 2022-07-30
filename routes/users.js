// роутеры для пользователей
const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUserData, patchUserData,
} = require('../controllers/users');

router.get('/users/me', getUserData);

router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
}), patchUserData);

module.exports = router;

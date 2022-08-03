// роутеры для регистрации и аутентификации
const router = require('express').Router();
const { login, createUser } = require('../controllers/users');
const { validateSignup, validateSignin } = require('../middlewares/routevalidation');

//  роутер создания пользователя
router.post('/signup', validateSignup, createUser);

// роутер логирования пользователя
router.post('/signin', validateSignin, login);

module.exports = router;

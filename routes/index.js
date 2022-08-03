// подключаем все роуты

const router = require('express').Router();

const { auth } = require('../middlewares/auth');

const routerSign = require('./registration');
const routerUsers = require('./users');
const routerMovies = require('./movies');

const ErrorNotFound = require('../errors/ErrorNotFound'); // ошибка 404

// роуты для регистрации и авторизации
router.use(routerSign);

// защита роутов
router.use(auth);

// роуты для users
router.use(routerUsers);
// роуты для карточек
router.use(routerMovies);

// роут для некорректных адресов
router.use('*', (req, res, next) => {
  next(new ErrorNotFound('Несуществующий адрес'));
});

module.exports = router;

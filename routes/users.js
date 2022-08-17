// роутеры для пользователей
const router = require('express').Router();
const { validateUserme } = require('../middlewares/routevalidation');

const {
  getUserData, patchUserData,
} = require('../controllers/users');

router.get('/users/me', getUserData);

router.patch('/users/me', validateUserme, patchUserData);

module.exports = router;

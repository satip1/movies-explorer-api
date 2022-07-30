// основной модуль для запуска
const express = require('express');

const app = express();

const { PORT = 3000 } = process.env;

// подключаемся к базе
const mongoose = require('mongoose');
// подключаем парсер для пакетов
const bodyParser = require('body-parser');

// валидация запросов на регистрацию и создание пользователя
const { celebrate, Joi, errors } = require('celebrate');
// импортируем корс
const cors = require('cors');

// импортируем роутеры и контроллеры
const { auth } = require('./middlewares/auth');
const routerUsers = require('./routes/users');
const routerMovies = require('./routes/movies');
const { login, createUser } = require('./controllers/users');
const { error } = require('./middlewares/error');

// логгер
const { requestLogger, errorLogger } = require('./middlewares/logger');

const ErrorNotFound = require('./errors/ErrorNotFound'); // ошибка 404
const { CORS_CONFIG } = require('./constants/constants'); // параметры для корса

// роуты
// собираем пакеты
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// логгер запросов
app.use(requestLogger);

// подключили корс
app.use('*', cors(CORS_CONFIG)); // надо исправить список доступных серверов

//  роутер для валидации запроса и создания пользователя
app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  createUser,
);
// роутер для валидации запроса и логирования пользователя
app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  login,
);

// защита роутов
app.use(auth);

// роуты для users
app.use(routerUsers);
// роуты для карточек
app.use(routerMovies);

// роут для некорректных адресов
app.use('*', (req, res, next) => {
  next(new ErrorNotFound('Несуществующий адрес'));
});

// подключили логгер ошибок
app.use(errorLogger);
// обработка ошибок celebrate
app.use(errors());
// обработчик всех ошибок
app.use(error);

// запустили веб-сервер
app.listen(PORT, () => {
  console.log(`Сервер запущен напорту ${PORT}`);
});

// запустили сервер бд
mongoose.connect('mongodb://localhost:27017/moviedb ');

// основной модуль для запуска
const express = require('express');
require('dotenv').config();

const app = express();

// подключаемся к базе
const mongoose = require('mongoose'); // переделать на moviesdb
// подключаем парсер для пакетов
const bodyParser = require('body-parser');
// валидация запросов на регистрацию и создание пользователя
const { errors } = require('celebrate');
// импортируем корс
const cors = require('cors');
// импортируем хелмет для заголовков
const helmet = require('helmet');
// импортируем роутеры и контроллеры
const routes = require('./routes');
// обработчик ошибок
const { error } = require('./middlewares/error');
// логгер
const { requestLogger, errorLogger } = require('./middlewares/logger');
// лимитер
const limiter = require('./middlewares/limiter');

// параметры для подключения моного
const { PORT, MONGO_DB } = require('./config');

// const ErrorNotFound = require('./errors/ErrorNotFound'); // ошибка 404
const { CORS_CONFIG } = require('./constants/constants'); // параметры для корса

// роуты
// собираем пакеты
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// логгер запросов
app.use(requestLogger);

// подключили лимитер
app.use(limiter);

// подключили хелмет
app.use(helmet());

// подключили корс
app.use('*', cors(CORS_CONFIG)); // надо исправить список доступных серверов

// роутеры для фронтенда
app.use(routes);

// подключили логгер ошибок
app.use(errorLogger);

// обработка ошибок celebrate
app.use(errors());

// обработчик всех ошибок
app.use(error);

// запустили веб-сервер
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});

// запустили сервер бд
mongoose.connect(MONGO_DB);

// схема базы данных сохраненных фильмов

const mongoose = require('mongoose');

const { REG_LINK } = require('../constants/constants');

// схема бд фильмов
const movieSchema = new mongoose.Schema({
  // страна
  country: {
    type: String,
    required: true,
    default: 'Планет Марс',
  },
  // режиссер
  director: {
    type: String,
    required: true,
    default: 'Неизвестный режиссер',
  },
  // продолжительность
  duration: {
    type: Number,
    required: true,
    default: 0,
  },
  // год выпуска
  year: {
    type: String,
    minlength: 2,
    maxlength: 4,
    required: true,
    default: '1900',
  },
  // описание фильма
  description: {
    type: String,
    required: true,
    default: 'Описание фильма',
  },
  //  ссылка на постер к фильму
  image: {
    type: String,
    required: true,
    validate: {
      validator: (v) => REG_LINK.test(v),
      message: 'Адрес картинки постера некорректен',
    },
  },
  // ссылка на трейлер
  trailerLink: {
    type: String,
    required: true,
    validate: {
      validator: (v) => REG_LINK.test(v),
      message: 'Адрес картинки постера некорректен',
    },
  },
  // миниатюрное изображение постера к фильму
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator: (v) => REG_LINK.test(v),
      message: 'Адрес картинки постера некорректен',
    },
  },
  // _id пользователя, который сохранил фильм
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  // id фильма, который содержится в ответе сервиса MoviesExplorer
  movieId: {
    type: Number,
    required: true,
  },
  // название фильма на русском языке
  nameRU: {
    type: String,
    required: true,
    default: 'Русское название фильма',
  },
  // название фильма на английском языке
  nameEN: {
    type: String,
    required: true,
    default: 'Английское название фильма',
  },
});

module.exports = mongoose.model('movie', movieSchema);

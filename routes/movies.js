// роутеры для фильмов
const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const { REG_LINK } = require('../constants/constants');

const {
  getAllMovies, creatMovie, deleteMovie,
} = require('../controllers/movies');

router.get('/movies', getAllMovies);

router.post('/movies', celebrate({
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
}), creatMovie);

router.delete('/movies/:_id', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().required().length(24).hex(),
  }),
}), deleteMovie);

module.exports = router;

// подключились к схеме фильма
const Movie = require('../models/movie');
// подключились к схеме пользователя

const ErrorOtherError = require('../errors/ErrorOtherError'); // 500
const ErrorBadData = require('../errors/ErrorBadData'); // 400
const ErrorDeleteCard = require('../errors/ErrorDeleteCard'); // 403
const ErrorNotFound = require('../errors/ErrorNotFound'); // 404

// константы кодов ошибок
const { OK } = require('../constants/constants');

// запрос всех фильмов, созданных пользователем
module.exports.getAllMovies = (req, res, next) => {
  const userId = req.user._id;
  Movie.find({ owner: userId })
    .then((movies) => res.status(OK).send(movies))
    .catch(() => next(new ErrorOtherError()));
};

// создаем новую карточку фильма
module.exports.creatMovie = (req, res, next) => {
  const {
    country, director, duration,
    year, description, image,
    trailerLink, nameRU, nameEN,
    thumbnail, movieId,
  } = req.body;

  const owner = req.user._id;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    owner,
    movieId,
    nameRU,
    nameEN,
  })
    .then((movie) => res.status(OK).send({ movie }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ErrorBadData(`Некорректные данные карточки. Ошибка: ${err.message}`));
        return;
      }
      next(new ErrorOtherError());
    });
};

// удаляем карточку с фильмом
module.exports.deleteMovie = (req, res, next) => {
  const ownerUser = req.user._id;
  // проверка   на возможность удаления
  // если id автора и пользователя совпадают, удалим
  Movie.findById(req.params._id)
    .then((movie) => {
      if (!movie) {
        next(new ErrorNotFound('Ошибка: карточкис таким id не найдено'));
        return;
      }
      if (movie.owner._id.toString() !== ownerUser.toString()) {
        next(new ErrorDeleteCard('Ошибка: вы не можете удалить эту карточку'));
        return;
      }
      Movie.deleteOne(movie).then(() => res.status(OK).send({ message: 'Карточка фильма удалена:' }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ErrorBadData(`Некорректное id карточки: ${err}`));
        return;
      }
      next(new ErrorOtherError());
    });
};

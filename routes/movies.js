// роутеры для фильмов
const router = require('express').Router();
const { validatePostmovies, validateDeletemoviesid } = require('../middlewares/routevalidation');

const {
  getAllMovies, creatMovie, deleteMovie,
} = require('../controllers/movies');

router.get('/movies', getAllMovies);

router.post('/movies', validatePostmovies, creatMovie);

router.delete('/movies/:_id', validateDeletemoviesid, deleteMovie);

module.exports = router;

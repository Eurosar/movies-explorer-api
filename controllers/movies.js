const Movie = require('../models/movie');
const ApiError = require('../errors/ApiError');
const messages = require('../utils/messages');

/**
 * Получим сохраненные фильмы
 * @param req
 * @param res
 * @param next
 */
module.exports.getMovies = (req, res, next) => {
  const owner = req.user._id;
  Movie.find({ owner })
    .then((movies) => res.send(movies))
    .catch(next);
};

/**
 * Создадим фильм с переданными в теле данными
 * @param req
 * @param res
 * @param next
 */
module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    nameRU,
    nameEN,
    movieId,
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
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner,
  })
    .then((movie) => res.status(201).send(movie))
    .catch((err) => {
      console.log(err);
      if (err.name === 'ValidationError') {
        // то возвращаем ошибку 400
        return next(ApiError.BadRequestError(messages.movie.isIncorrectMovieData));
      }
      // Иначе возвращаем ошибку 500
      return next(err);
    });
};

/**
 * Удалим фильм из сохраненных
 * @param req
 * @param res
 * @param next
 */
module.exports.deleteMovie = (req, res, next) => {
  const { id } = req.params;
  Movie.findById(id)
    .then((movie) => {
      if (!movie) {
        return next(ApiError.NotFoundError(messages.movie.isNotFoundMovie));
      }
      // Если id пользователя не совпадает с id создателя карточки
      if (movie.owner.toString() !== req.user._id.toString()) {
        // Вернем ошибку
        return next(ApiError.Forbidden('Недостаточно прав'));
      }
      // Если все в порядке, то удалим карточку
      return Movie.findByIdAndRemove(id)
        .then((data) => res.send(data))
        .catch(next);
    })
    .catch((err) => {
      // Если ошибка относится к CastError
      if (err.name === 'CastError') {
        // Вернем 400 ошибку
        return next(ApiError.BadRequestError(messages.movie.isNotObjectIdMovie));
      }
      // Иначе возвращаем ошибку 500
      return next(err);
    });
};

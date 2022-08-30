module.exports = {
  main: {
    isInternalServerError: 'Непредвиденная ошибка!',
  },
  auth: {
    isUnauthorized: 'Необходима авторизация',
  },
  logout: {
    isLogoutSuccess: 'Вы успешно вышли из аккаунта',
  },
  user: {
    isNotFoundUser: 'Пользователь с указанным _id не найден',
    isNotObjectIdUser: 'Некорректный id пользователя',
    isIncorrectUserData: 'Переданы некорректные данные при создании пользователя',
    isNotUniqueEmail: 'Пользователь с данным email уже существует',
  },
  movie: {
    isIncorrectMovieData: 'Переданы некорректные данные при создании карточки',
    isNotFoundMovie: 'Фильм с указанным _id не найден',
    isNotObjectIdMovie: 'Некорректный id фильма',
  },
  routes: {
    isNotFoundAddress: 'Адреса не существует',
  },
};

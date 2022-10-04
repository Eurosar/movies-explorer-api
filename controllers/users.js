const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ApiError = require('../errors/ApiError');
const messages = require('../utils/messages');

/**
 * Найдем пользователя по ID
 * @param id
 * @param res
 * @param next
 */
function findUserById(id, res, next) {
  User.findById(id)
    .then((user) => {
      if (!user) {
        return next(ApiError.NotFoundError(messages.user.isNotFoundUser));
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(ApiError.BadRequestError(messages.user.isNotObjectIdUser));
      }
      return next(err);
    });
}

/**
 * Создадим пользователя
 * @param req
 * @param res
 * @param next
 */
module.exports.createUser = (req, res, next) => {
  const { name, email, password } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then((user) => res.status(201).send({
      name: user.name,
      email: user.email,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(ApiError.BadRequestError(messages.user.isIncorrectUserData));
      }
      if (err.code === 11000) {
        return next(ApiError.Conflict(messages.user.isNotUniqueEmail));
      }
      return next(err);
    });
};

/**
 * Получим пользователя
 * @param req
 * @param res
 * @param next
 */
module.exports.getUser = (req, res, next) => {
  const id = req.user._id;
  findUserById(id, res, next);
};

/**
 * Обновим данные пользователя
 * @param req
 * @param res
 * @param next
 */
module.exports.updateUserInfo = (req, res, next) => {
  const { name, email } = req.body;
  const id = req.user._id;
  User.findByIdAndUpdate(
    id,
    { name, email },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        return next(ApiError.NotFoundError(messages.user.isNotFoundUser));
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(ApiError.BadRequestError(messages.user.isIncorrectUserData));
      }
      if (err.code === 11000) {
        return next(ApiError.Conflict(messages.user.isNotUniqueEmail));
      }
      return next(err);
    });
};

/**
 * Функция авторизации пользователя
 * @param req
 * @param res
 * @param next
 * @returns {Promise<R | *>| Promise<any>}
 */
module.exports.login = (req, res, next) => {
  // Деструктурируем входящие от клиента данные
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // Создадим токен
      const { NODE_ENV, JWT_SECRET } = process.env;
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );

      // Отправим токен клиенту и браузер сохранит его в куках
      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          // secure: true,
          sameSite: 'none',
        })
        .send({ token });
    })
    .catch(() => next(ApiError.Unauthorized('Неверный логин или пароль')));
};

/**
 * Функция удаления авторизации
 * @param req
 * @param res
 */
module.exports.logout = (req, res) => {
  res.clearCookie('jwt').send({ message: messages.logout.isLogoutSuccess });
};

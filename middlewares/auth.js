const jwt = require('jsonwebtoken');
const ApiError = require('../errors/ApiError');
const messages = require('../utils/messages');

/**
 * Функция аутентификации
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
module.exports = (req, res, next) => {
  // Если токен сохраняется в куки, то нужно будет подключить в файле app.js cookieParser
  const token = req.cookies.jwt;
  const { NODE_ENV, JWT_SECRET } = process.env;
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    return next(ApiError.Unauthorized(messages.auth.isUnauthorized));
  }

  req.user = payload; // записываем пейлоуд в объект запроса
  return next(); // пропускаем запрос дальше
};

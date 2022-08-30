const ApiError = require('../errors/ApiError');
const messages = require('../utils/messages');

/**
 * Функция добавления централизованного обработчика ошибок
 * @param err
 * @param req
 * @param res
 * @param next
 */
const errorHandler = (err, req, res, next) => {
  // Если ошибка относится к ApiError
  if (err instanceof ApiError) {
    // Вернем статус ошибки и ее сообщение согласно настройкам
    res.status(err.status).json({ message: err.message });
  } else {
    res.status(500).json({ message: messages.main.isInternalServerError });
  }
  // Иначе вернем 500 ошибку
  next();
};

module.exports = errorHandler;

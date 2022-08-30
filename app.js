// Подключим файл .env
require('dotenv').config();

// Подключим нужные зависимости и модули
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
// const cors = require('cors');
const routes = require('./routes/index');
const errorHandler = require('./middlewares/ErrorHandlingMiddleware');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const rateLimiter = require('./utils/rateLimiter');
// const corsOptions = require('./utils/cors');

// Возьмем нужные данные из файла .env
// Если файла .env не будет, то PORT будет равен 3000
const { PORT = 3000, MONGO_DB } = process.env;

// Подключим базу данных
mongoose.connect(MONGO_DB);

// Запустим приложение
const app = express();

// Валидация заголовков
app.use(helmet());

// Запускаем проверку CORS
// app.use(cors(corsOptions));

// Ограничим число запросов с одного IP
app.use(rateLimiter);

// Запустим parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Запишем логи запросов
app.use(requestLogger);

// Используем routes
app.use(routes);

// Запишем логи ошибок
app.use(errorLogger);

// Отдадим ошибки
app.use(errors());
app.use(errorHandler);

// Приложение будет слушать порт, который указан
app.listen(PORT, () => {
  console.log(`app connected server with PORT: ${PORT}`);
});

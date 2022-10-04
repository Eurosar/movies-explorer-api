// Подключим файл .env
require('dotenv').config();

// Подключим нужные зависимости и модули
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const cors = require('cors');
const routes = require('./routes/index');
const errorHandler = require('./middlewares/ErrorHandlingMiddleware');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const rateLimiter = require('./utils/rateLimiter');
const { databaseUrl } = require('./utils/database');
// const corsOptions = require('./utils/cors');

// Возьмем нужные данные из файла .env
// Если файла .env не будет, то PORT будет равен 3000
const { PORT = 3000 } = process.env;

// Подключим базу данных
mongoose.connect(databaseUrl);

// Запустим приложение
const app = express();

// Валидация заголовков
app.use(helmet());

// Запускаем проверку CORS (Включить, когда будет разрабатываться функционал фронтенда)
app.use(cors({
  origin: [
    'https://eurosar2movies.nomoredomains.sbs',
    'http://localhost:3000',
  ],
  credentials: true,
}));

// Запустим parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Запишем логи запросов
app.use(requestLogger);

// Ограничим число запросов с одного IP
app.use(rateLimiter);

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

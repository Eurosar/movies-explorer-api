const router = require('express').Router();
const userRouter = require('./users');
const movieRouter = require('./movies');
const ApiError = require('../errors/ApiError');
const messages = require('../utils/messages');
const { createUser, login, logout } = require('../controllers/users');
const { createUserValidator, loginValidator } = require('../validators/celebrate');
const auth = require('../middlewares/auth');

router.post('/signin', loginValidator, login);
router.post('/signup', createUserValidator, createUser);
router.post('/signout', logout);

router.use(auth);
router.use('/users', userRouter);
router.use('/movies', movieRouter);
router.use((req, res, next) => next(ApiError.NotFoundError(messages.routes.isNotFoundAddress)));
module.exports = router;

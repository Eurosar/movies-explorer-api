const { NODE_ENV, MONGO_DB } = process.env;
const databaseUrl = NODE_ENV === 'production' ? MONGO_DB : 'mongodb://localhost:27017/moviesdb';

module.exports = { databaseUrl };

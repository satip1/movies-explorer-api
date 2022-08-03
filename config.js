// настройка порта и имени бд
const {
  PORT = 3001,
  MONGO_DB = 'mongodb://localhost:27017/devmoviesdb',
  SECRET_CODE = 'aliens',
} = process.env;

module.exports = {
  PORT,
  MONGO_DB,
  SECRET_CODE,
};

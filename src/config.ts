import 'dotenv/config';

const {
  PORT = 3000,
  DB_HOST = 'mongodb://localhost:27017/mestodb',
  SECRET_KEY = 'secret_key',
} = process.env;

export { PORT, DB_HOST, SECRET_KEY };

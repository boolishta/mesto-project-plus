import 'dotenv/config';

const { PORT = 3000, DB_HOST = '' } = process.env;

export { PORT, DB_HOST };

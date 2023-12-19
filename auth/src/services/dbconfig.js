const config = {
  user: process.env.DB_USERS_USER,
  password: process.env.DB_USERS_PASS,
  server: process.env.DB_USERS_HOST,
  database: process.env.DB_USERS_NAME,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

module.exports = config;

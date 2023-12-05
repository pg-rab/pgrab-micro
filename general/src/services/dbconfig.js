const config = {
  user: process.env.DB_GACC_USER,
  password: process.env.DB_GACC_PASS,
  server: process.env.DB_GACC_HOST,
  database: process.env.DB_GACC_NAME,
  port: parseInt(process.env.DB_GACC_PORT),
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

module.exports = config;

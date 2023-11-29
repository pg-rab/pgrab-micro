const config = {
  user: process.env.DB_TIMB_USER,
  password: process.env.DB_TIMB_PASS,
  server: process.env.DB_TIMB_HOST,
  database: process.env.DB_TIMB_NAME,
  port: parseInt(process.env.DB_TIMB_PORT),
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

module.exports = config;

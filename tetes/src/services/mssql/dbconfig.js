export const config = {
  user: process.env.DB_TETES_USER,
  password: process.env.DB_TETES_PASS,
  server: process.env.DB_TETES_HOST,
  database: process.env.DB_TETES_NAME,
  port: 1444,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

// module.exports = config;

const config = {
  user: process.env.DB_TETES_USER,
  password: process.env.DB_TETES_PASS,
  server: process.env.DB_TETES_HOST,
  database: process.env.DB_TETES_NAME,
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
}

module.exports = config;
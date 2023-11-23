const config = {
  user: process.env.DB_TIMB_USER,
  password: process.env.DB_TIMB_PASS,
  server: process.env.DB_TIMB_HOST,
  database: process.env.DB_TIMB_NAME,
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
}

module.exports = config;
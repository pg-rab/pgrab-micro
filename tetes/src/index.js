import Hapi from "@hapi/hapi";
import sql from "mssql";
import { config } from "./services/mssql/dbconfig.js";
import "dotenv/config";

const sqlPool = new sql.ConnectionPool({
  user: process.env.DB_TETES_USER,
  password: process.env.DB_TETES_PASS,
  server: process.env.DB_TETES_HOST,
  database: process.env.DB_TETES_NAME,
  port: 1444,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
});
// Set Initial Server
const server = Hapi.server({
  port: process.env.PORT,
  host: process.env.HOST,
});

// Set start function for server
export const start = async () => {
  await server.start();
  return server;
};

// Start server
(async () => {
  try {
    sqlPool
      .connect()
      .then(async function (pool) {
        server.app.locals.db = pool;
        await start();
        console.log(`Server berjalan pada ${server.info.uri}`);
      })
      .catch(function (e) {
        console.log(e);
      });
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
})();

export default server;

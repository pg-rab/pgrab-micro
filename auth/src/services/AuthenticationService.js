const { connect } = require("mssql");
const config = require("./dbconfig");
const Boom = require("@hapi/boom");

class Authenticationservice {
  constructor() {
    this._pool;
    this.poolConnect();
  }

  async poolConnect() {
    this._pool = await connect(config);
  }

  async addAccesstoken() {
    const idlog = new Date();
    const result = await this._pool
      .request()
      .query(
        `INSERT INTO [USERS].[dbo].[Tbl_Log] (id_log, id_user, id_app, aktif, tgl_aktif, token) VALUES ()`
      );
  }
}

module.exports = Authenticationservice;

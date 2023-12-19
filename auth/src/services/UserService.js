const Boom = require("@hapi/boom");
const { connect } = require("mssql");
const config = require("./dbconfig");
const Bcrypt = require("bcryptjs");

class UsersService {
  constructor() {
    this._pool;
    this.poolConnect();
  }

  async poolConnect() {
    this._pool = await connect(config);
  }

  async verifyNewUsername() {
    const result = await this._pool
      .request()
      .query(`SELECT uname FROM [USERS].[dbo].[Tbl_User] WHERE uname='afdi'`);
    // console.log(result);
    // return result.rowsAffected;
    if (result.rowAffected > 0) {
      return Boom.unauthorized("");
    }
  }

  async verifyUserCredential(uname, pass) {
    const result = await this._pool
      .request()
      .query(
        `SELECT id_user, nama, uname, passw FROM [USERS].[dbo].[Tbl_User] WHERE uname='${uname}'`
      );
    // console.log(result.recordset.length);
    if (result.recordset.length == 0) {
      throw Boom.unauthorized("Kredensial yang Anda berikan salah");
    }

    const { id_user, passw: hashedPass } = result.recordset[0];

    const match = await Bcrypt.compare(pass, hashedPass);
    if (!match) {
      throw Boom.unauthorized("Kredensial yang Anda berikan salah");
    }
    // console.log(match);
    return id_user;
  }

  // async addUser({ }) {
  //     const result = await this._pool
  //         .request()
  //         .query(`SELECT uname FROM dbo.Tbl_User WHERE uname=${username}`);
  //     if (result.rowCount > 0) {
  //         throw Boom.badRequest('Gagal tambah user baru. Username sudah digunakan')
  //     }
  // }
}

module.exports = UsersService;

const config = require("./dbconfig");
const { connect } = require("mssql");
const Boom = require("@hapi/boom");

class PengajuanLahanService {
  constructor() {
    this._pool;
    this.poolConnect();
  }

  async poolConnect() {
    this._pool = await connect(config);
  }

  async getRayon() {
    try {
      const data = await this._pool.request()
        .query(`SELECT [IDRAYON],[NMRAYON],[RRAYON] FROM [G_ACC].[dbo].[TAB_TAN_RAYON]`);
      return data.recordset;
    } catch (e) {
      throw Boom.internal(e);
    }
  }

  async getKategori() {
    try {
      const kategori = await this._pool
        .request()
        .query(`SELECT [IDSKW],[NMSKW] FROM [G_ACC].[dbo].[TAB_TAN_SKW]`);
      return kategori.recordset;
    } catch (e) {
      throw Boom.internal(e);
    }
  }

  async getKategori() {
    try {
      const kategori = await this._pool
        .request()
        .query(`SELECT [IDSKW],[NMSKW] FROM [G_ACC].[dbo].[TAB_TAN_SKW]`);
      return kategori.recordset;
    } catch (e) {
      throw Boom.internal(e);
    }
  }

}

module.exports = PengajuanLahanService;

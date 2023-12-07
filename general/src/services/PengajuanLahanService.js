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
        .query(`SELECT [IDRAYON],[NMRAYON],[RRAYON] 
                  FROM [DBUTAMA].[G_ACC].[dbo].[TAB_TAN_RAYON]`);
      return data.recordset;
    } catch (e) {
      throw Boom.internal(e);
    }
  }

  async getAfdeling() {
    try {
      const data = await this._pool
        .request()
        .query(`SELECT [IDSKW],[NMSKW] FROM [DBUTAMA].[G_ACC].[dbo].[TAB_TAN_SKW]`);
      return data.recordset;
    } catch (e) {
      throw Boom.internal(e);
    }
  }

  async getKategori() {
    try {
      const data = await this._pool
        .request()
        .query(`SELECT [IDKTGR],[NMKTGR],[KDPERK],[PERKIPL],[PERKTU],[BBIT],[PERS] 
                  FROM [DBUTAMA].[G_ACC].[dbo].[TAB_TAN_KTGR] WHERE STATUS=1`);
      return data.recordset;
    } catch (e) {
      throw Boom.internal(e);
    }
  }

  async getKebun() {
    try {
      const data = await this._pool
        .request()
        .query(`SELECT [KD_DESA],[DESA],[KD_KEC],[KECAMATAN],[KD_KAB],[KABUPATEN]
                  FROM [DBUTAMA].[PENGAJUAN].[dbo].[V_DB_KEBUN]`);
      return data.recordset;
    } catch (e) {
      throw Boom.internal(e);
    }
  }

  async getPetani() {
    try {
      const data = await this._pool
        .request()
        .query(`SELECT [ID],[KTP],[NAMA] 
                  FROM [DBUTAMA].[PENGAJUAN].[dbo].[DB_PETANI] ORDER BY NAMA`);
      return data.recordset;
    } catch (e) {
      throw Boom.internal(e);
    }
  }

  async getUrut(mt, id) {
    try {
      const kategori = await this._pool
        .request()
        .query(`SELECT LEFT(KD_PENGAJUAN,11) AS KD, COUNT(*) AS JML
                  FROM [DBUTAMA].[PENGAJUAN].[dbo].[AUTO_NUMBER]
                  WHERE KD_MT='${mt}' AND LEFT(KD_PENGAJUAN,11)='${id}'
                  GROUP BY LEFT(KD_PENGAJUAN,11)`);
      if (kategori.recordset.length <= 0) {
        return { KD: id, JML: 0 };
      } else {
        return kategori.recordset[0];
      }
    } catch (e) {
      throw Boom.internal(e);
    }
  }

}

module.exports = PengajuanLahanService;

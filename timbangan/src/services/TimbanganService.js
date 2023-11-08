const config = require("./dbconfig");
const sql = require("mssql");
const Boom = require("@hapi/boom");

class TimbanganService {
  constructor() {
    // this._pool =  new sql.ConnectionPool(config);
  }

  async getKategori() {
    try {
      const pool = await sql.connect(config);
      const kategori = await pool
        .request()
        .query(`SELECT * FROM [TIMBANGAN].[dbo].[TAB_KATAGORI]`);
      return kategori.recordset;
    } catch (e) {
      throw Boom.internal(e);
    }
  }

  async getPos() {
    try {
      const pool = await sql.connect(config);
      const pos = await pool
        .request()
        .query(`SELECT * FROM [TIMBANGAN].[dbo].[TAB_POS]`);
      return pos.recordset;
    } catch (e) {
      throw Boom.internal(e);
    }
  }

  async getHariPemasukan() {
    try {
      const pool = await sql.connect(config);
      const hari = await pool
        .request()
        .query(
          `SELECT HARI_PEMASUKAN FROM [TIMBANGAN].[dbo].[TAB_PEMASUKAN_TEBU] GROUP BY HARI_PEMASUKAN ORDER BY HARI_PEMASUKAN DESC`
        );
      return hari.recordset;
    } catch (e) {
      throw Boom.internal(e);
    }
  }

  async getPemasukan(tg, lim) {
    try {
      const pool = await sql.connect(config);
      const pemasukan = await pool.request()
        .query(`SELECT ${lim} SPA,NO_URUT,NO_TRUK,ID_INDUK,GROSS,TARA,NETTO,KW_NETTO,LUAS_TEBANG,NO_LORI,MEJA,TGL_MASUK,TGL_TIMB1,TGL_LORI,TGL_MEJA,TGL_KELUAR,HARI_MASUK,HARI_PEMASUKAN,SHIFT_PEMASUKAN,HARI_GILING,SHIFT_GILING,TGL_LAP,IDTRUK_BC 
                                                FROM [TIMBANGAN].[dbo].[TAB_PEMASUKAN_TEBU] ${tg}`);
      return pemasukan.recordset;
    } catch (e) {
      throw Boom.internal(e);
    }
  }

  async getPemasukanPerKebun(hr, ktg) {
    try {
      const pool = await sql.connect(config);
      const data = await pool.request()
        .query(`SELECT right(left(TAB_REGISTER.id_induk,8),3)as ktgr,TAB_REGISTER.id_induk,TAB_REGISTER.kelompok,TAB_REGISTER.kebun,TAB_REGISTER.luas,TAB_REGISTER.tasaksi,
                                                      count(case when tab_pemasukan_tebu.hari_pemasukan='${hr}' then tab_pemasukan_tebu.hari_pemasukan end) as rihi,
                                                      count(case when tab_pemasukan_tebu.hari_pemasukan between '000' and '${hr}' then tab_pemasukan_tebu.hari_pemasukan end) as risdhi,
                                                      isnull(sum(case when tab_pemasukan_tebu.hari_pemasukan='${hr}' then tab_pemasukan_tebu.kw_netto end),0) as brthi,
                                                      isnull(sum(case when tab_pemasukan_tebu.hari_pemasukan between '000' and '${hr}' then tab_pemasukan_tebu.kw_netto end),0) as brtsdhi
                                                    FROM TAB_PEMASUKAN_TEBU
                                                    INNER JOIN  TAB_REGISTER on TAB_PEMASUKAN_TEBU.id_induk=TAB_REGISTER.id_induk
                                                    WHERE right(left(TAB_REGISTER.id_induk,8),3)='${ktg}'
                                                    GROUP BY TAB_REGISTER.id_induk,TAB_REGISTER.kelompok,TAB_REGISTER.kebun,TAB_REGISTER.luas,TAB_REGISTER.tasaksi`);
      return data.recordset;
    } catch (e) {
      throw Boom.internal(e);
    }
  }

  async getDigilPerjamSpaLolos() {
    try {
      const pool = await sql.connect(config);
      const data = await pool.request()
        .query(`SELECT spa,no_truk,tab_register.id_induk,kelompok,kebun,kw_netto,tgl_masuk,hari_pemasukan,tgl_keluar from TAB_PEMASUKAN_TEBU
                                                  INNER JOIN tab_register on right( tab_register.id_induk,4)=right(tab_pemasukan_tebu.id_induk,4)
                                                  WHERE not kw_netto is null and no_lori is null and hari_giling is null
                                                  ORDER BY tgl_keluar`);

      return data.recordset;
    } catch (e) {
      throw Boom.internal(e);
    }
  }

  // async getPemasukan(tg,lim) {

  //   try {
  //     const pool = await sql.connect(config);
  //     const pemasukan = await pool.request().query(`SELECT ${lim} SPA,NO_URUT,NO_TRUK,ID_INDUK,GROSS,TARA,NETTO,KW_NETTO,LUAS_TEBANG,NO_LORI,MEJA,TGL_MASUK,TGL_TIMB1,TGL_LORI,TGL_MEJA,TGL_KELUAR,HARI_MASUK,HARI_PEMASUKAN,SHIFT_PEMASUKAN,HARI_GILING,SHIFT_GILING,TGL_LAP,IDTRUK_BC
  //                                                 FROM [TIMBANGAN].[dbo].[TAB_PEMASUKAN_TEBU] ${tg}`);
  //     return pemasukan.recordsets;
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }
}

module.exports = TimbanganService;

const config = require("./dbconfig");
const { connect } = require("mssql");
const Boom = require("@hapi/boom");

class TimbanganService {
  constructor() {
    // this._pool = new ConnectionPool(config);
    this._pool;
    this.poolConnect();
  }

  async poolConnect() {
    this._pool = await connect(config);
  }

  async getKategori() {
    try {
      const kategori = await this._pool
        .request()
        .query(`SELECT * FROM [TIMBANGAN].[dbo].[TAB_KATAGORI]`);
      return kategori.recordset;
    } catch (e) {
      throw Boom.internal(e);
    }
  }

  async getPos() {
    try {
      const pos = await this._pool
        .request()
        .query(`SELECT * FROM [TIMBANGAN].[dbo].[TAB_POS]`);
      return pos.recordset;
    } catch (e) {
      throw Boom.internal(e);
    }
  }

  async getHariPemasukan() {
    try {
      const hari = await this._pool
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
      const pemasukan = await this._pool.request()
        .query(`SELECT ${lim} SPA,NO_URUT,NO_TRUK,ID_INDUK,GROSS,TARA,NETTO,KW_NETTO,LUAS_TEBANG,NO_LORI,MEJA,TGL_MASUK,TGL_TIMB1,TGL_LORI,
                  TGL_MEJA,TGL_KELUAR,HARI_MASUK,HARI_PEMASUKAN,SHIFT_PEMASUKAN,HARI_GILING,SHIFT_GILING,TGL_LAP,IDTRUK_BC 
                FROM [TIMBANGAN].[dbo].[TAB_PEMASUKAN_TEBU] ${tg}`);
      return pemasukan.recordset;
    } catch (e) {
      throw Boom.internal(e);
    }
  }

  async getPemasukanPerKebun(hr, ktg) {
    try {
      const data = await this._pool.request()
        .query(`SELECT ROW_NUMBER() OVER(ORDER BY TAB_REGISTER.ID_INDUK) as NO, right(left(TAB_REGISTER.ID_INDUK,8),3)as KTGR,TAB_REGISTER.ID_INDUK,TAB_REGISTER.KELOMPOK,TAB_REGISTER.KEBUN,TAB_REGISTER.LUAS,TAB_REGISTER.TASAKSI,
                  count(case when tab_pemasukan_tebu.hari_pemasukan=${hr} then tab_pemasukan_tebu.hari_pemasukan end) as RIHI,
                  count(case when tab_pemasukan_tebu.hari_pemasukan between '000' and ${hr} then tab_pemasukan_tebu.hari_pemasukan end) as RISDHI,
                  isnull(sum(case when tab_pemasukan_tebu.hari_pemasukan=${hr} then tab_pemasukan_tebu.kw_netto end),0) as BRTHI,
                  isnull(sum(case when tab_pemasukan_tebu.hari_pemasukan between '000' and ${hr} then tab_pemasukan_tebu.kw_netto end),0) as BRTSDHI,
                  isnull(sum(case when tab_pemasukan_tebu.hari_pemasukan between '000' and ${hr} then tab_pemasukan_tebu.kw_netto end),0)/TAB_REGISTER.LUAS as KUHA,
                  ((isnull(sum(case when tab_pemasukan_tebu.hari_pemasukan between '000' and ${hr} then tab_pemasukan_tebu.kw_netto end),0)/TAB_REGISTER.LUAS/TAB_REGISTER.TASAKSI)*100) as PROSEN
                FROM TAB_PEMASUKAN_TEBU
                INNER JOIN  TAB_REGISTER on TAB_PEMASUKAN_TEBU.ID_INDUK=TAB_REGISTER.ID_INDUK
                WHERE right(left(TAB_REGISTER.id_induk,8),3)=${ktg}
                GROUP BY TAB_REGISTER.id_induk,TAB_REGISTER.KELOMPOK,TAB_REGISTER.KEBUN,TAB_REGISTER.LUAS,TAB_REGISTER.TASAKSI`);
      return data.recordset;
    } catch (e) {
      throw Boom.internal(e);
    }
  }

  async getPemasukanPerKategori(hr) {
    try {
      // let filter = (hr != null) ? 'WHERE ' : '';
      // filter += (hr != null) ? `(HARI_PEMASUKAN = ${hr})` : '';

      const data = await this._pool.request()
        .query(`SELECT A.KTGR, B.JMLRIT AS JMLRITGAWANG, A.JMLRIT, A.JMLBERAT, A.HARI_PEMASUKAN
                FROM   dbo.V_BERAT_KATEGORI AS A,  dbo.V_DATA_ANTRIAN_POSGAWANG AS B
                WHERE A.KTGR=B.KTGR AND (A.HARI_PEMASUKAN=${hr}) AND (B.HARI_MASUK=${hr})
                ORDER BY A.KTGR`);

      return data.recordset;
    } catch (e) {
      throw Boom.internal(e);
    }
  }

  async getPemasukanPerJam(hr) {
    try {
      const data = await this._pool.request()
        .query(`SELECT  dbo.TAB_JAM.URUT, RTRIM(dbo.TAB_JAM.JAM) AS JAM, COUNT(CASE WHEN HARI_MASUK = '${hr}' AND (RIGHT(LEFT(ID_INDUK, 8), 3) = 561 OR
                        RIGHT(LEFT(ID_INDUK, 8), 3) = 562) THEN JAM END) AS RITTS, COUNT(CASE WHEN HARI_MASUK = '${hr}' AND (RIGHT(LEFT(ID_INDUK, 8), 3) = 541 OR
                        RIGHT(LEFT(ID_INDUK, 8), 3) = 542) THEN JAM END) AS RITTRKA, COUNT(CASE WHEN HARI_MASUK = '${hr}' AND RIGHT(LEFT(ID_INDUK, 8), 3) = 400 THEN JAM END) AS RITKBD, 
                        COUNT(CASE WHEN HARI_MASUK = '${hr}' AND RIGHT(LEFT(ID_INDUK, 8), 3) = 566 THEN JAM END) AS RITRKB, COUNT(CASE WHEN HARI_MASUK = '${hr}' THEN RIGHT(LEFT(ID_INDUK, 8), 3) END) 
                        AS RITHI, COUNT(CASE WHEN CONVERT(int, HARI_MASUK) = '${hr - 1}' THEN JAM END) AS RITYL
                FROM    dbo.TAB_PEMASUKAN_TEBU LEFT OUTER JOIN
                        dbo.TAB_JAM ON DATEPART(HOUR, dbo.TAB_PEMASUKAN_TEBU.TGL_MASUK) = dbo.TAB_JAM.JAM
                GROUP BY dbo.TAB_JAM.URUT, dbo.TAB_JAM.JAM
                ORDER BY dbo.TAB_JAM.URUT`);
      return data.recordset;
    } catch (e) {
      throw Boom.internal(e);
    }
  }

  async getPemasukanPerShift() {
    try {
      const data = await this._pool.request()
        .query(`SELECT  HARI_PEMASUKAN, SUM(CASE SHIFT WHEN 1 THEN RIT ELSE 0 END) AS RITPAGI, SUM(CASE SHIFT WHEN 1 THEN BERAT ELSE 0 END) AS BRTPAGI, 
                        SUM(CASE SHIFT WHEN 2 THEN RIT ELSE 0 END) AS RITSIANG, SUM(CASE SHIFT WHEN 2 THEN BERAT ELSE 0 END) AS BRTSIANG, SUM(CASE SHIFT WHEN 3 THEN RIT ELSE 0 END) 
                        AS RITMALAM, SUM(CASE SHIFT WHEN 3 THEN BERAT ELSE 0 END) AS BRTMALAM, SUM(RIT) AS RITTOT, SUM(BERAT) AS BERATTOT
                FROM    dbo.V_TAB_PEMASUKAN_PERSHIFT
                GROUP BY HARI_PEMASUKAN`);
      return data.recordset;
    } catch (e) {
      throw Boom.internal(e);
    }
  }

  async getPemasukanPosPerJam(hr = null, ktg = null, jm = null) {
    let filter = '';
    if (hr != null || ktg != null || jm != null) {
      filter = ' WHERE ';
      if (hr != null) {
        filter += `(dbo.V_DATA_PEMASUKAN_VS_MASTER_SPA.HARI_MASUK = '${hr}') `;
        if (ktg != null || jm != null) {
          filter += ' AND ';
        }
      }
      if (ktg != null) {
        filter += `(RIGHT(LEFT(dbo.V_DATA_PEMASUKAN_VS_MASTER_SPA.ID_INDUK, 8), 3) = ${ktg}) `;
        if (jm != null) {
          filter += ' AND ';
        }
      }
      if (jm != null) {
        filter += `({ fn HOUR(dbo.V_DATA_PEMASUKAN_VS_MASTER_SPA.TGL_MASUK) } = ${jm}) `;
      }
    }
    else {
      filter += `WHERE NOT HARI_MASUK IS NULL`
    }

    try {
      const data = await this._pool.request()
        .query(`SELECT dbo.V_DATA_PEMASUKAN_VS_MASTER_SPA.HARI_MASUK, { fn HOUR(dbo.V_DATA_PEMASUKAN_VS_MASTER_SPA.TGL_MASUK) } AS JAM, 
                        RIGHT(LEFT(dbo.V_DATA_PEMASUKAN_VS_MASTER_SPA.ID_INDUK, 8), 3) AS ktgr, RIGHT(LEFT(dbo.V_DATA_PEMASUKAN_VS_MASTER_SPA.ID_INDUK, 10), 1) AS pos, dbo.TAB_POS.NAMA, 
                        COUNT(RIGHT(LEFT(dbo.V_DATA_PEMASUKAN_VS_MASTER_SPA.ID_INDUK, 10), 1)) AS rit
                FROM   dbo.V_DATA_PEMASUKAN_VS_MASTER_SPA RIGHT OUTER JOIN
                        dbo.TAB_POS ON dbo.TAB_POS.ID_POS = RIGHT(LEFT(dbo.V_DATA_PEMASUKAN_VS_MASTER_SPA.ID_INDUK, 10), 5)
                ${filter}
                GROUP BY dbo.V_DATA_PEMASUKAN_VS_MASTER_SPA.HARI_MASUK, RIGHT(LEFT(dbo.V_DATA_PEMASUKAN_VS_MASTER_SPA.ID_INDUK, 8), 3), 
                        RIGHT(LEFT(dbo.V_DATA_PEMASUKAN_VS_MASTER_SPA.ID_INDUK, 10), 1), { fn HOUR(dbo.V_DATA_PEMASUKAN_VS_MASTER_SPA.TGL_MASUK) }, dbo.TAB_POS.NAMA`);
      return data.recordset;
    } catch (e) {
      throw Boom.internal(e);
    }
  }

  async getPemasukanPerSkw(hr, ktg) {
    try {
      const data = await this._pool.request()
        .query(`SELECT HARI_PEMASUKAN , SUM(CASE SHIFT WHEN 1 THEN RIT ELSE 0 END) AS RITPAGI , (CASE SHIFT WHEN 1 THEN BERAT ELSE 0 END) AS BRTPAGI , SUM(CASE SHIFT WHEN 2 THEN RIT ELSE 0 END) AS RITSIANG , 
                      SUM(CASE SHIFT WHEN 2 THEN BERAT ELSE 0 END) AS BRTSIANG , SUM(CASE SHIFT WHEN 3 THEN RIT ELSE 0 END) AS RITMALAM , SUM(CASE SHIFT WHEN 3 THEN BERAT ELSE 0 END) AS BRTMALAM , SUM(RIT) AS RITTOT, SUM(BERAT) AS BERATTOT 
                  FROM dbo.V_TAB_PEMASUKAN_PERSHIFT  
                  GROUP BY HARI_PEMASUKAN`);
      return data.recordset;
    } catch (e) {
      throw Boom.internal(e);
    }
  }

  async getDigilPerjamSpaLolos() {
    try {
      const data = await this._pool.request()
        .query(`SELECT SPA,NO_TRUK,TAB_REGISTER.ID_INDUK,KELOMPOK,KEBUN,KW_NETTO,TGL_MASUK,HARI_PEMASUKAN,TGL_KELUAR 
                FROM TAB_PEMASUKAN_TEBU
                INNER JOIN TAB_REGISTER ON RIGHT( TAB_REGISTER.ID_INDUK,4)=RIGHT(TAB_PEMASUKAN_TEBU.ID_INDUK,4)
                WHERE NOT KW_NETTO IS NULL AND NO_LORI IS NULL AND HARI_GILING IS NULL
                ORDER BY TGL_KELUAR`);

      return data.recordset;
    } catch (e) {
      throw Boom.internal(e);
    }
  }

  async getAntrianLori() {
    try {
      const data = await this._pool.request()
        .query(`SELECT dbo.TAB_PEMASUKAN_TEBU.SPA, dbo.TAB_PEMASUKAN_TEBU.NO_TRUK, dbo.TAB_PEMASUKAN_TEBU.NO_LORI,BERATSDHR, 
                    dbo.TAB_PEMASUKAN_TEBU.ID_INDUK, dbo.TAB_REGISTER.KELOMPOK,dbo.TAB_REGISTER.KEBUN, dbo.TAB_PEMASUKAN_TEBU.TGL_MASUK, dbo.TAB_PEMASUKAN_TEBU.KW_NETTO, 
                    RIGHT(LEFT(dbo.TAB_PEMASUKAN_TEBU.ID_INDUK, 8), 3) AS ID_KTGR,datediff(hour,dbo.TAB_PEMASUKAN_TEBU.TGL_MASUK,getdate()) as LAMAJAM 
                FROM dbo.TAB_PEMASUKAN_TEBU INNER JOIN 
                    dbo.TAB_REGISTER ON dbo.TAB_PEMASUKAN_TEBU.ID_INDUK = dbo.TAB_REGISTER.ID_INDUK INNER JOIN 
                    dbo.TAB_MASTER_SPA ON RIGHT(dbo.TAB_PEMASUKAN_TEBU.SPA, 7) = dbo.TAB_MASTER_SPA.SPA 
                WHERE (dbo.TAB_PEMASUKAN_TEBU.HARI_GILING IS NULL) AND not (dbo.TAB_PEMASUKAN_TEBU.NO_LORI IS NULL) and not  kw_netto IS NULL AND ditolak is null 
                ORDER BY dbo.TAB_PEMASUKAN_TEBU.TGL_MASUK`);

      return data.recordset;
    } catch (e) {
      throw Boom.internal(e);
    }
  }

  async getAntrianTruk() {
    try {
      const data = await this._pool.request()
        .query(`SELECT dbo.TAB_PEMASUKAN_TEBU.SPA, dbo.TAB_PEMASUKAN_TEBU.NO_TRUK,
                    dbo.TAB_PEMASUKAN_TEBU.ID_INDUK, dbo.TAB_REGISTER.KELOMPOK,dbo.TAB_REGISTER.KEBUN, dbo.TAB_PEMASUKAN_TEBU.TGL_MASUK,
                    RIGHT(LEFT(dbo.TAB_PEMASUKAN_TEBU.ID_INDUK, 8), 3) AS ID_KTGR,datediff(hour,dbo.TAB_PEMASUKAN_TEBU.TGL_MASUK,getdate()) as lamajam
                FROM dbo.TAB_PEMASUKAN_TEBU INNER JOIN
                    dbo.TAB_REGISTER ON dbo.TAB_PEMASUKAN_TEBU.ID_INDUK = dbo.TAB_REGISTER.ID_INDUK INNER JOIN
                    dbo.TAB_MASTER_SPA ON RIGHT(dbo.TAB_PEMASUKAN_TEBU.SPA, 7) = dbo.TAB_MASTER_SPA.SPA
                WHERE (dbo.TAB_PEMASUKAN_TEBU.HARI_GILING IS NULL) AND (dbo.TAB_PEMASUKAN_TEBU.NO_LORI IS NULL) and not gross is null and  kw_netto IS NULL AND ditolak is null
                ORDER BY dbo.TAB_PEMASUKAN_TEBU.TGL_MASUK`);

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

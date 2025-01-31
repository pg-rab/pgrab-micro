const config = require("./dbconfig");
const { connect } = require("mssql");
const Boom = require("@hapi/boom");

class TimbanganService {
  constructor() {
    this._pool;
    this.poolConnect();
  }

  async poolConnect() {
    this._pool = await connect(config);
  }

  async getDefaultSet() {
    try {
      const data = await this._pool.request()
        .query(`SELECT NM_DEFAULT, NO_URUT, TGL_HARIAN, NO_ANALISA_M0, NO_ANALISA_M1, NO_ANALISA_M2, NO_ANALISA_M3, NO_ANALISA_M4, HARI_PEMASUKAN, HARI_GILING, JAM_RESET, 
                       JAM_TRANSFER, TGL_LAP, TGL_AWAL_PEMASUKAN, TGL_AWAL_GILING, MINUS_PEMASUKAN, FAKTOR_RENDEMEN, SUB_ZPK, POT_TERBAKAR, CETAK_HARI_PEMASUKAN, 
                       CETAK_HARI_GILING, DITASIR, POTONGAN, JML_LORI, JML_MANDOR, PERIODE, NPP, HKUNDIAN, RAF_PERSEN, RAFAKSI, RAF_DADUK, RAF_PUCUK, RAF_SOGOL, RAF_DPS, UMATR, 
                       BERAT_RIT, TGL, TAMBAH_JAM, TGL_STGIL, MAX_HARGA_TEBU, RTETES, RGULA, HRGGULA, HRGTTS, BIAYAFC, BIAYAVC, GENAP, KASIE, BRTLORI, COFM, ORPABRIK, KSPA
                FROM   dbo.TAB_DEFAULT
                WHERE  (NM_DEFAULT = 'setting1')`);
      return data.recordset;
    } catch (e) {
      throw Boom.internal(e);
    }
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

  async getHariGiling() {
    try {
      const hari = await this._pool
        .request()
        .query(
          `SELECT HARI_GILING FROM [TIMBANGAN].[dbo].[TAB_PEMASUKAN_TEBU] GROUP BY HARI_GILING ORDER BY HARI_GILING DESC`
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
                        AS RITHI, COUNT(CASE WHEN CONVERT(int, HARI_MASUK) = '${hr - 1
          }' THEN JAM END) AS RITYL
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
    let filter = "";
    if (hr != null || ktg != null || jm != null) {
      filter = " WHERE ";
      if (hr != null) {
        filter += `(dbo.V_DATA_PEMASUKAN_VS_MASTER_SPA.HARI_MASUK = '${hr}') `;
        if (ktg != null || jm != null) {
          filter += " AND ";
        }
      }
      if (ktg != null) {
        filter += `(RIGHT(LEFT(dbo.V_DATA_PEMASUKAN_VS_MASTER_SPA.ID_INDUK, 8), 3) = ${ktg}) `;
        if (jm != null) {
          filter += " AND ";
        }
      }
      if (jm != null) {
        filter += `({ fn HOUR(dbo.V_DATA_PEMASUKAN_VS_MASTER_SPA.TGL_MASUK) } = ${jm}) `;
      }
    } else {
      filter += `WHERE NOT HARI_MASUK IS NULL`;
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
      const hrYl = parseInt(hr) < 10 ? `0${parseInt(hr)}` : `${parseInt(hr)}`;
      const data = await this._pool.request()
        .query(`SELECT  LEFT(dbo.TAB_TAKMAR_POTENSI_SKW.ID, 4) AS ktgr, dbo.TAB_SKW.ID_SKW, dbo.TAB_SKW.NAMA, COUNT(CASE WHEN TAB_PEMASUKAN_TEBU.hari_pemasukan = '${hrYl}' AND 
                        RIGHT(LEFT(TAB_PEMASUKAN_TEBU.id_induk, 8), 3) = ${ktg} THEN TAB_SKW.id_skw END) AS rityl, COUNT(CASE WHEN TAB_PEMASUKAN_TEBU.hari_pemasukan = ${hr} AND 
                        RIGHT(LEFT(TAB_PEMASUKAN_TEBU.id_induk, 8), 3) = ${ktg} THEN TAB_SKW.id_skw END) AS rithi, dbo.TAB_TAKMAR_POTENSI_SKW.TAKMAR, dbo.TAB_TAKMAR_POTENSI_SKW.POTENSI, 
                        ISNULL(SUM(CASE WHEN (TAB_PEMASUKAN_TEBU.hari_pemasukan BETWEEN '000' AND ${hr}) AND RIGHT(LEFT(TAB_PEMASUKAN_TEBU.id_induk, 8), 3) = ${ktg} THEN TAB_PEMASUKAN_TEBU.kw_netto END), 0) AS berat
                FROM    dbo.TAB_PEMASUKAN_TEBU LEFT OUTER JOIN
                        dbo.TAB_SKW ON dbo.TAB_SKW.ID_SKW = RIGHT(LEFT(dbo.TAB_PEMASUKAN_TEBU.ID_INDUK, 4), 2) LEFT OUTER JOIN
                        dbo.TAB_TAKMAR_POTENSI_SKW ON dbo.TAB_TAKMAR_POTENSI_SKW.SKW = RIGHT(LEFT(dbo.TAB_PEMASUKAN_TEBU.ID_INDUK, 4), 2)
                WHERE   (RIGHT(LEFT(dbo.TAB_TAKMAR_POTENSI_SKW.ID, 4), 3) = ${ktg})
                GROUP BY dbo.TAB_TAKMAR_POTENSI_SKW.ID, dbo.TAB_SKW.NAMA, dbo.TAB_SKW.ID_SKW, dbo.TAB_TAKMAR_POTENSI_SKW.TAKMAR, dbo.TAB_TAKMAR_POTENSI_SKW.POTENSI`);
      return data.recordset;
    } catch (e) {
      throw Boom.internal(e);
    }
  }

  async getPemasukanPosGawang(hr, ktg) {
    try {
      const hrYl = parseInt(hr) < 10 ? `0${parseInt(hr)}` : `${parseInt(hr)}`;
      const data = await this._pool.request()
        .query(`SELECT  LEFT(dbo.TAB_TAKMAR_POTENSI_SKW.ID, 4) AS ktgr, dbo.TAB_SKW.ID_SKW, dbo.TAB_SKW.NAMA, COUNT(CASE WHEN TAB_PEMASUKAN_TEBU.hari_pemasukan = '${hrYl}' AND 
                        RIGHT(LEFT(TAB_PEMASUKAN_TEBU.id_induk, 8), 3) = ${ktg} THEN TAB_SKW.id_skw END) AS rityl, COUNT(CASE WHEN TAB_PEMASUKAN_TEBU.hari_pemasukan = ${hr} AND 
                        RIGHT(LEFT(TAB_PEMASUKAN_TEBU.id_induk, 8), 3) = ${ktg} THEN TAB_SKW.id_skw END) AS rithi, dbo.TAB_TAKMAR_POTENSI_SKW.TAKMAR, dbo.TAB_TAKMAR_POTENSI_SKW.POTENSI, 
                        ISNULL(SUM(CASE WHEN (TAB_PEMASUKAN_TEBU.hari_pemasukan BETWEEN '000' AND ${hr}) AND RIGHT(LEFT(TAB_PEMASUKAN_TEBU.id_induk, 8), 3) = ${ktg} THEN TAB_PEMASUKAN_TEBU.kw_netto END), 0) AS berat
                FROM    dbo.TAB_PEMASUKAN_TEBU LEFT OUTER JOIN
                        dbo.TAB_SKW ON dbo.TAB_SKW.ID_SKW = RIGHT(LEFT(dbo.TAB_PEMASUKAN_TEBU.ID_INDUK, 4), 2) LEFT OUTER JOIN
                        dbo.TAB_TAKMAR_POTENSI_SKW ON dbo.TAB_TAKMAR_POTENSI_SKW.SKW = RIGHT(LEFT(dbo.TAB_PEMASUKAN_TEBU.ID_INDUK, 4), 2)
                WHERE   (RIGHT(LEFT(dbo.TAB_TAKMAR_POTENSI_SKW.ID, 4), 3) = ${ktg})
                GROUP BY dbo.TAB_TAKMAR_POTENSI_SKW.ID, dbo.TAB_SKW.NAMA, dbo.TAB_SKW.ID_SKW, dbo.TAB_TAKMAR_POTENSI_SKW.TAKMAR, dbo.TAB_TAKMAR_POTENSI_SKW.POTENSI`);
      return data.recordset;
    } catch (e) {
      throw Boom.internal(e);
    }
  }

  async getDigilPerJam(hr) {
    try {
      const data = await this._pool.request()
        .query(`SELECT HARI_GILING,URUT,JAM, COUNT(CASE WHEN MEJA > 4 THEN MEJA  END) AS RITGB, 
                    isnull(SUM(CASE WHEN MEJA > 4 THEN KW_NETTO END),0) AS BRTGB, 	
                  COUNT(CASE WHEN MEJA < 5 THEN MEJA  END) AS RITGT, 
                  isnull(SUM(CASE WHEN MEJA < 5 THEN KW_NETTO  END),0) AS BRTGT, 
                  count(CASE WHEN isnull(no_lori,0)=0  THEN isnull(no_lori,0)  END) AS RITTRUK, 	
                  SUM(CASE WHEN isnull(no_lori,0)=0  THEN KW_NETTO ELSE 0  END) AS BRTTRUK, 
                  count(CASE WHEN isnull(no_lori,0)<>0  THEN isnull(no_lori,0)  END) AS RITLORI, 	
                  SUM(CASE WHEN isnull(no_lori,0)<>0  THEN KW_NETTO ELSE 0  END) AS BRTLORI, 		
                  count(CASE WHEN RIGHT(LEFT(ID_INDUK,8),3)=561  OR RIGHT(LEFT(ID_INDUK,8),3)=562 THEN RIGHT(LEFT(ID_INDUK,8),3)  END) AS RITTS, 	
                  isnull(SUM(CASE WHEN RIGHT(LEFT(ID_INDUK,8),3)=561  OR RIGHT(LEFT(ID_INDUK,8),3)=562 THEN KW_NETTO  END),0) AS BRTTS, 
                  isnull(SUM(CASE WHEN RIGHT(LEFT(ID_INDUK,8),3)=561  OR RIGHT(LEFT(ID_INDUK,8),3)=562 THEN HABLUR   END),0) AS HRTS, 
                  count(CASE WHEN RIGHT(LEFT(ID_INDUK,8),3)=541  OR RIGHT(LEFT(ID_INDUK,8),3)=542 THEN RIGHT(LEFT(ID_INDUK,8),3)  END) AS RITTRKA, 	
                  isnull(SUM(CASE WHEN RIGHT(LEFT(ID_INDUK,8),3)=541  OR RIGHT(LEFT(ID_INDUK,8),3)=542 THEN KW_NETTO   END),0) AS BRTTRKA, 
                  isnull(SUM(CASE WHEN RIGHT(LEFT(ID_INDUK,8),3)=541  OR RIGHT(LEFT(ID_INDUK,8),3)=542 THEN HABLUR    END),0) AS HRTRKA, 
                  count(CASE WHEN RIGHT(LEFT(ID_INDUK,8),3)=400 THEN RIGHT(LEFT(ID_INDUK,8),3)  END) AS RITKBD, 	
                  isnull(SUM(CASE WHEN RIGHT(LEFT(ID_INDUK,8),3)=400   THEN KW_NETTO END),0) AS BRTKBD, 
                  isnull(SUM(CASE WHEN RIGHT(LEFT(ID_INDUK,8),3)=400   THEN HABLUR   END),0) AS HRKBD, 
                  count(CASE WHEN RIGHT(LEFT(ID_INDUK,8),3)=566 THEN RIGHT(LEFT(ID_INDUK,8),3)  END) AS RITTRKB, 	
                  isnull(SUM(CASE WHEN RIGHT(LEFT(ID_INDUK,8),3)=566   THEN KW_NETTO  END),0) AS BRTTRKB, 	
                  isnull(SUM(CASE WHEN RIGHT(LEFT(ID_INDUK,8),3)=566   THEN HABLUR  END),0) AS HRTRKB, 
                  COUNT(HARI_GILING  ) AS RIT, 
                  SUM(KW_NETTO ) AS BRT, 
                  SUM(ISNULL(hablur,0) ) AS HR, 
                  (SUM(ISNULL(hablur,0) )/SUM(KW_NETTO ))*100 AS rend 
                FROM dbo.V_DATA_ANALISA_NPP_PER_SPA 
                WHERE HARI_GILING = ${hr} 
                GROUP BY HARI_GILING,URUT,JAM ORDER BY URUT`);

      return data.recordset;
    } catch (e) {
      throw Boom.internal(e);
    }
  }

  async getDigil(hr) {
    try {
      const data = await this._pool.request()
        .query(`SELECT KATEGORI, JML_RIT, JML_BERAT, HARI_GILING
      FROM   dbo.V_DATA_BERAT_DIGILING_PERKATEGORI_KODE_TOTAL
      WHERE  (HARI_GILING = ${hr})`);

      return data.recordset;
    } catch (e) {
      throw Boom.internal(e);
    }
  }

  async getDigilPerShift(hr) {
    try {
      const data = await this._pool.request()
        .query(`SELECT HARI_GILING , SUM(CASE SHIFT WHEN 1 THEN RIT ELSE 0 END) AS RITPAGI , 
                  SUM(CASE SHIFT WHEN 1 THEN BERAT ELSE 0 END) AS BRTPAGI , 
                  SUM(CASE SHIFT WHEN 2 THEN RIT ELSE 0 END) AS RITSIANG , 
                  SUM(CASE SHIFT WHEN 2 THEN BERAT ELSE 0 END) AS BRTSIANG , 
                  SUM(CASE SHIFT WHEN 3 THEN RIT ELSE 0 END) AS RITMALAM , 
                  SUM(CASE SHIFT WHEN 3 THEN BERAT ELSE 0 END) AS BRTMALAM , 
                  SUM(RIT) AS RITTOT, 
                  SUM(BERAT) AS BERATTOT 
                FROM dbo.V_TAB_DIGILING_PERSHIFT  
                GROUP BY HARI_GILING`);

      return data.recordset;
    } catch (e) {
      throw Boom.internal(e);
    }
  }

  async getDigilPerPos(hr) {
    try {
      const data = await this._pool.request()
        .query(`SELECT  dbo.TAB_KATAGORI.NO, dbo.TAB_KATAGORI.KDJML, dbo.TAB_KATAGORI.ID_KATEGORI, dbo.TAB_POS.NAMA AS nmpos, dbo.TAB_KATAGORI.NAMA AS nmktg, 
                        dbo.TAB_POS.KDJPOS, COUNT(CASE WHEN TAB_PEMASUKAN_TEBU.hari_giling = ${hr} THEN id_kategori END) AS jrit, 
                        ISNULL(SUM(CASE WHEN TAB_PEMASUKAN_TEBU.hari_giling = ${hr} THEN TAB_PEMASUKAN_TEBU.kw_netto END), 0) AS jberat, 
                        ISNULL(SUM(CASE WHEN TAB_PEMASUKAN_TEBU.hari_giling = ${hr} THEN V_DATA_ANALISA_NPP_PER_SPA.hablur END), 0) AS jhablur
                FROM         dbo.TAB_PEMASUKAN_TEBU INNER JOIN
                        dbo.TAB_KATAGORI ON dbo.TAB_KATAGORI.ID_KATEGORI = RIGHT(LEFT(dbo.TAB_PEMASUKAN_TEBU.ID_INDUK, 8), 3) LEFT OUTER JOIN
                        dbo.TAB_POS ON dbo.TAB_POS.ID_POS = LEFT(RIGHT(dbo.TAB_PEMASUKAN_TEBU.ID_INDUK, 10), 5) LEFT OUTER JOIN
                        dbo.V_DATA_ANALISA_NPP_PER_SPA ON dbo.V_DATA_ANALISA_NPP_PER_SPA.SPA = dbo.TAB_PEMASUKAN_TEBU.SPA
                GROUP BY dbo.TAB_KATAGORI.NO, dbo.TAB_KATAGORI.ID_KATEGORI, dbo.TAB_POS.NAMA, dbo.TAB_KATAGORI.KDJML, dbo.TAB_KATAGORI.NAMA, dbo.TAB_POS.KDJPOS
                ORDER BY dbo.TAB_KATAGORI.NO, dbo.TAB_POS.KDJPOS`);

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
      WHERE (NOT dbo.TAB_PEMASUKAN_TEBU.HARI_GILING IS NULL) AND not (dbo.TAB_PEMASUKAN_TEBU.NO_LORI IS NULL) and not  kw_netto IS NULL AND ditolak is null 
      ORDER BY dbo.TAB_PEMASUKAN_TEBU.TGL_MASUK`);

      return data.recordset;
    } catch (e) {
      throw Boom.internal(e);
    }
  }

  async getAntrianTrukSdhTimbang() {
    try {
      const data = await this._pool.request()
        .query(`SELECT dbo.TAB_PEMASUKAN_TEBU.SPA, dbo.TAB_PEMASUKAN_TEBU.NO_TRUK,
                  dbo.TAB_PEMASUKAN_TEBU.ID_INDUK, dbo.TAB_REGISTER.KELOMPOK,dbo.TAB_REGISTER.KEBUN, dbo.TAB_PEMASUKAN_TEBU.TGL_MASUK,
                  RIGHT(LEFT(dbo.TAB_PEMASUKAN_TEBU.ID_INDUK, 8), 3) AS ID_KTGR,datediff(hour,dbo.TAB_PEMASUKAN_TEBU.TGL_MASUK,getdate()-100) as lamajam
                FROM dbo.TAB_PEMASUKAN_TEBU INNER JOIN
                  dbo.TAB_REGISTER ON dbo.TAB_PEMASUKAN_TEBU.ID_INDUK = dbo.TAB_REGISTER.ID_INDUK INNER JOIN
                  dbo.TAB_MASTER_SPA ON RIGHT(dbo.TAB_PEMASUKAN_TEBU.SPA, 7) = dbo.TAB_MASTER_SPA.SPA
                WHERE (NOT dbo.TAB_PEMASUKAN_TEBU.HARI_GILING IS NULL) AND (dbo.TAB_PEMASUKAN_TEBU.NO_LORI IS NULL) and not gross is null and  kw_netto IS NULL AND ditolak is null
                ORDER BY dbo.TAB_PEMASUKAN_TEBU.TGL_MASUK`);

      return data.recordset;
    } catch (e) {
      throw Boom.internal(e);
    }
  }

  async getAntrianTrukBlmTimbang() {
    try {
      const data = await this._pool.request()
        .query(`SELECT  TOP (100) PERCENT dbo.TAB_PEMASUKAN_TEBU.SPA, dbo.TAB_PEMASUKAN_TEBU.NO_TRUK, dbo.TAB_PEMASUKAN_TEBU.ID_INDUK, dbo.TAB_REGISTER.KELOMPOK, 
                        dbo.TAB_REGISTER.KEBUN, dbo.TAB_PEMASUKAN_TEBU.TGL_MASUK, RIGHT(LEFT(dbo.TAB_PEMASUKAN_TEBU.ID_INDUK, 8), 3) AS ID_KTGR, DATEDIFF(hour, 
                        dbo.TAB_PEMASUKAN_TEBU.TGL_MASUK, GETDATE()) AS lamajam
                FROM    dbo.TAB_PEMASUKAN_TEBU INNER JOIN
                        dbo.TAB_REGISTER ON dbo.TAB_PEMASUKAN_TEBU.ID_INDUK = dbo.TAB_REGISTER.ID_INDUK INNER JOIN
                        dbo.TAB_MASTER_SPA ON RIGHT(dbo.TAB_PEMASUKAN_TEBU.SPA, 7) = dbo.TAB_MASTER_SPA.SPA
                WHERE   (dbo.TAB_PEMASUKAN_TEBU.HARI_GILING IS NULL) AND (dbo.TAB_PEMASUKAN_TEBU.NO_LORI IS NULL) AND (dbo.TAB_PEMASUKAN_TEBU.GROSS IS NULL) 
                        --AND (dbo.TAB_PEMASUKAN_TEBU.KW_NETTO IS NULL) AND (dbo.TAB_MASTER_SPA.DITOLAK IS NULL)
                ORDER BY dbo.TAB_PEMASUKAN_TEBU.TGL_MASUK`);

      return data.recordset;
    } catch (e) {
      throw Boom.internal(e);
    }
  }

  async getSpaDitolak() {
    try {
      const data = await this._pool.request()
        .query(`SELECT  dbo.TAB_PEMASUKAN_TEBU.SPA, dbo.TAB_PEMASUKAN_TEBU.NO_TRUK,
                        dbo.TAB_PEMASUKAN_TEBU.ID_INDUK, dbo.TAB_REGISTER.KELOMPOK, dbo.TAB_PEMASUKAN_TEBU.TGL_MASUK,
                        RIGHT(LEFT(dbo.TAB_PEMASUKAN_TEBU.ID_INDUK, 8), 3) AS ID_KTGR
                FROM    dbo.TAB_PEMASUKAN_TEBU INNER JOIN
                        dbo.TAB_REGISTER ON dbo.TAB_PEMASUKAN_TEBU.ID_INDUK = dbo.TAB_REGISTER.ID_INDUK INNER JOIN
                        dbo.TAB_MASTER_SPA ON RIGHT(dbo.TAB_PEMASUKAN_TEBU.SPA, 7) = dbo.TAB_MASTER_SPA.SPA
                        WHERE   (dbo.TAB_PEMASUKAN_TEBU.HARI_GILING IS NULL)  AND not ditolak is null
                ORDER BY dbo.TAB_PEMASUKAN_TEBU.TGL_MASUK`);

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

  async getLamaTinggalTruk() {
    try {
      const data = await this._pool.request()
        .query(`SELECT HARI_PEMASUKAN , COUNT(CASE WHEN SHIFT = 1 AND DATEDIFF(hour,tgl_masuk,tgl_keluar)<=2 THEN SHIFT END) AS PGRIT2, 
                  COUNT(CASE WHEN SHIFT = 1 AND (DATEDIFF(hour,tgl_masuk,tgl_keluar)>2 and DATEDIFF(hour,tgl_masuk,tgl_keluar)<=4)  THEN SHIFT END) AS PGRIT24, 
                  COUNT(CASE WHEN SHIFT = 1 AND (DATEDIFF(hour,tgl_masuk,tgl_keluar)>4 and DATEDIFF(hour,tgl_masuk,tgl_keluar)<=6)   THEN SHIFT END) AS PGRIT4, 
                  COUNT(CASE WHEN SHIFT = 1 AND DATEDIFF(hour,tgl_masuk,tgl_keluar)>6   THEN SHIFT END) AS PGRIT6, 
                  COUNT(CASE WHEN SHIFT = 2 AND DATEDIFF(hour,tgl_masuk,tgl_keluar)<=2 THEN SHIFT END) AS SGRIT2, 
                  COUNT(CASE WHEN SHIFT = 2 AND (DATEDIFF(hour,tgl_masuk,tgl_keluar)>2 and DATEDIFF(hour,tgl_masuk,tgl_keluar)<=4)  THEN SHIFT END) AS SGRIT24, 
                  COUNT(CASE WHEN SHIFT = 2 AND (DATEDIFF(hour,tgl_masuk,tgl_keluar)>4 and DATEDIFF(hour,tgl_masuk,tgl_keluar)<=6)   THEN SHIFT END) AS SGRIT4, 
                  COUNT(CASE WHEN SHIFT = 2 AND DATEDIFF(hour,tgl_masuk,tgl_keluar)>6   THEN SHIFT END) AS SGRIT6, 
                  COUNT(CASE WHEN SHIFT = 3 AND DATEDIFF(hour,tgl_masuk,tgl_keluar)<=2 THEN SHIFT END) AS MNRIT2, 
                  COUNT(CASE WHEN SHIFT = 3 AND (DATEDIFF(hour,tgl_masuk,tgl_keluar)>2 and DATEDIFF(hour,tgl_masuk,tgl_keluar)<=4)  THEN SHIFT END) AS MNRIT24, 
                  COUNT(CASE WHEN SHIFT = 3 AND (DATEDIFF(hour,tgl_masuk,tgl_keluar)>4 and DATEDIFF(hour,tgl_masuk,tgl_keluar)<=6)   THEN SHIFT END) AS MNRIT4, 
                  COUNT(CASE WHEN SHIFT = 3 AND DATEDIFF(hour,tgl_masuk,tgl_keluar)>6   THEN SHIFT END) AS MNRIT6, 
                  COUNT(CASE WHEN DATEDIFF(hour,tgl_masuk,tgl_keluar)<=2 THEN SHIFT END) AS TTRIT2, 
                  COUNT(CASE WHEN DATEDIFF(hour,tgl_masuk,tgl_keluar)>2 and DATEDIFF(hour,tgl_masuk,tgl_keluar)<=4  THEN SHIFT END) AS TTRIT24, 
                  COUNT(CASE WHEN DATEDIFF(hour,tgl_masuk,tgl_keluar)>4 and DATEDIFF(hour,tgl_masuk,tgl_keluar)<=6 THEN SHIFT END) AS TTRIT4, 
                    COUNT(CASE WHEN DATEDIFF(hour,tgl_masuk,tgl_keluar)>6 THEN SHIFT END) AS TTRIT6, 
                  COUNT(hari_pemasukan) AS TTRIT 
                FROM TAB_PEMASUKAN_TEBU INNER JOIN TAB_JAM ON JAM=DATEPART(HOUR,TGL_KELUAR) 
                WHERE NOT KW_NETTO IS NULL  
                GROUP BY HARI_PEMASUKAN 
                ORDER BY HARI_PEMASUKAN`);

      return data.recordset;
    } catch (e) {
      throw Boom.internal(e);
    }
  }
}

module.exports = TimbanganService;

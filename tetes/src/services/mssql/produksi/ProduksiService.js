const config = require("../dbconfig");
const mssql = require("mssql");

class ProduksiService {
    async getProduksiHarian(mg) {
        try {
            const pool = await mssql.connect(config);
            const data = await pool.request().query(`SELECT TGL,JML,TAKSASI FROM TblProduksiTetes WHERE MASA_GILING=${mg}`);

            return data.recordset;
        } catch (error) {
            console.log(error);
        }
    }
}

export default ProduksiService;
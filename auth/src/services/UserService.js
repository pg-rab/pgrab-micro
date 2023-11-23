const Boom = require('@hapi/boom');
const { connect } = require('mssql');
const config = require('./dbconfig')

class UsersService {
    constructor() {
        this._pool;
        this.poolConnect();
    }

    async poolConnect() {
        this._pool = await connect(config);
    }

    async verifyNewUsername() {
        try {
            const result = await this._pool
                .request()
                .query(`SELECT uname FROM [USERS].[dbo].[Tbl_User] WHERE uname='afdi'`);
            // console.log(result);
            return result.recordset;
            // if (result.rowAffected > 0) {
            //     throw Boom.badRequest('Gagal tambah user baru. Username sudah digunakan')
            // }
        } catch (error) {
            console.log(error);
        }

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
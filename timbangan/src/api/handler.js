// const ClientError = require("../../exceptions/ClientError");
const Boom = require('@hapi/boom')

class TimbanganHandler {
    constructor(service) {
        this._service = service;

        this.getPosHandler = this.getPosHandler.bind(this);
        this.getHariPemasukanHandler = this.getHariPemasukanHandler.bind(this);
        this.getKategoriHandler = this.getKategoriHandler.bind(this);
        this.getPemasukanTebuHandler = this.getPemasukanTebuHandler.bind(this);
        this.getPemasukanKebunHandler = this.getPemasukanKebunHandler.bind(this);
        this.getDigilPerjamSpaLolosHandler = this.getDigilPerjamSpaLolosHandler.bind(this);

    }

    async getPosHandler(request, h) {
        const data = await this._service.getPos();
        return {
            status: "success",
            data: data,
        };
    }

    async getHariPemasukanHandler(request, h) {
        const hariMasuk = await this._service.getHariPemasukan();
        return {
            status: "success",
            data: hariMasuk,
        };
    }

    async getKategoriHandler(request, h) {
        const data = await this._service.getKategori();
        return h.response(data)
    }

    async getPemasukanTebuHandler(request, h) {
        // try {
        const tgl = request.query.tgl ? `WHERE CONVERT(VARCHAR,TGL_MASUK,112)='${request.query.tgl}'` : '';
        const limit = request.query.limit ? `TOP ` + request.query.limit : 'TOP 100';
        // console.log(limit)
        const pemasukan = await this._service.getPemasukan(tgl, limit);
        // console.log(bagian);
        return h.response(pemasukan)

        // } catch (error) {
        //     return Boom.internal(error)
        // }
    }

    async getPemasukanKebunHandler(request, h) {
        const hr = request.query.harike ? `'${request.query.harike}'` : '';
        const ktg = request.query.kategori ? `'${request.query.kategori}'` : '';
        // console.log(limit)
        const pemasukan = await this._service.getPemasukanPerKebun(hr, ktg);
        // console.log(bagian);
        return {
            status: "success",
            data: pemasukan,

        };
    }

    async getDigilPerjamSpaLolosHandler(request, h) {
        const data = await this._service.getDigilPerjamSpaLolos();
        return {
            status: "success",
            data: data,

        };
    }

}

module.exports = TimbanganHandler;
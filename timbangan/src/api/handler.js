// const ClientError = require("../../exceptions/ClientError");
const Boom = require("@hapi/boom");
const autoBind = require('auto-bind');

class TimbanganHandler {
  constructor(service) {
    this._service = service;

    // this.getPosHandler = this.getPosHandler.bind(this);
    // this.getHariPemasukanHandler = this.getHariPemasukanHandler.bind(this);
    // this.getKategoriHandler = this.getKategoriHandler.bind(this);
    // this.getPemasukanTebuHandler = this.getPemasukanTebuHandler.bind(this);
    // this.getPemasukanKebunHandler = this.getPemasukanKebunHandler.bind(this);
    // this.getPemasukanJamHandler = this.getPemasukanJamHandler.bind(this);
    // this.getPemasukanPerShiftHandler = this.getPemasukanPerShiftHandler.bind(this);
    // this.getDigilPerjamSpaLolosHandler =
    //   this.getDigilPerjamSpaLolosHandler.bind(this);
    // this.getAntrianLoriHandler = this.getAntrianLoriHandler.bind(this);
    // this.getAntrianTrukHandler = this.getAntrianTrukHandler.bind(this);

    autoBind(this);
  }

  async getPosHandler(request, h) {
    const data = await this._service.getPos();
    return h.response(data);
  }

  async getHariPemasukanHandler(request, h) {
    const data = await this._service.getHariPemasukan();
    return h.response(data);
  }

  async getKategoriHandler(request, h) {
    const data = await this._service.getKategori();
    return h.response(data);
  }

  async getPemasukanTebuHandler(request, h) {
    const tgl = request.query.tgl
      ? `WHERE CONVERT(VARCHAR,TGL_MASUK,112)='${request.query.tgl}'`
      : "";
    const limit = request.query.limit
      ? `TOP ${request.query.limit}`
      : "TOP 100";
    const pemasukan = await this._service.getPemasukan(tgl, limit);
    return h.response(pemasukan);
  }

  async getPemasukanKebunHandler(request, h) {
    const hr = request.query.harike ? `'${request.query.harike}'` : "";
    const ktg = request.query.kategori ? `'${request.query.kategori}'` : "";
    const pemasukan = await this._service.getPemasukanPerKebun(hr, ktg);
    return h.response(pemasukan);
  }

  async getPemasukanKategoriHandler(request, h) {
    const hr = request.query.harike ? `'${request.query.harike}'` : "";
    const pemasukan = await this._service.getPemasukanPerKategori(hr);
    return h.response(pemasukan);
  }

  async getPemasukanJamHandler(request, h) {
    const hr = request.query.harike ? request.query.harike : "";
    const pemasukan = await this._service.getPemasukanPerJam(hr);
    return h.response(pemasukan);
  }

  async getPemasukanPosJamHandler(request, h) {
    const hr = request.query.harike ? request.query.harike : null;
    const ktg = request.query.kategori ? request.query.kategori : null;
    const jm = request.query.jam ? request.query.jam : null;
    const pemasukan = await this._service.getPemasukanPosPerJam(hr, ktg, jm);
    return h.response(pemasukan);
  }

  async getPemasukanPerShiftHandler(request, h) {
    const pemasukan = await this._service.getPemasukanPerShift();
    return h.response(pemasukan);
  }

  async getDigilPerjamSpaLolosHandler(request, h) {
    const data = await this._service.getDigilPerjamSpaLolos();
    return h.response(data);
  }

  async getAntrianLoriHandler(request, h) {
    const data = await this._service.getAntrianLori();
    return h.response(data);
  }

  async getAntrianTrukHandler(request, h) {
    const data = await this._service.getAntrianTruk();
    return h.response(data);
  }
}

module.exports = TimbanganHandler;

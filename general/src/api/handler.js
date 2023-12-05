// const ClientError = require("../../exceptions/ClientError");
const Boom = require("@hapi/boom");
const autoBind = require("auto-bind");

class TimbanganHandler {
  constructor(service) {
    this._service = service;

    autoBind(this);
  }

  // Handler data Umum

  async getDefaultSetHandler(request, h) {
    const data = await this._service.getDefaultSet();
    return h.response(data);
  }

  async getKategoriHandler(request, h) {
    const data = await this._service.getKategori();
    return h.response(data);
  }

  async getPosHandler(request, h) {
    const data = await this._service.getPos();
    return h.response(data);
  }

  async getHariPemasukanHandler(request, h) {
    const data = await this._service.getHariPemasukan();
    return h.response(data);
  }

  async getHariGilingHandler(request, h) {
    const data = await this._service.getHariGiling();
    return h.response(data);
  }

  // End Of Handler data Umum

  // Handler data Tanaman

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
    const hr = request.query.harike ? `'${request.query.harike}'` : null;
    const ktg = request.query.kategori ? `'${request.query.kategori}'` : null;
    const pemasukan = await this._service.getPemasukanPerKebun(hr, ktg);
    return h.response(pemasukan);
  }

  async getPemasukanKategoriHandler(request, h) {
    const hr = request.query.harike ? `'${request.query.harike}'` : null;
    const pemasukan = await this._service.getPemasukanPerKategori(hr);
    return h.response(pemasukan);
  }

  async getPemasukanJamHandler(request, h) {
    const hr = request.query.harike ? request.query.harike : null;
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

  async getPemasukanPerSkwHandler(request, h) {
    const hr = request.query.harike ? `'${request.query.harike}'` : null;
    const ktg = request.query.kategori ? `'${request.query.kategori}'` : null;
    const pemasukan = await this._service.getPemasukanPerSkw(hr, ktg);
    return h.response(pemasukan);
  }

  // End Of Handler data Tanaman

  // Handler data Pabrik

  async getDigilPerJamHandler(request, h) {
    const hr = request.query.harike ? `'${request.query.harike}'` : null;
    const data = await this._service.getDigilPerJam(hr);
    return h.response(data);
  }

  async getDigilPerShiftHandler(request, h) {
    const hr = request.query.harike ? `'${request.query.harike}'` : null;
    const data = await this._service.getDigilPerShift(hr);
    return h.response(data);
  }

  async getDigilPerPosHandler(request, h) {
    const hr = request.query.harike ? `'${request.query.harike}'` : null;
    const data = await this._service.getDigilPerPos(hr);
    return h.response(data);
  }

  async getDigilHandler(request, h) {
    const hr = request.query.harike ? `'${request.query.harike}'` : null;
    const data = await this._service.getDigil(hr);
    return h.response(data);
  }

  async getDigilPerjamSpaLolosHandler(request, h) {
    const data = await this._service.getDigilPerjamSpaLolos();
    return h.response(data);
  }

  // End Of Handler data Pabrik

  // Handler data ARI

  async getAntrianLoriHandler(request, h) {
    const data = await this._service.getAntrianLori();
    return h.response(data);
  }

  async getAntrianTrukSdhTimbangHandler(request, h) {
    const data = await this._service.getAntrianTrukSdhTimbang();
    return h.response(data);
  }

  async getAntrianTrukBlmTimbangHandler(request, h) {
    const data = await this._service.getAntrianTrukBlmTimbang();
    return h.response(data);
  }

  async getSpaBatalHandler(request, h) {
    const data = await this._service.getSpaDitolak();
    return h.response(data);
  }

  async getLamaTinggalTrukHandler(request, h) {
    const data = await this._service.getLamaTinggalTruk();
    return h.response(data);
  }

  // End Of Handler data ARI
}

module.exports = TimbanganHandler;

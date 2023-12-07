// const ClientError = require("../../exceptions/ClientError");
// const Boom = require("@hapi/boom");
const autoBind = require("auto-bind");

class PengajuanLahanHandler {
  constructor(service) {
    this._service = service;

    autoBind(this);
  }

  // Handler data Umum

  async getRayonHandler(request, h) {
    const data = await this._service.getRayon();
    return h.response(data);
  }

  async getAfdelingHandler(request, h) {
    const data = await this._service.getAfdeling();
    return h.response(data);
  }

  async getKebunHandler(request, h) {
    const data = await this._service.getKebun();
    return h.response(data);
  }

  async getKategoriHandler(request, h) {
    const data = await this._service.getKategori();
    return h.response(data);
  }

  async getPetaniHandler(request, h) {
    const data = await this._service.getPetani();
    return h.response(data);
  }

  async getUrutHandler(request, h) {
    const mt = request.params.mt;
    const id = request.params.id;
    const data = await this._service.getUrut(mt, id);
    return h.response(data);
  }
}

module.exports = PengajuanLahanHandler;

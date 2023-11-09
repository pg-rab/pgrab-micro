const routes = (handler) => [
  {
    method: "GET",
    path: "/timbangan/pemasukan-tebu",
    handler: handler.getPemasukanTebuHandler,
    // options: {
    //   cors: {
    //     origin: ["http://localhost:8000"],
    //   },
    // },
    options: {
      cache: {
        expiresIn: 30 * 1000,
        privacy: "private",
      },
    },
  },
  {
    method: "GET",
    path: "/timbangan/pemasukan-per-kebun",
    handler: handler.getPemasukanKebunHandler,
  },
  {
    method: "GET",
    path: "/timbangan/spa-lolos",
    handler: handler.getDigilPerjamSpaLolosHandler,
  },
  {
    method: "GET",
    path: "/timbangan/antrian-lori",
    handler: handler.getDigilPerjamSpaLolosHandler,
  },
  {
    method: "GET",
    path: "/timbangan/antrian-truk-tebu",
    handler: handler.getDigilPerjamSpaLolosHandler,
  },
  {
    method: "GET",
    path: "/timbangan/hari-pemasukan",
    handler: handler.getHariPemasukanHandler,
  },
  {
    method: "GET",
    path: "/timbangan/kategori",
    handler: handler.getKategoriHandler,
  },
  {
    method: "GET",
    path: "/timbangan/pos",
    handler: handler.getPosHandler,
  },
];

module.exports = routes;

const routes = (handler) => [
  {
    method: "GET",
    path: "/timbangan/pemasukan-tebu",
    handler: handler.getPemasukanTebuHandler,
    /* 
    options: {
      cache: {
        expiresIn: 30 * 1000,
        privacy: "private",
      },
    },
    */
  },
  {
    method: "GET",
    path: "/timbangan/tebu-digiling",
    handler: (request, h) => handler.getDigilHandler(request, h),
  },
  {
    method: "GET",
    path: "/timbangan/tebu-digiling-per-jam",
    handler: (request, h) => handler.getDigilPerJamHandler(request, h),
  },
  {
    method: "GET",
    path: "/timbangan/tebu-digiling-per-shift",
    handler: (request, h) => handler.getDigilPerShiftHandler(request, h),
  },
  {
    method: "GET",
    path: "/timbangan/pemasukan-per-kebun",
    handler: (request, h) => handler.getPemasukanKebunHandler(request, h),
  },
  {
    method: "GET",
    path: "/timbangan/pemasukan-per-kategori",
    handler: (request, h) => handler.getPemasukanKategoriHandler(request, h),
  },
  {
    method: "GET",
    path: "/timbangan/pemasukan-per-jam",
    handler: (request, h) => handler.getPemasukanJamHandler(request, h),
  },
  {
    method: "GET",
    path: "/timbangan/pemasukan-pos-per-jam",
    handler: (request, h) => handler.getPemasukanPosJamHandler(request, h),
  },
  {
    method: "GET",
    path: "/timbangan/pemasukan-per-shift",
    handler: (request, h) => handler.getPemasukanPerShiftHandler(request, h),
  },
  {
    method: "GET",
    path: "/timbangan/pemasukan-per-skw",
    handler: (request, h) => handler.getPemasukanPerSkwHandler(request, h),
  },
  {
    method: "GET",
    path: "/timbangan/spa-lolos",
    handler: (request, h) => handler.getDigilPerjamSpaLolosHandler(request, h),
  },
  {
    method: "GET",
    path: "/timbangan/antrian-lori",
    handler: (request, h) => handler.getAntrianLoriHandler(request, h),
  },
  {
    method: "GET",
    path: "/timbangan/antrian-truk-tebu",
    handler: (request, h) => handler.getAntrianTrukHandler(request, h),
  },
  {
    method: "GET",
    path: "/timbangan/hari-pemasukan",
    handler: (request, h) => handler.getHariPemasukanHandler(request, h),
  },
  {
    method: "GET",
    path: "/timbangan/kategori",
    handler: (request, h) => handler.getKategoriHandler(request, h),
  },
  {
    method: "GET",
    path: "/timbangan/pos",
    handler: (request, h) => handler.getPosHandler(request, h),
  },
  {
    method: "GET",
    path: "/timbangan/default-setting",
    handler: (request, h) => handler.getDefaultSetHandler(request, h),
  },
];

module.exports = routes;

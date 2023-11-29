const routes = (handler) => [
  {
    method: "GET",
    path: "/timbangan/pemasukan-tebu",
    handler: handler.getPemasukanTebuHandler,
    options: {
      auth: "timbangan_jwt",
    },
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
    path: "/timbangan/lama-tinggal-truk",
    handler: (request, h) => handler.getLamaTinggalTrukHandler(request, h),
    options: {
      auth: "timbangan_jwt",
    },
  },
  {
    method: "GET",
    path: "/timbangan/spa-batal",
    handler: (request, h) => handler.getSpaBatalHandler(request, h),
    options: {
      auth: "timbangan_jwt",
    },
  },
  {
    method: "GET",
    path: "/timbangan/antrian-lori",
    handler: (request, h) => handler.getAntrianLoriHandler(request, h),
    options: {
      auth: "timbangan_jwt",
    },
  },
  {
    method: "GET",
    path: "/timbangan/antrian-truk-sudah-timbang",
    handler: (request, h) => handler.getAntrianTrukSdhTimbangHandler(request, h),
    options: {
      auth: "timbangan_jwt",
    },
  },
  {
    method: "GET",
    path: "/timbangan/antrian-truk-belum-timbang",
    handler: (request, h) => handler.getAntrianTrukBlmTimbangHandler(request, h),
    options: {
      auth: "timbangan_jwt",
    },
  },
  {
    method: "GET",
    path: "/timbangan/tebu-digiling",
    handler: (request, h) => handler.getDigilHandler(request, h),
    options: {
      auth: "timbangan_jwt",
    },
  },
  {
    method: "GET",
    path: "/timbangan/tebu-digiling-per-jam",
    handler: (request, h) => handler.getDigilPerJamHandler(request, h),
    options: {
      auth: "timbangan_jwt",
    },
  },
  {
    method: "GET",
    path: "/timbangan/tebu-digiling-per-shift",
    handler: (request, h) => handler.getDigilPerShiftHandler(request, h),
    options: {
      auth: "timbangan_jwt",
    },
  },
  {
    method: "GET",
    path: "/timbangan/tebu-digiling-per-pos",
    handler: (request, h) => handler.getDigilPerPosHandler(request, h),
    options: {
      auth: "timbangan_jwt",
    },
  },
  {
    method: "GET",
    path: "/timbangan/pemasukan-per-kebun",
    handler: (request, h) => handler.getPemasukanKebunHandler(request, h),
    options: {
      auth: "timbangan_jwt",
    },
  },
  {
    method: "GET",
    path: "/timbangan/pemasukan-per-kategori",
    handler: (request, h) => handler.getPemasukanKategoriHandler(request, h),
    options: {
      auth: "timbangan_jwt",
    },
  },
  {
    method: "GET",
    path: "/timbangan/pemasukan-per-jam",
    handler: (request, h) => handler.getPemasukanJamHandler(request, h),
    options: {
      auth: "timbangan_jwt",
    },
  },
  {
    method: "GET",
    path: "/timbangan/pemasukan-pos-per-jam",
    handler: (request, h) => handler.getPemasukanPosJamHandler(request, h),
    options: {
      auth: "timbangan_jwt",
    },
  },
  {
    method: "GET",
    path: "/timbangan/pemasukan-per-shift",
    handler: (request, h) => handler.getPemasukanPerShiftHandler(request, h),
    options: {
      auth: "timbangan_jwt",
    },
  },
  {
    method: "GET",
    path: "/timbangan/pemasukan-per-skw",
    handler: (request, h) => handler.getPemasukanPerSkwHandler(request, h),
    options: {
      auth: "timbangan_jwt",
    },
  },
  {
    method: "GET",
    path: "/timbangan/spa-lolos",
    handler: (request, h) => handler.getDigilPerjamSpaLolosHandler(request, h),
    options: {
      auth: "timbangan_jwt",
    },
  },
  {
    method: "GET",
    path: "/timbangan/hari-giling",
    handler: (request, h) => handler.getHariGilingHandler(request, h),
    options: {
      auth: "timbangan_jwt",
    },
  },
  {
    method: "GET",
    path: "/timbangan/hari-pemasukan",
    handler: (request, h) => handler.getHariPemasukanHandler(request, h),
    options: {
      auth: "timbangan_jwt",
    },
  },
  {
    method: "GET",
    path: "/timbangan/kategori",
    handler: (request, h) => handler.getKategoriHandler(request, h),
    options: {
      auth: "timbangan_jwt",
    },
  },
  {
    method: "GET",
    path: "/timbangan/pos",
    handler: (request, h) => handler.getPosHandler(request, h),
    options: {
      auth: "timbangan_jwt",
    },
  },
  {
    method: "GET",
    path: "/timbangan/default-setting",
    handler: (request, h) => handler.getDefaultSetHandler(request, h),
    options: {
      auth: "timbangan_jwt",
    },
  },
];

module.exports = routes;

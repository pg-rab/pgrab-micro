const routes = (handler) => [
  {
    method: "GET",
    path: "/pengajuan-lahan/rayon-all",
    handler: (request, h) => handler.getRayonHandler(request, h),
    // options: {
    //   auth: "timbangan_jwt",
    // },
  },
  {
    method: "GET",
    path: "/pengajuan-lahan/afdeling-all",
    handler: (request, h) => handler.getAfdelingHandler(request, h),
    // options: {
    //   auth: "timbangan_jwt",
    // },
  },
  {
    method: "GET",
    path: "/pengajuan-lahan/desa-all",
    handler: (request, h) => handler.getKebunHandler(request, h),
    // options: {
    //   auth: "timbangan_jwt",
    // },
  },
  {
    method: "GET",
    path: "/pengajuan-lahan/kategori-all",
    handler: (request, h) => handler.getKategoriHandler(request, h),
    // options: {
    //   auth: "timbangan_jwt",
    // },
  },
  {
    method: "GET",
    path: "/pengajuan-lahan/petani-all",
    handler: (request, h) => handler.getPetaniHandler(request, h),
    // options: {
    //   auth: "timbangan_jwt",
    // },
  },
  {
    method: "GET",
    path: "/pengajuan-lahan/generate-urut/{mt}/{id}",
    handler: (request, h) => handler.getUrutHandler(request, h),
    // options: {
    //   auth: "timbangan_jwt",
    // },
  },
];

module.exports = routes;

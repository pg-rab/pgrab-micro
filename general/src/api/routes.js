const routes = (handler) => [
  {
    method: "GET",
    path: "/pengajuan-lahan/petani-all",
    handler: (request, h) => handler.getPemasukanTebuHandler(request, h),
    // options: {
    //   auth: "timbangan_jwt",
    // },
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
    path: "/pengajuan-lahan/petani-all",
    handler: (request, h) => handler.getLamaTinggalTrukHandler(request, h),
    // options: {
    //   auth: "timbangan_jwt",
    // },
  },
];

module.exports = routes;

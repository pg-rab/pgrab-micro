"use strict";

require("dotenv").config();
const Hapi = require("@hapi/hapi");
// const Jwt = require("@hapi/jwt");
const pengajuanLahan = require("./api");
const PengajuanLahanService = require("./services/PengajuanLahanService");

const init = async () => {
  const pengajuanLahanService = new PengajuanLahanService();

  const server = Hapi.server({
    port: process.env.PORT || 7006,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  // await server.register([
  //   {
  //     plugin: Jwt,
  //   },
  // ]);

  // server.auth.strategy("timbangan_jwt", "jwt", {
  //   keys: process.env.ACCESS_TOKEN_KEY,
  //   verify: {
  //     aud: false,
  //     iss: "RAB_API",
  //     sub: false,
  //     exp: true,
  //   },
  //   validate: (artifacts) => ({
  //     isValid: true,
  //     credentials: {
  //       id: artifacts.decoded.payload.user_id,
  //     },
  //   }),
  // });

  await server.register({
    plugin: pengajuanLahan,
    options: { service: pengajuanLahanService },
  });

  await server.start();
  console.log(`Pengajuan Lahan Service berjalan pada ${server.info.uri}`);
};

init();

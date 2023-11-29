"use strict";

require("dotenv").config();
const Hapi = require("@hapi/hapi");
const Jwt = require("@hapi/jwt");
const timbangan = require("./api");
const TimbanganService = require("./services/TimbanganService");

const init = async () => {
  const timbanganService = new TimbanganService();

  const server = Hapi.server({
    port: process.env.PORT || 7001,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ["http://localhost:8080"],
      },
    },
  });

  await server.register([
    {
      plugin: Jwt,
    },
  ]);

  server.auth.strategy("timbangan_jwt", "jwt", {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: "RAB_API",
      sub: false,
      exp: true,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.user_id,
      },
    }),
  });

  await server.register({
    plugin: timbangan,
    options: { service: timbanganService },
  });

  await server.start();
  console.log(`Timbangan Service berjalan pada ${server.info.uri}`);
};

init();

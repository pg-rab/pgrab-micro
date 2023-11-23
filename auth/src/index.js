'use strict'

require('dotenv').config();
const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const Boom = require('@hapi/boom');
const Bcrypt = require('bcryptjs');
const users = require('./api');
const UsersService = require('./services/UserService');

const init = async () => {
    const usersService = new UsersService();

    const server = Hapi.server({
        port: process.env.PORT || 7010,
        host: process.env.HOST
    });

    // Bcrypt
    //     .hash('123456', 10)
    //     .then(hash => {
    //         console.log('Hash ', hash)
    //     })
    //     .catch(err => console.error(err.message))

    // server.route({
    //     method: 'GET',
    //     path: '/{any*}',
    //     handler: function (request, h) {
    //         // try {

    //         // } catch (error) {
    //         //     return
    //         // }
    //         let hash = "$2y$10$EwP8suTCiUMEN/UDQp6J7epEp01Ji945GwTNIQkyLSpS.FeaWZXGm";

    //         // return h.response({ 'msg': hash }).code(200);
    //         return Boom.methodNotAllowed('Not Allowed');

    //     },

    // });

    await server.register([
        {
            plugin: users,
            options: { usersService }
        }
    ])

    await server.start();
    console.log(`Auth Service berjalan pada ${server.info.uri}`);

};

// const token = Jwt.token.generate(
//     {
//         aud: 'urn:audience:test',
//         iss: 'urn:issuer:test',
//         user: 'some_user_name',
//         group: 'hapi_community'
//     },
//     {
//         key: 'some_shared_secret',
//         algorithm: 'HS512'
//     },
//     {
//         ttlSec: 14400 // 4 hours
//     }
// );

init();


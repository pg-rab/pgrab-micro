require('dotenv').config();
const Hapi = require('@hapi/hapi');

const petaks = require('./api');
const PetakService = require('./services/PetakService');

const init = async () => {
    const petakService = new PetakService();
    const server = Hapi.server({
        host: process.env.HOST,
        port: process.env.PORT,
        routes: {
            cors: {
                origin: ['*'],
            },
        },
    });

    await server.register([
        {
            plugin: petaks,
            options: { petakService },
        },
    ])

    await server.start();
    console.log(`Petakebun Service berjalan pada ${server.info.uri}`);
};

init();
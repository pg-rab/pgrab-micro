const TimbanganHandler = require('./handler');
const routes = require('./routes');

module.exports = {
    name: 'timbangan',
    version: '1.0.0',
    register: async (server, { service }) => {
        const timbanganHandler = new TimbanganHandler(service);
        server.route(routes(timbanganHandler));
    },
};
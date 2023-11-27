const PetakHandler = require('./handler');
const routes = require('./routes');

module.exports = {
    name: 'petaks',
    verion: '1.0.0',
    register: async (server, { petakService }) => {
        const petakHandler = new PetakHandler(petakService);
        server.route(routes(petakHandler));
    },
};

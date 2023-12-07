const PengajuanLahanHandler = require('./handler');
const routes = require('./routes');

module.exports = {
    name: 'pengajuan-lahan',
    version: '1.0.0',
    register: async (server, { service }) => {
        const pengajuanLahanHandler = new PengajuanLahanHandler(service);
        server.route(routes(pengajuanLahanHandler));
    },
};
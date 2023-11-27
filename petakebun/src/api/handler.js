const autoBind = require('auto-bind');
const Boom = require('@hapi/boom');

class PetakHandler {
    constructor(petakService) {
        this._petakService = petakService;
        autoBind(this);
    }

    async getPetaksHandler() {
        const petaks = await this._petakService.getPetaks();
        return {
            status: "success",
            data: { petaks },
        };
    }

    async getPetakByIdHandler(request, h) {
        try {
            const { id } = request.params;

            const petak = await this._petakService.getPetakById(id);

            return {
                status: "success",
                data: {
                    petak,
                },
            };
        } catch (error) {
            if (error.output.statusCode == 404) {
                return error;
            } else if (error.statusCode == 400) {
                return Boom.badRequest();
            }

            // Server ERROR!
            return Boom.internal('Maaf, terjadi kegagalan pada server kami.')
        }
    }

    async putPetakByIdHandler(request, h) {
        try {
            const { id } = request.params;
            await this._petakService.editPetakById(id, request.payload);

            return {
                status: "success",
                message: "Petak berhasil diperbarui",
            };
        } catch (error) {
            if (error.output.statusCode == 404) {
                return error;
            } else if (error.statusCode == 400) {
                return Boom.badRequest();
            }

            // Server ERROR!
            return Boom.internal('Maaf, terjadi kegagalan pada server kami.')
        }
    }

}

module.exports = PetakHandler
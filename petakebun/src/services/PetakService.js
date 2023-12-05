const { Pool } = require("pg");
const Boom = require('@hapi/boom');


class PetakService {
    constructor() {
        this._pool = new Pool();
    }

    async getPetaks() {
        const result = await this._pool.query("SELECT id, geom, no_ptk, rayon, afd, kebun, kelompok, petani, kategori, area, id_kebun, desa FROM public.ptkdigital1");
        return result.rows;
    }

    async getPetakById(id) {
        // console.log(id);
        const query = {
            text: "SELECT id, geom, no_ptk, rayon, afd, kebun, kelompok, petani, kategori, area, id_kebun, desa FROM public.ptkdigital1 WHERE id = $1",
            values: [id],
        };
        const result = await this._pool.query(query);
        if (!result.rows.length) {
            throw new Boom.notFound('Id Petak tidak ditemukan');
        }
        return result.rows[0];
    }

    async editPetakById(id, { rayon, afd, kebun, kelompok, petani, kategori, area, id_kebun, desa }) {
        const query = {
            text: "UPDATE public.ptkdigital3 SET rayon=$2, afd=$3, kebun=$4, kelompok=$5, petani=$6, kategori=$7, area=$8, id_kebun=$9, desa=$10 WHERE id=$1 RETURNING id",
            values: [id, rayon, afd, kebun, kelompok, petani, kategori, area, id_kebun, desa],
        };

        const result = await this._pool.query(query);
        if (!result.rows.length) {
            throw new Boom.notFound("Gagal memperbarui petak, Id tidak ditemukan");
        }
    }
}

module.exports = PetakService;
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
            text: "UPDATE albums SET name=$1, year=$2 WHEre id=$3 RETURNING id",
            values: [name, year, id],
        };

        const result = await this._pool.query(query);
        if (!result.rows.length) {
            throw new Boom.notFound("Gagal memperbarui petak, Id tidak ditemukan");
        }
    }
}

module.exports = PetakService;
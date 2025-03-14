import db from "./src/config/dp_pg.js";

export function getPokemonById(id, callback) {
    db.query("SELECT * FROM pokemon WHERE id = $1", [id], (err, results) => {
        callback(err, results.rows);
    });
}

export function getAllPokemons(callback) {
    db.query("SELECT * FROM pokemon", [], (err, results) => {
        callback(err, results);
    });
}

export function createPokemon(data, callback) {
    db.query("INSERT INTO pokemon SET $1", data, (err, result) => {
        callback(err, result ? result.insertId : null);
    });
}

export function deletePokemon(id, callback) {
    db.query("DELETE FROM pokemon WHERE id = $1", [id], (err, result) => {
        callback(err, result.affectedRows);
    });
}

export function getPokemonsByType(type, limit, offset, callback) {
    let query = "SELECT * FROM pokemon";
    let countQuery = "SELECT COUNT(*) as total FROM pokemon";
    let params = [];

    if (type) {
        query += " WHERE type_primaire = $1";
        countQuery += " WHERE type_primaire = $1";
        params.push(type);
    }

    query += " LIMIT $1 OFFSET $1";
    params.push(limit, offset);

    db.query(countQuery, params.slice(0, 1), (err, countResult) => {
        if (err) return callback(err, null, 0);
        const total = countResult[0].total;

        db.query(query, params, (err, results) => {
            callback(err, results, total);
        });
    });
}

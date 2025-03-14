import db from "./src/config/dp_pg.js";
import bcrypt from "bcrypt";
import crypto from "crypto";

export function createUser(nom, courriel, mot_de_passe, callback) {
    // Vérifier si l'email existe déjà
    db.query("SELECT id FROM utilisateurs WHERE courriel = $1", [courriel], (err, results) => {
        if (err) return callback(err);

        if (results.length > 0) return callback(null, null, "Ce courriel est déjà utilisé");

        // Hasher le mot de passe
        const hash = bcrypt.hashSync(mot_de_passe, 10);
        const cle_api = crypto.randomBytes(16).toString("hex");

        db.query(
            "INSERT INTO utilisateurs (nom, courriel, mot_de_passe, cle_api) VALUES ($1, $2, $3, $4)",
            [nom, courriel, hash, cle_api],
            (err, result) => {
                callback(err, result ? cle_api : null);
            }
        );
    });
}

export function getUserByEmail(courriel, callback) {
    db.query("SELECT * FROM utilisateurs WHERE courriel = $1", [courriel], (err, results) => {
        callback(err, results.rows);
    });
}

export function updateApiKey(id, callback) {
    const cle_api = crypto.randomBytes(16).toString("hex");
    db.query("UPDATE utilisateurs SET cle_api = $1 WHERE id = $1", [cle_api, id], (err) => {
        callback(err, cle_api);
    });
}

export function getUserByApiKey(cle_api, callback) {
    db.query("SELECT * FROM utilisateurs WHERE cle_api = $1", [cle_api], (err, results) => {
        callback(err, results.rows);
    });
}

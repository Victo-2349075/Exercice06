import { createUser, getUserByEmail, updateApiKey } from "./src/Models/user.models.js";
import bcrypt from "bcrypt";

export function registerUser(req, res) {
    const { nom, courriel, mot_de_passe } = req.body;

    if (!nom || !courriel || !mot_de_passe) {
        return res.status(400).json({ erreur: "Tous les champs sont requis" });
    }

    createUser(nom, courriel, mot_de_passe, (err, cle_api, message) => {
        if (err) return res.status(500).json({ erreur: "Erreur serveur" });
        if (!cle_api) return res.status(400).json({ erreur: message });

        res.status(201).json({ message: "L'utilisateur a été créé", cle_api });
    });
}

export function getApiKey(req, res) {
    const { courriel, mot_de_passe } = req.body;
    const nouvelle = req.query.nouvelle === "1";

    getUserByEmail(courriel, (err, user) => {
        if (err) return res.status(500).json({ erreur: "Erreur serveur" });
        if (!user) return res.status(404).json({ erreur: "Utilisateur non trouvé" });

        if (!bcrypt.compareSync(mot_de_passe, user.mot_de_passe)) {
            return res.status(401).json({ erreur: "Mot de passe incorrect" });
        }

        if (nouvelle) {
            updateApiKey(user.id, (err, newKey) => {
                if (err) return res.status(500).json({ erreur: "Erreur serveur" });
                res.json({ cle_api: newKey });
            });
        } else {
            res.json({ cle_api: user.cle_api });
        }
    });
}

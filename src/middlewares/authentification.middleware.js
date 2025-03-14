import { getUserByApiKey } from "./src/Models/user.models.js";

export function validateApiKey(req, res, next) {
    const authorization = req.headers.authorization;

    if (!authorization || !authorization.startsWith("cle_api ")) {
        return res.status(401).json({ erreur: "Clé API manquante ou invalide" });
    }

    const cle_api = authorization.split(" ")[1];

    getUserByApiKey(cle_api, (err, user) => {
        if (err) return res.status(500).json({ erreur: "Erreur serveur" });
        if (!user) return res.status(401).json({ erreur: "Clé API invalide" });

        req.user = user;
        next();
    });
}

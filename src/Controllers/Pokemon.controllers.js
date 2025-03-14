import { getPokemonById, getAllPokemons, createPokemon, deletePokemon, getPokemonsByType } from "./src/models/pokemon.models.js";

export function getPokemon(req, res) {
    getPokemonById(req.params.id, (err, pokemon) => {
        if (err) return res.status(500).json({ erreur: "Erreur serveur" });
        if (!pokemon) return res.status(404).json({ erreur: "Pokémon introuvable" });
        res.json(pokemon);
    });
}

export function getPokemons(req, res) {
    getAllPokemons((err, pokemons) => {
        if (err) return res.status(500).json({ erreur: "Erreur serveur" });
        res.json(pokemons);
    });
}

export function addPokemon(req, res) {
    if (!req.body.nom || !req.body.type_primaire)
        return res.status(400).json({ erreur: "Données invalides" });

    createPokemon(req.body, (err, id) => {
        if (err) return res.status(500).json({ erreur: "Erreur serveur" });
        res.status(201).json({ message: "Pokémon ajouté", id });
    });
}

export function removePokemon(req, res) {
    deletePokemon(req.params.id, (err, affectedRows) => {
        if (err) return res.status(500).json({ erreur: "Erreur serveur" });
        if (!affectedRows) return res.status(404).json({ erreur: "Pokémon introuvable" });
        res.json({ message: "Pokémon supprimé" });
    });
}

export function getPokemonList(req, res) {
    const type = req.query.type || "";
    const page = parseInt(req.query.page) || 1;
    const limit = 25;
    const offset = (page - 1) * limit;

    getPokemonsByType(type, limit, offset, (err, pokemons, total) => {
        if (err) return res.status(500).json({ erreur: "Echec lors de la récupération de la liste des pokemons" });

        if (total === 0) {
            return res.json({ pokemons: [], type, nombrePokemonTotal: 0, page: 1, totalPage: 1 });
        }

        const totalPage = Math.ceil(total / limit);

        res.json({
            pokemons,
            type,
            nombrePokemonTotal: total,
            page,
            totalPage
        });
    });
}

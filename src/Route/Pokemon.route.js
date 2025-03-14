import { Router } from "express";
import { getPokemon, getPokemons, addPokemon, removePokemon, getPokemonList } from "./src/Controllers/Pokemon.controllers.js";

const router = Router();

router.get("/pokemons/liste", getPokemonList);  
router.get("/pokemons/:id", getPokemon);
router.get("/pokemons", getPokemons);
router.post("/pokemons", addPokemon);
router.delete("/pokemons/:id", removePokemon);

export default router;

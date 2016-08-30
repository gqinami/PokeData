"use strict";

const commonPokemon = require(__appbase + 'models/pokemonSighting'),
      async = require('async'),
      config = require(__base + 'config');

module.exports = {
    /*
     * inserting the pokemon details
     */
    add: function (data, callback) {
        var pokemon = new commonPokemon();
        pokemon['source'] = config.pokemonDataSources.pokeRadar;
        pokemon['pokemonId'] = data['pokemonId'];
        pokemon['appearedOn'] = new Date(data['created'] * 1000);
        pokemon['location']['type'] = "Point";
        pokemon['location']['coordinates'] = [data['longitude'], data['latitude']];


        // saving the data to the database
        pokemon.save(function (err) {
            // on error
            if (err) {
                callback(0, err);
            }
            // on success
            else {
                callback(1, pokemon);
            }
        });
    },
    /*
     * inserting one pokemon into MongoDB
     */
    addPokemon: function (pokemon) {
        module.exports.add(pokemon, function (success, data) {
            if (success === 1) {
                //logger.success('Success: ' + data);
            } else {
                logger.error('Error:' + data);
            }
        });
    },
    /*
     * inserting an array of pokemon into MongoDB
     */
    insert: function (pokemons) {
        let length = 0;

        async.forEach(pokemons, function (pokemon) {
            length++;
            module.exports.addPokemon(pokemon);
        });
        logger.info('\n length',length);
    }
};
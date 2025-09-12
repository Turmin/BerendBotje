const discord = require("discord.js");
const fetch = require("node-fetch");
const progressbar = require('string-progressbar');

function ucwords(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

module.exports = {
	name: 'pokemon',
	aliases: ['pokedex','poke'],
	description: '',
	execute(message, args) {
		if (!args.length) {
			//args[0] = 'charizard';
			message.delete({timeout: 500});
			return message.reply("Geef een geldige naam of ID mee");
		}
        
        args = args.map(a => a.toLowerCase())
        //const query = querystring.stringify({ term: args.join(' ') });
        
        fetch('https://pokeapi.co/api/v2/pokemon/' + args[0], {method: 'GET'})
        .then(response => {
            return response.json()
        }).then(json_data => {
            fetch(json_data.species.url, {method: 'GET'})
            .then(response => {
                return response.json()
            }).then(json_species => {
                // https://dev.to/christinamcmahon/gotta-fetch-em-all-from-the-pokeapi-30ap
                // desc_array[pokemon["id"] - 1]["flavor_text_entries"][desc_array[pokemon["id"] - 1]["flavor_text_entries"].length - 1]["flavor_text"]
                //console.log(json_species[json_data.id - 1]["flavor_text_entries"][json_data.id - 1["flavor_text_entries"].length - 1]["flavor_text"])
                //console.log(json_species["flavor_text_entries"])
                //console.log(json_species.flavor_text_entries)
                //const species = json_species.find(o => o.species.toLowerCase() === 'NL')
                //console.log(species)
            }).catch(function(err) {
            	console.log(err);
            })

            statsNL = {'hp':'Kracht','attack':'Aanval','defense':'Verdediging','special-attack':'Speciale aanval','special-defense':'Speciale verdediging', 'speed':'Snelheid'}

            var stats = [];
            for(let key in json_data.stats) {
                var element = {}
                element.name = statsNL[json_data.stats[key].stat.name]
                element.value = json_data.stats[key].base_stat + " " + progressbar.filledBar(200, json_data.stats[key].base_stat, size=15)
                //element.inline = true
                stats.push(element)
            }
            
            var abilities = [];
            for(let key in json_data.abilities) {
                abilities.push(ucwords(json_data.abilities[key].ability.name))
            }

            var types = [];
            for(let key in json_data.types) {
                types.push(ucwords(json_data.types[key].type.name))
            }
          
            var embed = new discord.MessageEmbed()
                .setTitle(ucwords(json_data.name))
                //.setTitle(json_data.name.toUpperCase())
                .setDescription("#" + json_data.id)
                .addField("Type(s)", types.join(", "))
                .addField("Capiciteit(en)", abilities.join(", "))
                .addFields(stats)
                .addField("Lengte", (json_data.height >= 10 ? json_data.height / 10 + " m" : json_data.height * 10 + " cm"), true)
                .addField("Gewicht", (json_data.weight / 10) + " kg", true)
                .setColor("RANDOM")
            	.setThumbnail(`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${json_data.id}.png`)
                //.setThumbnail(`https://pokeres.bastionbot.org/images/pokemon/${json_data.id}.png`) # bastionbot is not working anymore
                //.setImage(`https://pokeres.bastionbot.org/images/pokemon/${json_data.id}.png`);
            return message.channel.send(embed);
        })
        .catch(function(err) {
            console.log(err);
            if(err.response && err.response.status === 404) {
                return message.reply("Pokémon \"" + args[0].toLowerCase() + "\" is niet gevonden.").then(msg => {
                	msg.delete({timeout: 10000})
              	}).catch(console.error)
            } else {
                return message.channel.send("Er is een fout opgetreden.")
            }
        });
    },
};
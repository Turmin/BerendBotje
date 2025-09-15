require('dotenv').config();
const { EmbedBuilder } = require("discord.js");
const progressbar = require('string-progressbar');

function ucwords(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

module.exports = {
    name: 'pokemon',
    aliases: ['pokedex','poke'],
    description: 'Search for a Pokemon',
    execute(message, args) {
        if (!args.length) {
            message.delete({timeout: 500}).catch(console.error);
            return message.reply("Geef een geldige naam of ID mee\n\n💡 *Tip: Probeer ook \`/pokemon [naam]\` voor de nieuwe slash command!*");
        }
        
        args = args.map(a => a.toLowerCase());
        
        fetch('https://pokeapi.co/api/v2/pokemon/' + args[0], {method: 'GET'})
        .then(response => {
            return response.json()
        }).then(json_data => {
            const statsNL = {'hp':'Kracht','attack':'Aanval','defense':'Verdediging','special-attack':'Speciale aanval','special-defense':'Speciale verdediging', 'speed':'Snelheid'};

            var stats = [];
            for(let key in json_data.stats) {
                var element = {}
                element.name = statsNL[json_data.stats[key].stat.name] || json_data.stats[key].stat.name;
                element.value = json_data.stats[key].base_stat + " " + progressbar.filledBar(200, json_data.stats[key].base_stat, {size: 15});
                element.inline = true;
                stats.push(element);
            }
            
            var abilities = [];
            for(let key in json_data.abilities) {
                abilities.push(ucwords(json_data.abilities[key].ability.name));
            }

            var types = [];
            for(let key in json_data.types) {
                types.push(ucwords(json_data.types[key].type.name));
            }
          
            var embed = new EmbedBuilder()
                .setTitle(ucwords(json_data.name))
                .setDescription("#" + json_data.id)
                .addFields(
                    {name: "Type(s)", value: types.join(", "), inline: false},
                    {name: "Capaciteit(en)", value: abilities.join(", "), inline: false},
                    ...stats,
                    {name: "Lengte", value: (json_data.height >= 10 ? json_data.height / 10 + " m" : json_data.height * 10 + " cm"), inline: true},
                    {name: "Gewicht", value: (json_data.weight / 10) + " kg", inline: true}
                )
                .setColor("Random")
                .setThumbnail(`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${json_data.id}.png`)
                .setFooter({text: "💡 Tip: Probeer ook /pokemon voor de nieuwe slash command!"});
                
            return message.channel.send({embeds: [embed]});
        })
        .catch(function(err) {
            console.log(err);
            if(err.response && err.response.status === 404) {
                return message.reply("Pokémon \"" + args[0].toLowerCase() + "\" is niet gevonden.\n\n💡 *Tip: Probeer ook \`/pokemon [naam]\` voor de nieuwe slash command!*").then(msg => {
                    msg.delete({timeout: 10000}).catch(console.error);
                }).catch(console.error);
            } else {
                return message.channel.send("Er is een fout opgetreden.");
            }
        });
    },
};
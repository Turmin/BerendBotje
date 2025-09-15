require('dotenv').config();
const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: 'nookipedia',
    aliases: ['ac','animalcrossing'],
    description: 'Search Animal Crossing villager',
    execute(message, args) {
        if (!args.length) {
            message.delete().catch(console.error);
            return message.reply("Geef een geldige naam mee\n\n💡 *Tip: Probeer ook \`/nookipedia [naam]\` voor de nieuwe slash command!*");
        }
        
        args = args.map(a => a.toLowerCase());
        
        const headers = {
            'X-API-KEY': 'bf930b29-5302-41c5-8db9-75d9e699e7cb',
            'Accept-Version': '1.4.0'
        };
        
        fetch('https://api.nookipedia.com/villagers', {method: 'GET', headers: headers})
        .then(response => {
            return response.json()
        }).then(json => {
            const villager = json.find(o => o.name.toLowerCase() === args[0]);
            if(typeof villager !== 'undefined' && villager) {
                var embed = new EmbedBuilder()
                    .setTitle(villager.name)
                    .setDescription(villager.quote)
                    .addFields(
                        {name: "Soort", value: villager.species, inline: true},
                        {name: "Persoonlijkheid", value: villager.personality, inline: true},
                        {name: "Geslacht", value: villager.gender, inline: true},
                        {name: "Verjaardag", value: villager.birthday_day + " " + villager.birthday_month, inline: false},
                        {name: "Slagzin", value: villager.phrase, inline: false},
                        {name: "Kleding", value: villager.clothing, inline: false}
                    )
                    .setColor('#' + villager.title_color)
                    .setImage(villager.image_url)
                    .setFooter({text: "💡 Tip: Probeer ook /nookipedia voor de nieuwe slash command!"});
                    
                return message.channel.send({embeds: [embed]});
            } else {
                return message.reply("Naam \"" + args[0] + "\" niet gevonden\n\n💡 *Tip: Probeer ook \`/nookipedia [naam]\` voor de nieuwe slash command!*");
            }
        }).catch(function(err) {
            console.log(err);
            return message.channel.send("Er is een fout opgetreden.");
        });
    },
};
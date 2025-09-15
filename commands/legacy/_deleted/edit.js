const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: 'edit',
    description: 'Edit message embed with reaction counts',
    execute(message, args) {
        if(!args[0]) return message.reply("Geef een message ID mee\n\n💡 *Note: Dit is een legacy admin functie.*");
        
        const embed = new EmbedBuilder();

        message.channel.messages.fetch(args[0])
        .then(msg => {
            const up = (msg.reactions.cache.get('👍') ? msg.reactions.cache.get('👍').count - 1 : 0);
            const down = (msg.reactions.cache.get('👎') ? msg.reactions.cache.get('👎').count - 1 : 0);
            
            if (msg.embeds && msg.embeds.length > 0) {
                const originalEmbed = msg.embeds[0];
                embed.setTitle(originalEmbed.title || 'No Title');
                embed.setDescription(originalEmbed.description || 'No Description');
                embed.setColor(originalEmbed.color || 'Random');
                
                if (originalEmbed.thumbnail) {
                    embed.setThumbnail(originalEmbed.thumbnail.url);
                }
                
                if (originalEmbed.fields && originalEmbed.fields.length > 0) {
                    originalEmbed.fields.forEach(field => {
                        embed.addFields({name: field.name, value: field.value, inline: field.inline});
                    });
                }
            }
            
            embed.addFields({name: "Reacties", value: `Up: ${up} Down: ${down}`, inline: false});
            embed.setFooter({text: "BIJGEWERKT - Legacy edit command"});
            embed.setTimestamp();
            
            msg.reactions.removeAll().catch(console.error);
            msg.edit({embeds: [embed]}).then(() => {
                message.channel.send(`✅ Message ${args[0]} bijgewerkt!\n\n💡 *Note: Dit is een legacy admin functie.*`).then(confirmMsg => {
                    setTimeout(() => confirmMsg.delete().catch(console.error), 5000);
                });
            }).catch(error => {
                message.reply('Er is een fout opgetreden bij het bewerken van het bericht.');
            });
            
            message.delete().catch(console.error);
        }).catch(err => {
            if(err.code === 10008) {
                return message.reply("Message ID is niet gevonden");
            }
            console.log(err);
            return message.reply("Er is een fout opgetreden");
        });
    },
};
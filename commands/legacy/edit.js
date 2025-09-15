const {MessageEmbed} = require("discord.js");

module.exports = {
	name: 'edit',
	execute(message, args) {
	    
	    if(!args[0]) return message.reply("Geef een ID mee");
	    
	    const embed = new MessageEmbed();

        message.channel.messages.fetch(args[0])
        .then(msg => {
            const up = (msg.reactions.cache.get('👍') ? msg.reactions.cache.get('👍').count-1 : 0);
            const down = (msg.reactions.cache.get('👎') ? msg.reactions.cache.get('👎').count-1 : 0);
            msg.embeds.map((entry) => {
                embed.setTitle(entry.title);
                embed.setDescription(entry.description);
                embed.setColor(entry.color);
                embed.setThumbnail(entry.thumbnail.url);
                entry.fields.map((f) => embed.addField(f.name,f.value,f.inline));
            });
            embed.addField("Reacties ","Up: " + up + " Down: " + down);
            embed.setFooter("BIJGEWERKT");
            embed.setTimestamp();
            msg.reactions.removeAll();
            msg.edit(embed);
            message.delete();
        }).catch(err => {
            if(err.httpStatus === 404) return message.reply("ID is niet gevonden");
            console.log(err);
            return message.reply("Er is een fout opgetreden");
        });
    },
};
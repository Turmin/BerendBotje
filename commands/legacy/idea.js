const discord = require("discord.js");
const {channelids} = require("../config.json");

module.exports = {
	name: 'idea',
	aliases: ['idee'],
   	execute(message, args) {
        const content = args.join(" ")

        if(message.channel.id !== channelids.BOTCOMMANDS && message.channel.id !== channelids.CODE && message.channel.id !== channelids.ALGEMEEN_MICH) {
	        return message.reply("Je mag dit niet in dit kanaal plaatsen.").then(msg => {
                msg.delete({ timeout: 5000})
            }).catch(console.error);
	    }
        
        var embed = new discord.MessageEmbed()
            .setAuthor(message.member.displayName, message.author.avatarURL({ dynamic:true }))
            .setDescription(content)
            .addField("Status", "📊 Stemronde")
            .setColor("#fa9600")
            //.setFooter(`Id: ${message.id}`, "https://bit.ly/2uYYSGa");
        
		if(content == "") return message.reply("Je hebt geen bericht meegegeven.");
        channel_id = channelids.ALGEMEEN_MICH
        // channel_id = channelids.IDEAS
        channel = message.client.channels.cache.get(channel_id)
        if(typeof channel !== 'undefined') {
            return channel.send(embed).then(async e => {
                await e.react('✅');
                await e.react('❌');
                return message.channel.send("Bedankt, " + message.author.username + "! Je idee is geplaatst in <#" + channel_id + ">!");
            }).catch(err => {
                console.log(err);
                return message.channel.send("Het is niet gelukt het bericht te verzenden");
            });
        } else {
        	return message.channel.send("Het is niet gelukt het bericht te verzenden");
        }
    },
};
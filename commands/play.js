const discord = require("discord.js");

module.exports = {
	name: 'play',
	aliases: ['clear-queue','leave','loop','music','next','nowplaying','pause','queue','resume','search','shuffle','skip','stop','volume'],
	execute(message, args){	    
        message.delete();
        
        var embed = new discord.MessageEmbed()
            .setTitle("Muziek bot is offline i.v.m. sommaties van Google/Youtube")
            .setDescription("[Meer info](https://tweakers.net/nieuws/186186/discord-bot-groovy-stopt-maandag-met-werken-na-sommatie-google.html)")
            .setColor("RANDOM");
        message.channel.send(embed).then(msg => {
        	msg.delete({ timeout: 10000})
        }).catch(console.error);
    },
};
const discord = require("discord.js");
const moment = require("moment");

module.exports = {
	name: 'serverinfo',
	aliases: ['info'],
	execute(message, args) {
    
        var memberCount = message.guild.memberCount;
        var bots = message.guild.members.cache.filter(m => m.user.bot).size;
        var peoples = memberCount - bots;
        var online = message.guild.members.cache.filter(m => m.user.presence.status == "online" || m.user.presence.status == "dnd" || m.user.presence.status == "idle").size;
        
        let totalSeconds = (message.client.uptime / 1000);
        let days = Math.floor(totalSeconds / 86400);
        totalSeconds %= 86400;
        let hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = Math.floor(totalSeconds % 60);
        
        let uptime = (days > 0 ? days + " days, " : "") + (hours > 0 ? hours + " hours, " : "") + (minutes > 0 ? minutes + " minutes and " : "") + seconds + " seconds";
        
        let embed = new discord.MessageEmbed()
                .setColor("RANDOM")
                .setTitle("Server Info")
                .setThumbnail(message.guild.iconURL())
                .setDescription(message.guild.name + "'s information")
                //.addField('Member Count', `${message.guild.memberCount - message.guild.members.cache.filter(m=>m.user.bot).size} (${message.guild.members.cache.filter(m=>m.user.bot).size} bots)`, true)
                .addField("Owner", `The owner of this server is ${message.guild.owner}`)
                .addField("Member Count", memberCount, true)
                .addField("Peoples", peoples, true)
                .addField("Bots", bots, true)
                .addField("Online", online, true)
                .addField("Emoji Count", `${message.guild.emojis.cache.size} emojis`)
                .addField("Roles Count", `${message.guild.roles.cache.size} roles`)
                .addField('Location', message.guild.region, true)
                .addField('Created', moment(message.guild.createdAt).format("DD-MM-YYYY hh:mm"), true)
                .addField('ID ', message.id)
                .addField("Uptime bot", uptime);
                
        message.channel.send(embed).then(message => {
            message.edit(embed.addField('ID2 ', message.id))
            message.react('👍').then(r => {
                message.react('👎')
            });
        });
        message.delete({timeout: 500});
    },
};
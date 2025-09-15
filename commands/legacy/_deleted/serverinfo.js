require('dotenv').config();
const { EmbedBuilder } = require("discord.js");
const moment = require("moment");

module.exports = {
    name: 'serverinfo',
    aliases: ['info'],
    execute(message, args) {
        
        const memberCount = message.guild.memberCount;
        const bots = message.guild.members.cache.filter(m => m.user.bot).size;
        const peoples = memberCount - bots;
        const online = message.guild.members.cache.filter(m => ['online', 'dnd', 'idle'].includes(m.presence?.status)).size;
        
        let totalSeconds = (message.client.uptime / 1000);
        let days = Math.floor(totalSeconds / 86400);
        totalSeconds %= 86400;
        let hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = Math.floor(totalSeconds % 60);
        
        let uptime = (days > 0 ? days + " days, " : "") + (hours > 0 ? hours + " hours, " : "") + (minutes > 0 ? minutes + " minutes and " : "") + seconds + " seconds";
        
        let embed = new EmbedBuilder()
                .setColor("Random")
                .setTitle("Server Info")
                .setThumbnail(message.guild.iconURL())
                .setDescription(message.guild.name + "'s information")
                .addFields(
                    {name: "Owner", value: `<@${message.guild.ownerId}>`, inline: true},
                    {name: "Member Count", value: memberCount.toString(), inline: true},
                    {name: "Peoples", value: peoples.toString(), inline: true},
                    {name: "Bots", value: bots.toString(), inline: true},
                    {name: "Online", value: online.toString(), inline: true},
                    {name: "Emoji Count", value: `${message.guild.emojis.cache.size} emojis`, inline: true},
                    {name: "Roles Count", value: `${message.guild.roles.cache.size} roles`, inline: true},
                    {name: "Created", value: moment(message.guild.createdAt).format("DD-MM-YYYY HH:mm"), inline: true},
                    {name: "ID", value: message.guild.id, inline: true},
                    {name: "Uptime bot", value: uptime, inline: false}
                )
                .setFooter({text: "💡 Tip: Probeer ook /serverinfo voor de nieuwe slash command!"});
                
        message.channel.send({embeds: [embed]}).then(sentMessage => {
            sentMessage.react('👍').then(r => {
                sentMessage.react('👎').catch(console.error);
            }).catch(console.error);
        }).catch(console.error);
        
        message.delete({timeout: 500}).catch(console.error);
    },
};
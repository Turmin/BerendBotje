const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const moment = require('moment');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('serverinfo')
        .setDescription('Toon server informatie'),
    async execute(interaction) {
        const guild = interaction.guild;
        const memberCount = guild.memberCount;
        const bots = guild.members.cache.filter(m => m.user.bot).size;
        const peoples = memberCount - bots;
        const online = guild.members.cache.filter(m => ['online', 'dnd', 'idle'].includes(m.presence?.status)).size;
        
        const embed = new EmbedBuilder()
            .setTitle("Server Info")
            .setThumbnail(guild.iconURL())
            .setDescription(`${guild.name}'s information`)
            .addFields(
                {name: "Owner", value: `<@${guild.ownerId}>`, inline: true},
                {name: "Member Count", value: memberCount.toString(), inline: true},
                {name: "Peoples", value: peoples.toString(), inline: true},
                {name: "Bots", value: bots.toString(), inline: true},
                {name: "Online", value: online.toString(), inline: true},
                {name: "Emoji Count", value: `${guild.emojis.cache.size} emojis`, inline: true},
                {name: "Roles Count", value: `${guild.roles.cache.size} roles`, inline: true},
                {name: "Created", value: moment(guild.createdAt).format("DD-MM-YYYY HH:mm"), inline: true},
                {name: "ID", value: guild.id, inline: true}
            )
            .setColor('Random');
            
        await interaction.reply({embeds: [embed]});
    },
};
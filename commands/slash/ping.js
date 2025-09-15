const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Test de server response tijd'),
    async execute(interaction) {
        const ping = Date.now() - interaction.createdTimestamp;
        await interaction.reply(`Pong! ${ping}ms`);
    },
};
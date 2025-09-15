const { SlashCommandBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cat')
        .setDescription('Random afbeelding van een kat'),
    async execute(interaction) {
        try {
            const response = await fetch('https://nekos.life/api/v2/img/meow');
            const data = await response.json();
            await interaction.reply(data.url);
        } catch (error) {
            console.error('Cat API error:', error);
            await interaction.reply('Er ging iets mis bij het ophalen van een kattenafbeelding! 🐱');
        }
    },
};
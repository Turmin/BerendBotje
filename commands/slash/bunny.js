const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bunny')
        .setDescription('Random afbeelding van een konijn'),
    async execute(interaction) {
        try {
            const response = await fetch('https://api.bunnies.io/v2/loop/random/?media=gif,png');
            const data = await response.json();
            await interaction.reply(data.media.gif);
        } catch (error) {
            console.error('Bunny API error:', error);
            await interaction.reply('Er ging iets mis bij het ophalen van een konijnenafbeelding! 🐰');
        }
    },
};
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('fox')
        .setDescription('Random afbeelding van een vos'),
    async execute(interaction) {
        try {
            const response = await fetch('https://randomfox.ca/floof/');
            const data = await response.json();
            await interaction.reply(data.image);
        } catch (error) {
            console.error('Fox API error:', error);
            await interaction.reply('Er ging iets mis bij het ophalen van een vossenafbeelding! 🦊');
        }
    },
};
const { SlashCommandBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dog')
        .setDescription('Random afbeelding van een hond'),
    async execute(interaction) {
        try {
            const response = await fetch('https://random.dog/woof.json');
            const data = await response.json();
            await interaction.reply(data.url);
        } catch (error) {
            console.error('Dog API error:', error);
            await interaction.reply('Er ging iets mis bij het ophalen van een hondenafbeelding! 🐕');
        }
    },
};
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pedro')
        .setDescription('Pedro GIF voor als je hem nodig hebt'),
    async execute(interaction) {
        try {
            await interaction.reply({ 
                files: ["./img/pedro.gif"],
                content: "Pedro! 🦝"
            });
        } catch (error) {
            console.error('Pedro command error:', error);
            await interaction.reply('❌ Pedro is er even niet... probeer het later opnieuw!');
        }
    },
};
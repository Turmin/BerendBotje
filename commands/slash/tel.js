const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tel')
        .setDescription('Laat de bot tellen')
        .addIntegerOption(option =>
            option.setName('aantal')
                .setDescription('Tot hoever moet de bot tellen (1-10)')
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(10)),
    async execute(interaction) {
        const aantal = interaction.options.getInteger('aantal');
        
        await interaction.reply(`Ik tel tot ${aantal}`);
        
        for (let i = 1; i <= aantal; i++) {
            await new Promise(resolve => setTimeout(resolve, 2000));
            await interaction.followUp(i.toString());
        }
    },
};
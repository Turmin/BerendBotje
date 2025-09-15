const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kroket')
        .setDescription('Hoelang moet je kroket in de airfryer?'),
    async execute(interaction) {
        const kroketEmbed = new EmbedBuilder()
            .setTitle("Kroket")
            .addFields({name: "Airfryer XL", value: "11 minuten op 200°C"})
            .setColor('Random')
            .setImage('attachment://broodje-kroket.png');
            
        await interaction.reply({
            embeds: [kroketEmbed], 
            files: ['img/broodje-kroket.png']
        });
    },
};
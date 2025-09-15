const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { activities } = require('../../quotes.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('quote')
        .setDescription('Random inspirational quote')
        .addStringOption(option =>
            option.setName('type')
                .setDescription('Type quote (optioneel)')
                .addChoices(
                    { name: 'Inspirational', value: 'activities' },
                    { name: 'Winnie the Pooh', value: 'pooh' }
                )),
    async execute(interaction) {
        const quoteType = interaction.options.getString('type') || 'activities';
        
        try {
            let quote, embed;
            
            if (quoteType === 'pooh') {
                const { poohQuotes } = require('../../quotes.json');
                quote = poohQuotes[Math.floor(Math.random() * poohQuotes.length)];
                
                embed = new EmbedBuilder()
                    .setDescription(`**${quote}**`)
                    .setColor('Gold')
                    .setThumbnail('attachment://pooh.png')
                    .setFooter({ text: "Silly Old Bear 🐻🍯" });
                
                await interaction.reply({
                    embeds: [embed],
                    files: ['./img/pooh.png']
                });
            } else {
                quote = activities[Math.floor(Math.random() * activities.length)];
                
                embed = new EmbedBuilder()
                    .setDescription(`**"${quote}"**`)
                    .setColor('Random')
                    .setFooter({ 
                        text: "Inspirational Quote",
                        iconURL: interaction.client.user.displayAvatarURL()
                    });
                
                await interaction.reply({ embeds: [embed] });
            }
        } catch (error) {
            console.error('Quote command error:', error);
            await interaction.reply('Er ging iets mis bij het ophalen van een quote! 💭');
        }
    },
};
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('music')
        .setDescription('Informatie over de muziek bot (momenteel offline)'),
    async execute(interaction) {
        const musicEmbed = new EmbedBuilder()
            .setTitle('🎵 Muziek Bot Status')
            .setDescription('De muziek bot is momenteel **offline** vanwege juridische problemen.')
            .addFields(
                { 
                    name: '❌ Waarom offline?', 
                    value: 'Google/YouTube heeft verschillende muziek bots gedwongen te stoppen vanwege copyright claims.', 
                    inline: false 
                },
                { 
                    name: '🔗 Meer informatie', 
                    value: '[Lees meer op Tweakers](https://tweakers.net/nieuws/186186/discord-bot-groovy-stopt-maandag-met-werken-na-sommatie-google.html)', 
                    inline: false 
                },
                { 
                    name: '🎶 Alternatieven', 
                    value: '• Spotify\n• YouTube Music\n• Apple Music\n• Andere muziek bots die nog wel werken', 
                    inline: false 
                },
                { 
                    name: '📅 Toekomst', 
                    value: 'We kijken naar legale alternatieven voor muziek in Discord.', 
                    inline: false 
                }
            )
            .setColor('Red')
            .setThumbnail('https://cdn.discordapp.com/emojis/852958647967391764.png') // Music note emoji
            .setFooter({ 
                text: 'Sorry voor het ongemak',
                iconURL: interaction.client.user.displayAvatarURL()
            })
            .setTimestamp();
            
        await interaction.reply({ embeds: [musicEmbed] });
    },
};
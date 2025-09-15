const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: 'play',
    aliases: ['clear-queue','leave','loop','music','next','nowplaying','pause','queue','resume','search','shuffle','skip','stop','volume'],
    execute(message, args) {        
        message.delete().catch(console.error);
        
        const embed = new EmbedBuilder()
            .setTitle("🎵 Muziek Bot Status")
            .setDescription("De muziek bot is momenteel **offline** vanwege juridische problemen.")
            .addFields(
                {name: "❌ Waarom offline?", value: "Google/YouTube heeft verschillende muziek bots gedwongen te stoppen vanwege copyright claims.", inline: false},
                {name: "🔗 Meer informatie", value: "[Lees meer op Tweakers](https://tweakers.net/nieuws/186186/discord-bot-groovy-stopt-maandag-met-werken-na-sommatie-google.html)", inline: false},
                {name: "🎶 Alternatieven", value: "• Spotify\n• YouTube Music\n• Apple Music\n• Andere muziek bots die nog wel werken", inline: false}
            )
            .setColor("Red")
            .setFooter({text: "💡 Tip: Probeer ook /music voor de nieuwe slash command!"});
            
        message.channel.send({embeds: [embed]}).then(msg => {
            setTimeout(() => msg.delete().catch(console.error), 10000);
        }).catch(console.error);
    },
};
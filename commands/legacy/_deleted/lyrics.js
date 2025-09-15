module.exports = {
    name: 'lyrics',
    aliases: ['lyric'],
    description: 'Song lyrics lookup',
    execute(message, args) {
        // This was a placeholder command that was never fully implemented
        const songQuery = args.join(' ');
        
        if (!songQuery) {
            return message.reply("Geef een songtitel mee om lyrics te zoeken.\n\n💡 *Note: Deze functie was nooit volledig geïmplementeerd in de legacy bot.*");
        }
        
        message.channel.send(
            `🎵 Lyrics zoeken voor: "${songQuery}"\n\n` +
            `❌ **Legacy Functionaliteit Niet Beschikbaar**\n` +
            `Deze functie was nooit volledig geïmplementeerd.\n\n` +
            `💡 **Alternatieven:**\n` +
            `• Gebruik Genius.com direct\n` +
            `• Probeer andere lyrics bots\n` +
            `• Zoek op Google: "${songQuery} lyrics"\n\n` +
            `*Note: Genius API vereist speciale setup die niet is geconfigureerd.*`
        );
    },
};
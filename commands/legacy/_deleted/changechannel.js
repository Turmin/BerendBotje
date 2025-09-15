module.exports = {
    name: 'changechannel',
    description: 'Change channel name',
    permissions: 'ManageChannels',
    execute(message, args) {        
        message.delete().catch(console.error);
        
        const content = args.join(" ");
        
        if(!content) return message.reply("Geef een nieuwe naam mee\n\n💡 *Note: Dit is een legacy admin command.*");
        
        // Hardcoded channel ID - in een echte implementatie zou dit configureerbaar moeten zijn
        const targetChannelId = '871400797404020776';
        const targetChannel = message.client.channels.cache.get(targetChannelId);
        
        if (!targetChannel) {
            return message.reply("Target kanaal niet gevonden");
        }
        
        (async () => {
            try {
                await targetChannel.setName(content);
                console.log('Channel updated to:', content);
                message.channel.send(`✅ Kanaal naam gewijzigd naar: "${content}"\n\n💡 *Note: Dit is een legacy admin command.*`).then(msg => {
                    setTimeout(() => msg.delete().catch(console.error), 10000);
                });
            } catch (error) {
                console.error('Channel name change error:', error);
                message.channel.send('❌ Er is een fout opgetreden bij het wijzigen van de kanaal naam.');
            }
        })();
    },
};
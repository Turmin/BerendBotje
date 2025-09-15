module.exports = {
    name: 'embed',
    permissions: 'ManageMessages',
    execute(message, args) {
        if(args[1] == null) {
            return message.reply('Voorbeelden```!embed #test { "title": "Example embed", "description": "Test", "color": "0x00ff00", "text": "Hello world" }```\n\n💡 *Tip: Probeer ook `/embed` voor de nieuwe slash command!*');
        }
        
        const targetChannel = message.mentions.channels.first();
        if(!targetChannel) {
            return message.reply('Geef een kanaal mee waarin je het bericht wilt sturen\n\n💡 *Tip: Probeer ook `/embed` voor de nieuwe slash command!*');
        }
        
        args.shift();

        try {
            const json = JSON.parse(args.join(' '));
            const { text = '' } = json;

            targetChannel.send({
                content: text,
                embeds: [json],
            }).then(() => {
                message.channel.send(`✅ Embed verstuurd naar ${targetChannel}!\n\n💡 *Tip: Probeer ook \`/embed\` voor de nieuwe slash command!*`);
            }).catch(error => {
                message.reply('Er is een fout opgetreden bij het versturen: ' + error.message);
            });
        } catch(error) {
            message.reply('Invalid JSON: ' + error.message + '\n\n💡 *Tip: Probeer ook `/embed` voor de nieuwe slash command!*');
        }
    },
};
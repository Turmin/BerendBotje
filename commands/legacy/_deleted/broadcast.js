module.exports = {
    name: 'broadcast',
    permissions: 'ManageMessages',
    execute(message, args) {
        message.delete().catch(console.error);
        
        if(args[1] == null) {
            return message.reply('!broadcast #test bericht\n\n💡 *Tip: Probeer ook `/broadcast` voor de nieuwe slash command!*').then(msg => {
                msg.delete({ timeout: 5000}).catch(console.error);
            }).catch(console.error);
        }
        
        const targetChannel = message.mentions.channels.first();
        if(!targetChannel) {
            return message.reply('Geef een kanaal mee waarin je het bericht wilt sturen\n\n💡 *Tip: Probeer ook `/broadcast` voor de nieuwe slash command!*').then(msg => {
                msg.delete({ timeout: 5000}).catch(console.error);
            }).catch(console.error);
        }
        
        try {
            args.shift();
            const text = args.join(' ');
            targetChannel.send(text).then(() => {
                message.channel.send(`✅ Bericht verstuurd naar ${targetChannel}!\n\n💡 *Tip: Probeer ook \`/broadcast\` voor de nieuwe slash command!*`).then(msg => {
                    msg.delete({ timeout: 10000}).catch(console.error);
                });
            }).catch(error => {
                message.reply('Er is een fout opgetreden: ' + error.message);
            });
        } catch(error) {
            message.reply('Er is een fout opgetreden: ' + error.message);
        }
    },
};
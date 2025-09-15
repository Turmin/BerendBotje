module.exports = {
	name: 'broadcast',
	//aliases: ['!foo','!bar'],
	permissions: 'MANAGE_MESSAGES',
	execute(message, args) {
        message.delete();
        if(args[1] == null) {
            //https://birdie0.github.io/discord-webhooks-guide/structure/embeds.html
            return message.reply('!broadcast #test bericht').then(msg => {
                msg.delete({ timeout: 5000})
            }).catch(console.error);
        }
		const targetChannel = message.mentions.channels.first();
		if(!targetChannel) {
            return message.reply('Geef een kanaal mee waarin je het bericht wilt sturen').then(msg => {
                msg.delete({ timeout: 5000})
            }).catch(console.error);
		}
		try {
			args.shift();
			const text = args.join(' ');
			targetChannel.send(text).then(msg => {}).catch(console.error);
		} catch(error) {
			message.reply(error.message);
		}
    },
};
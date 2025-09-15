module.exports = {
	name: 'embed',
	//aliases: ['!foo','!bar'],
	permissions: 'MANAGE_MESSAGES',
	execute(message, args) {

        if(args[1] == null) {
            //https://birdie0.github.io/discord-webhooks-guide/structure/embeds.html
            return message.reply('Voorbeelden```!embed #test { "title": "Example embed", "description": "Test", "color": "0x00ff00", "text": "Hello world" }``````!embed #test { "author": { "name": "Delivery Girl", "url": "https://www.reddit.com/r/Pizza/", "icon_url": "https://i.imgur.com/fKL31aD.jpg" }, "title": "Example embed", "url": "https://google.com/", "description": "*Hi!* **Wow!** I can __use__ hyperlinks [here](https://discord.com).", "fields": [ { "name": "Cat", "value": "Hi! :wave:", "inline": true }, { "name": "Dog", "value": "hello!", "inline": true }, { "name": "Cat", "value": "wanna play? join to voice channel!" }, { "name": "Dog", "value": "yay" } ], "footer": { "text": "Woah! *So cool!* :smirk:", "icon_url": "https://i.imgur.com/fKL31aD.jpg" }, "color": "0x00ff00", "text": "Hello world" }```https://birdie0.github.io/discord-webhooks-guide/structure/embeds.html');
        }
		/*
		* !embed #test { "title": "Example embed", "description": "Test", "color": "0x00ff00", "text": "Hello world" }
		*/
        
		const targetChannel = message.mentions.channels.first();
		if(!targetChannel) {
			return message.reply('geef een kanaal mee waarin je het bericht wilt sturen');
		}
		
		args.shift();

		try {
			const json = JSON.parse(args.join(' '));
			const { text = '' } = json;

			targetChannel.send(text, {
				embed: json,
			})
		} catch(error) {
			message.reply('Invalid JSON ' + error.message);
		}
    },
};
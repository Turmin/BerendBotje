module.exports = {
	name: 'reload',
	description: 'Reloads a command',
	args: true,
	execute(message, args) {
    	message.delete();
    		
		if(message.author.id !== '692352395375542284' && message.author.id !==  '425396649255501825'){
    		return message.reply("Jij mag dit niet").then(msg => {
    			msg.delete({ timeout: 10000 })
    		}).catch(console.error);
		}
		if(args[0] == null) return message.reply('Geef een commando mee');

 		const commandName = args[0].toLowerCase();
        console.log(commandName)
        console.log(args[1])
		const filename = commandName.trim();
		const command = message.client.commands.get(commandName) || message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

		if (!command) {
			
			return message.channel.send(`Er is geen commando met naam of alias \`${filename}\`, ${message.author}!`);
		}

		delete require.cache[require.resolve(`./${filename}.js`)];

		try {
			const newCommand = require(`./${filename}.js`);
			message.client.commands.set(newCommand.name, newCommand);
			message.channel.send(`Command \`${commandName}\` was reloaded!`);
		} catch (error) {
			console.error(error);
			message.channel.send(`Er is een fout opgetreden met inladen van \`${commandName}\`:\n\`${error.message}\``);
		}
	},
};
module.exports = {
    name: 'reload',
    description: 'Reloads a command',
    args: true,
    execute(message, args) {
        message.delete().catch(console.error);
            
        if(message.author.id !== '692352395375542284' && message.author.id !==  '425396649255501825'){
            return message.reply("Jij mag dit niet\n\n💡 *Note: Legacy reload functie - slash commands worden automatisch geladen!*").then(msg => {
                msg.delete({ timeout: 10000 }).catch(console.error);
            }).catch(console.error);
        }
        
        if(args[0] == null) return message.reply('Geef een commando mee\n\n💡 *Note: Voor slash commands herstart de bot.*');

        const commandName = args[0].toLowerCase();
        const filename = commandName.trim();
        const command = message.client.commands.get(commandName) || message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        if (!command) {
            return message.channel.send(`Er is geen commando met naam of alias \`${filename}\`\n\n💡 *Voor slash commands herstart de bot.*`);
        }

        delete require.cache[require.resolve(`./${filename}.js`)];

        try {
            const newCommand = require(`./${filename}.js`);
            message.client.commands.set(newCommand.name, newCommand);
            message.channel.send(`Legacy command \`${commandName}\` was reloaded!\n\n💡 *Voor slash commands herstart de bot.*`);
        } catch (error) {
            console.error(error);
            message.channel.send(`Er is een fout opgetreden met inladen van \`${commandName}\`:\n\`${error.message}\``);
        }
    },
};
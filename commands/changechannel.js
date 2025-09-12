//const discord = require("discord.js");
const {channelids} = require("../config.json");
//const fetch = require("node-fetch");

module.exports = {
	name: 'changechannel',
	//aliases: [''],
	description: '',
	permissions: 'MANAGE_MESSAGES',
    execute(message, args) {        
        message.delete();
        
        const content = args.join(" ");
        
        if(!content) return message.reply("Geef een nieuwe naam mee");
        
        (async () => {
            await message.client.channels.cache.get('871400797404020776').setName(content);
            console.log('channel updated'); // to' , updatedChannel.name);
        })();
    },
};
const discord = require("discord.js");
//const moment = require("moment");
//const tz = require("moment-timezone");
//moment.locale('nl');
//const con = require("../mysqlcon.js");
//const {channelids} = require("../config.json");

module.exports = {
	name: 'example',
	//aliases: ['foo', 'bar'],
	//permissions: 'KICK_MEMBERS', // https://discord.js.org/#/docs/main/stable/class/Permissions?scrollTo=s-FLAGS
	execute(message, args) {

        const command = message.content.toLowerCase().split(/ +/).shift();
		const content = args.join(" ");
		if(content == "") return message.reply("Je hebt geen bericht meegegeven.");		
		
        var embed = new discord.MessageEmbed()
            .setTitle("Example")
            .addField("Command", command)
            .addField("Content", content)
            .addField("\u200b", "\u200b")
            .setColor("RANDOM")
            .setFooter("ID: " + message.id, "https://bit.ly/2uYYSGa");
		        
        return message.channel.send(embed).then(async e => {
            await e.react('✅');
            await e.react('❌');
        });
	},
};
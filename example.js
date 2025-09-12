//const discord = require("discord.js");
//const moment = require("moment");
//const tz = require("moment-timezone");
//moment.locale('nl');
//const con = require("../mysqlcon.js");
//const {channelids} = require("../config.json");

module.exports = {
	name: '!example',
	//aliases: ['!foo', '!bar'],
	permissions: 'KICK_MEMBERS', // https://discord.js.org/#/docs/main/stable/class/Permissions?scrollTo=s-FLAGS
	execute(message, args) {

        const command = message.content.toLowerCase().split(/ +/).shift();
		//const content = message.content.slice(command.length).trim();
		//of
		const content = args.join(" ");
		if(content == "") return message.reply("Je hebt geen bericht meegegeven.");
		return message.reply("Bericht: " + content);

	},
};
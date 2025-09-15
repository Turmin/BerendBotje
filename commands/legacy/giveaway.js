const discord = require("discord.js");
//const moment = require("moment");
//const tz = require("moment-timezone");
//moment.locale('nl');
//const con = require("../mysqlcon.js");
//const {channelids} = require("../config.json");

module.exports = {
	name: 'giveaway',
	//aliases: ['foo', 'bar'],
	//permissions: 'KICK_MEMBERS', // https://discord.js.org/#/docs/main/stable/class/Permissions?scrollTo=s-FLAGS
	permissions: 'MANAGE_MESSAGES',
	execute(message, args) {

        const command = message.content.toLowerCase().split(/ +/).shift();
		const content = args.join(" ");
		if(content == "") return message.reply("Je hebt geen bericht meegegeven.");		
		
	},
};
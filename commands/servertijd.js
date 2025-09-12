const discord = require("discord.js");
//const cron = require("node-cron"); // https://www.npmjs.com/package/node-cron (Using Cronjobs)
const moment = require("moment"); // https://www.npmjs.com/package/moment (Date Formatting)
const tz = require("moment-timezone");
const con = require("../mysqlcon.js");

module.exports = {
	name: 'servertijd',
	//aliases: [''],
    execute(message, args) {
        message.delete();
        
        con.query("SELECT UTC_TIMESTAMP() as timeutc, CURRENT_TIMESTAMP() as timetz", function (err, result) {
            if (err) throw err;
            var embed = new discord.MessageEmbed()
            .setTitle("Server tijd")
        	.addField("Tijd server: ", moment().format('DD-MM-YYYY HH:mm:ss'))
        	.addField("Tijd server TZ: ", moment().tz('Europe/Amsterdam').format('DD-MM-YYYY HH:mm:ss'))
            .addField('\u200B','\u200B')
        	.addField("Tijd database: ", moment(result['timeutc']).format('DD-MM-YYYY HH:mm:ss'))
        	.addField("Tijd database TZ: ", moment(result['timetz']).format('DD-MM-YYYY HH:mm:ss'))
            .setColor("RANDOM")
            .attachFiles(['img/sandclock64.png'])
            .setThumbnail('attachment://sandclock64.png');
	        // .setImage('attachment://sandclock64.png');
            return message.channel.send(embed);
        });
    },
};
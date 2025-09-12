const discord = require("discord.js");
//const cron = require("node-cron"); // https://www.npmjs.com/package/node-cron (Using Cronjobs)
// const moment = require("moment"); // https://www.npmjs.com/package/moment (Date Formatting)
// const tz = require("moment-timezone");
// const con = require("../mysqlcon.js");

module.exports = {
	name: 'kroket',
	//aliases: [''],
    execute(message, args) {
        message.delete();
        var embed = new discord.MessageEmbed()
        .setTitle("Kroket")
        .addField("Airfryer XL", "11 minuten op 200°C")
        .setColor("RANDOM")
        .attachFiles(['img/broodje-kroket.png'])
        //.setThumbnail('attachment://sandclock64.png')
	    .setImage('attachment://broodje-kroket.png');
        return message.channel.send(embed);
    },
};
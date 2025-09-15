const discord = require("discord.js");
const cron = require("node-cron"); // https://www.npmjs.com/package/node-cron (Using Cronjobs)
const moment = require("moment"); // https://www.npmjs.com/package/moment (Date Formatting)
const tz = require("moment-timezone");

module.exports = {
	name: 'testcron',
	//aliases: [''],
    execute(message, args) {
        message.delete();

        const hours = (args[0] && !isNaN(args[0]) ? args[0] : '20');
        const minutes = (args[1] && !isNaN(args[1]) ? args[1] : '00');

        message.channel.send("Cronjob gezet voor " + hours + ":" + minutes + " (*!testcron [hours] [minutes]*)");

        // seconds (optional), minutes, hour, day of month, month, day of week (0 = sunday)
        cron.schedule(minutes + " " + moment(hours, 'HH').subtract(2, 'hours').format("HH") + " * * *", () => {
            
            return message.channel.send("---------------------------------\nCron A uitgevoerd\nUitvoer tijd: " + moment(hours, 'HH').subtract(2, 'hours').format("HH") + ":" + minutes + "\nTijd Europe/Amsterdam: " + moment().tz('Europe/Amsterdam').format('HH:mm:ss') + "\nTijd server: " + moment().format('HH:mm:ss') + "\n---------------------------------");
        }
        ,{
            scheduled: true,
            timezone: "Europe/Amsterdam"
        }
        );

        cron.schedule(minutes + " " + moment(hours, 'HH').subtract(1, 'hours').format("HH") + " * * *", () => {
            
            return message.channel.send("---------------------------------\nCron B uitgevoerd\nUitvoer tijd: " + moment(hours, 'HH').subtract(1, 'hours').format("HH") + ":" + minutes + "\nTijd Europe/Amsterdam: " + moment().tz('Europe/Amsterdam').format('HH:mm:ss') + "\nTijd server: " + moment().format('HH:mm:ss') + "\n---------------------------------");
        }
        ,{
            scheduled: true,
            timezone: "Europe/Amsterdam"
        }
        );

        cron.schedule(minutes + " " + hours + " * * *", () => {
            
            return message.channel.send("---------------------------------\nCron C uitgevoerd\nUitvoer tijd: " + hours + ":" + minutes + "\nTijd Europe/Amsterdam: " + moment().tz('Europe/Amsterdam').format('HH:mm:ss') + "\nTijd server: " + moment().format('HH:mm:ss') + "\n---------------------------------");
        }
        ,{
            scheduled: true,
            timezone: "Europe/Amsterdam"
        }
        );

        cron.schedule(minutes + " " + moment(hours, 'HH').add(1, 'hours').format("HH") + " * * *", () => {
            
            return message.channel.send("---------------------------------\nCron D uitgevoerd\nUitvoer tijd: " + moment(hours, 'HH').add(1, 'hours').format("HH") + ":" + minutes + "\nTijd Europe/Amsterdam: " + moment().tz('Europe/Amsterdam').format('HH:mm:ss') + "\nTijd server: " + moment().format('HH:mm:ss') + "\n---------------------------------");
        }
        ,{
            scheduled: true,
            timezone: "Europe/Amsterdam"
        }
        );

        cron.schedule(minutes + " " + moment(hours, 'HH').add(2, 'hours').format("HH") + " * * *", () => {
            
            return message.channel.send("---------------------------------\nCron E uitgevoerd\nUitvoer tijd: " + moment(hours, 'HH').add(2, 'hours').format("HH") + ":" + minutes + "\nTijd Europe/Amsterdam: " + moment().tz('Europe/Amsterdam').format('HH:mm:ss') + "\nTijd server: " + moment().format('HH:mm:ss') + "\n---------------------------------");
        }
        ,{
            scheduled: true,
            timezone: "Europe/Amsterdam"
        }
        );

        /*
        var embed = new discord.MessageEmbed()
            .setTitle(message.author.username + " gaat All-in!")
            .setColor("RANDOM")
            //.setImage("https://discord.turmin.com/allin.jpg");
            .attachFiles(['img/allin.jpg'])
            //.setThumbnail('attachment://allin.jpg')
	        .setImage('attachment://allin.jpg');
        return message.channel.send(embed);
        */
    },
};
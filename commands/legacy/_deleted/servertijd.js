require('dotenv').config();
const { EmbedBuilder } = require("discord.js");
const moment = require("moment");
const tz = require("moment-timezone");
const con = require("../../mysqlcon.js");

module.exports = {
    name: 'servertijd',
    description: 'Show server time',
    execute(message, args) {
        message.delete().catch(console.error);
        
        con.query("SELECT UTC_TIMESTAMP() as timeutc, CURRENT_TIMESTAMP() as timetz", function (err, result) {
            if (err) {
                console.error('Database error:', err);
                return message.channel.send('❌ Er ging iets mis bij het ophalen van de database tijd.');
            }
            
            const embed = new EmbedBuilder()
                .setTitle("🕒 Server Tijd")
                .addFields(
                    {name: "Tijd server:", value: moment().format('DD-MM-YYYY HH:mm:ss'), inline: true},
                    {name: "Tijd server TZ:", value: moment().tz('Europe/Amsterdam').format('DD-MM-YYYY HH:mm:ss'), inline: true},
                    {name: '\u200B', value: '\u200B', inline: false},
                    {name: "Tijd database:", value: moment(result[0].timeutc).format('DD-MM-YYYY HH:mm:ss'), inline: true},
                    {name: "Tijd database TZ:", value: moment(result[0].timetz).format('DD-MM-YYYY HH:mm:ss'), inline: true}
                )
                .setColor("Random")
                .setThumbnail('attachment://sandclock64.png')
                .setFooter({text: "💡 Tip: Probeer ook /servertijd voor de nieuwe slash command!"});
                
            return message.channel.send({
                embeds: [embed],
                files: ['img/sandclock64.png']
            });
        });
    },
};
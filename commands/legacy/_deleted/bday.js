require('dotenv').config();
const { EmbedBuilder } = require("discord.js");
const moment = require("moment");
const con = require("../../mysqlcon.js");
moment.locale('nl');

module.exports = {
    name: 'bday',
    aliases: ['birthday'],
    permissions: 'KickMembers',
    execute(message, args) {
        message.delete().catch(console.error);
        
        if(args[0] === "set") {
            if(message.author.id !== '692352395375542284'){
                return message.reply("Jij mag dit niet\n\n💡 *Tip: Probeer ook \`/bday\` voor de nieuwe slash command!*").then(msg => {
                    msg.delete({ timeout: 10000 }).catch(console.error);
                }).catch(console.error);
            }
            else if(args[1] != null && moment(args[2],['DD-MM-YYYY']).isValid()){ 
                
                var user = message.guild.member(message.mentions.users.first());
                var userID = 0;
                if(user != null) userID = user.id;
                var username = args[1];
                var birthday = moment(args[2],['DD-MM-YYYY']).format("YYYY-MM-DD");
            
                con.query(`SELECT UserID, Username, Birthday FROM birthday WHERE UserID = '${userID}' && UserID != 0`,(err, result) => {
                   if(err) throw err;
                   
                   if(result.length > 0){
                       message.channel.send("Deze gebruiker bestaat al\n\n💡 *Tip: Probeer ook `/bday toevoegen` voor de nieuwe slash command!*").then(msg => {
                            msg.delete({ timeout: 10000 }).catch(console.error);
                        }).catch(console.error);
                   }
                   else {
                        con.query(`INSERT INTO birthday (UserID, Username, Birthday) VALUES ("${userID}", "${username}", "${birthday}")`, function (err, result) {
                            if(err) throw err;
                            message.channel.send(username + " toegevoegd\n\n💡 *Tip: Probeer ook `/bday toevoegen` voor de nieuwe slash command!*").then(msg => {
                                msg.delete({ timeout: 10000 }).catch(console.error);
                            }).catch(console.error);
                        });
                   }
                });
                
            } else {
                message.reply("Typ: !bday set <Naam> <DD-MM-YYYY> <@tag> (Laatste is optioneel)\n\n💡 *Tip: Probeer ook `/bday toevoegen` voor de nieuwe slash command!*").then(msg => {
                    msg.delete({ timeout: 10000 }).catch(console.error);
                }).catch(console.error);
            }
        }
        else {
            con.query("SELECT UserID, Username, Birthday FROM birthday WHERE Active = 1 ORDER BY MONTH(Birthday) ASC,DAY(Birthday) ASC", function (err, result) {
                if (err) throw err;
                if(result.length > 0){
                    var birthdaylist = "";
                    
                    Object.keys(result).forEach(function(key) {
                        var row = result[key];
                        birthdaylist += moment(row.Birthday).format("DD MMM") + " " + row.Username;
                        if(row.UserID > 0) birthdaylist += " <@" + row.UserID + ">";
                        birthdaylist += "\n";
                    });
                    
                    var embed = new EmbedBuilder()
                        .setColor("Random")
                        .addFields({name: 'Birthdays', value: birthdaylist})
                        .setFooter({text: "💡 Tip: Probeer ook /bday voor de nieuwe slash command!"});
                    
                    return message.channel.send({embeds: [embed]});
                } else {
                    return message.channel.send("Geen verjaardagen gevonden\n\n💡 *Tip: Probeer ook `/bday` voor de nieuwe slash command!*");
                }
            });
        }
    }
};
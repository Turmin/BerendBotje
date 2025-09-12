const discord = require("discord.js");
const moment = require("moment");
const con = require("../mysqlcon.js");
moment.locale('nl');

// https://www.youtube.com/watch?v=x8PGidgbP5M
// https://www.tutorialkart.com/nodejs/nodejs-mysql-result-object/

module.exports = {
	name: 'bday',
	aliases: ['birthday'],
	permissions: 'KICK_MEMBERS', // https://discord.js.org/#/docs/main/stable/class/Permissions?scrollTo=s-FLAGS
	execute(message, args) {
	    message.delete();
	    
        if(args[0] === "set") {
            if(message.author.id !== '692352395375542284'){
                message.delete();
                return message.reply("Jij mag dit niet").then(msg => {
                    msg.delete({ timeout: 10000 })
                }).catch(console.error);
            }
            else if(args[1] != null && moment(args[2],['DD-MM-YYYY']).isValid()){ // args[1] != null && 
                
                var user = message.guild.member(message.mentions.users.first());
                var userID = 0;
                if(user != null) userID = user.id;
                var username = args[1];
                var birthday = moment(args[2],['DD-MM-YYYY']).format("YYYY-MM-DD");
            
                con.query(`SELECT UserID, Username, Birthday FROM birthday WHERE UserID = '${userID}' && UserID != 0`,(err, result) => {
                   if(err) throw err;
                   
                   if(result.length > 0){
                       message.channel.send("Deze gebruiker bestaat al").then(msg => {
                            msg.delete({ timeout: 10000 })
                        }).catch(console.error);
                   }
                   else {
                        con.query(`INSERT INTO birthday (UserID, Username, Birthday) VALUES ("${userID}", "${username}", "${birthday}")`, function (err, result) {
                            if(err) throw err;
                            message.channel.send(username + " toegevoegd").then(msg => {
                                msg.delete({ timeout: 10000 })
                            }).catch(console.error);
                        });
                   }
                });
                
            } else {
                message.reply("Typ: !bday set <Naam> <DD-MM-YYYY> <@tag> (Laatste is optioneel)").then(msg => {
                    msg.delete({ timeout: 10000 })
                }).catch(console.error);
            }
            /*
            //return message.channel.send(moment().tz('Europe/Amsterdam').format('DD-MM-YYYY HH:mm'));
            if(moment(args[0],['DD-MM-YYYY']).isValid()){
                var ago = moment(args[0], "DD-MM-YYYY").fromNow();
                var date = moment(args[0], "DD-MM-YYYY").format('LL');
                return message.channel.send(`Datum is ${date} dat is ${ago}`);
            } else {
                return message.reply(`Datum is niet geldig. Geef een datum weer in formaat DD-MM-YYYY`).then(msg => {
                    msg.delete({ timeout: 10000 })
                })
                .catch(console.error);
            }
            */
        }
        else {
            con.query("SELECT UserID, Username, Birthday FROM birthday WHERE Active = 1 ORDER BY MONTH(Birthday) ASC,DAY(Birthday) ASC", function (err, result) {
            //con.query("SELECT UserID, Username, Birthday, DATE(CONCAT_WS('-', YEAR(NOW()), MONTH(Birthday), DAY(Birthday))) newBirthday, IF(DATE_FORMAT(Birthday, "%m-%d") < DATE_FORMAT(NOW(), "%m-%d"), null,null,  FROM birthday ORDER BY newBirthday ASC", function (err, result) {
                if (err) throw err;
                if(result.length > 0){
                    var birthdaylist = "";
                    
                    /*
                    var now = new Date();
                    //var nowMonthDay = [now.getMonth()+1,now.getDate()].join('-');
                    
                    Object.keys(result).forEach(function(key) {
                        var row = result[key];
                        //if(row.newBirthday < now) {
                        if(1 < 2) {
                            result[key]['newBirthday'] = moment(row.newBirthday).add(1, 'Y');
                            console.log('trigger');
                        }
                    });
                    */
                    //console.log(result);
                    
                    Object.keys(result).forEach(function(key) {
                        var row = result[key];
                        birthdaylist += moment(row.Birthday).format("DD MMM") + " " + row.Username;
                        if(row.UserID > 0) birthdaylist += " <@" + row.UserID + ">";
                        birthdaylist += "\n";
                    });
                    
                    var embed = new discord.MessageEmbed()
                        //.setTitle("Birthdays")
                        .setColor("RANDOM")
                        .addField('Birthdays', birthdaylist); // empty space: '\u200b'
                    
                    return message.channel.send(embed);
                }
            });
        }
        //else {
            //return message.reply("Typ: !bday set <Naam> <DD-MM-YYYY> <@tag> (Laatste is optioneel) of !bday list").then(msg => {
            //    msg.delete({ timeout: 10000 })
            //}).catch(console.error);
       // }
	}
};
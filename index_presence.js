const discord = require("discord.js");
const client = new discord.Client();
client.commands = new discord.Collection();
//const fetch = require("node-fetch"); // https://www.npmjs.com/package/node-fetch (Fetch data from URL)
const cron = require("node-cron"); // https://www.npmjs.com/package/node-cron (Using Cronjobs)
const con = require("./mysqlcon.js");
const moment = require("moment"); // https://www.npmjs.com/package/moment (Date Formatting)
const tz = require("moment-timezone");
const fs = require("fs");
const {servername, prefix, token, channelids} = require("./config.json");
const {poohQuotes, activities, slaapliedjes} = require("./quotes.json");
client.login(token);

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require('./commands/' + file);
	console.log(file + ' loaded');
	client.commands.set(command.name, command);
}

function deleteDiscordLink(message) {
    var msg = message.content.trim();
    if (msg.toLowerCase().includes('discord.gg/') || msg.toLowerCase().includes('discordapp.com/invite/')) {
        msgShortened = ((msg.length > 1900) ? msg.slice(0, 1900 - 3) + '...' : msg);
        if (!message.guild) return;
        if (!message.member.hasPermission('MANAGE_MESSAGES')) {
            message.delete()
            .then(message => {
				message.author.send("Hey!\nJouw bericht met een link naar een andere Discord is automatisch verwijderd. Het is in " + servername + " namelijk niet toegestaan om reclame te maken voor een andere Discord. Je kunt de regels altijd nog even nalezen in het welcome-kanaal.\nDenk je dat jouw Discord een echte toevoeging is voor onze leden? Spreek dan even iemand van het Staff- of Moderatorteam aan om te overleggen wat de mogelijkheden zijn.\n\nDe " + servername + " Crew")
                .then(() => {
                    if (message.channel.type === 'dm') return;
                })
                .catch(error => {
                    client.channels.cache.get(channelids.LOGS_MICH).send("DM kon niet worden verstuurd aan " + message.author.tag + " (" + message.author.id + ")\n" + error).catch(console.error);
                    console.error("DM kon niet worden verstuurd aan " + message.author.tag + " (" + message.author.id + ")", error);
                    return;
                });
                
                var embed = new discord.MessageEmbed()
                .setAuthor(message.author.tag + " (" + message.author.id + ")", message.author.avatarURL({size: 4096}))
                .setDescription("Bericht " + message.id + " is verwijdert in <#" + message.channel + ">\n\n" + msgShortened)
                .setTimestamp()
                .setColor("RANDOM");
                
                client.channels.cache.get(channelids.LOGS_MICH).send(embed).catch(console.error);
            })
        }
    }
}

/*
Presence {
  userID: '692352395375542284',
  guild: <ref *1> Guild {
    members: GuildMemberManager {
      cacheType: [class Collection extends Collection],
      cache: [Collection [Map]],
      guild: [Circular *1]
    },
    channels: GuildChannelManager {
      cacheType: [class Collection extends Collection],
      cache: [Collection [Map]],
      guild: [Circular *1]
    },
    roles: RoleManager {
      cacheType: [class Collection extends Collection],
      cache: [Collection [Map]],
      guild: [Circular *1]
    },
    presences: PresenceManager {
      cacheType: [class Collection extends Collection],
      cache: [Collection [Map]]
    },
    voiceStates: VoiceStateManager {
      cacheType: [class Collection extends Collection],
      cache: Collection(0) [Map] {},
      guild: [Circular *1]
    },
    deleted: false,
    available: true,
    id: '724569053989044275',
    shardID: 0,
    name: 'Mich',
    icon: 'b161b4628f3032e26d53b182aa601d50',
    splash: null,
    discoverySplash: null,
    region: 'europe',
    memberCount: 7,
    large: false,
    features: [ 'NEWS', 'COMMUNITY' ],
    applicationID: null,
    afkTimeout: 300,
    afkChannelID: null,
    systemChannelID: '724569054550949891',
    embedEnabled: undefined,
    premiumTier: 0,
    premiumSubscriptionCount: 0,
    verificationLevel: 'MEDIUM',
    explicitContentFilter: 'ALL_MEMBERS',
    mfaLevel: 0,
    joinedTimestamp: 1609982800298,
    defaultMessageNotifications: 'MENTIONS',
    systemChannelFlags: SystemChannelFlags { bitfield: 7 },
    maximumMembers: 250000,
    maximumPresences: null,
    approximateMemberCount: null,
    approximatePresenceCount: null,
    vanityURLCode: null,
    vanityURLUses: null,
    description: 'Test server',
    banner: null,
    rulesChannelID: '871401881333792818',
    publicUpdatesChannelID: '871401881333792819',
    preferredLocale: 'nl',
    ownerID: '692352395375542284',
    emojis: GuildEmojiManager {
      cacheType: [class Collection extends Collection],
      cache: Collection(0) [Map] {},
      guild: [Circular *1]
    }
  },
  status: 'idle',
  activities: [
    Activity {
      name: 'Custom Status',
      type: 'CUSTOM_STATUS',
      url: null,
      details: null,
      state: 'ඞ when the status kinda sus',
      applicationID: null,
      timestamps: null,
      party: null,
      assets: null,
      syncID: undefined,
      flags: [ActivityFlags],
      emoji: null,
      createdTimestamp: 1629888527968
    }
  ],
  clientStatus: { mobile: 'idle' }
}
Presence {
  userID: '692352395375542284',
  guild: <ref *1> Guild {
    members: GuildMemberManager {
      cacheType: [class Collection extends Collection],
      cache: [Collection [Map]],
      guild: [Circular *1]
    },
    channels: GuildChannelManager {
      cacheType: [class Collection extends Collection],
      cache: [Collection [Map]],
      guild: [Circular *1]
    },
    roles: RoleManager {
      cacheType: [class Collection extends Collection],
      cache: [Collection [Map]],
      guild: [Circular *1]
    },
    presences: PresenceManager {
      cacheType: [class Collection extends Collection],
      cache: [Collection [Map]]
    },
    voiceStates: VoiceStateManager {
      cacheType: [class Collection extends Collection],
      cache: Collection(0) [Map] {},
      guild: [Circular *1]
    },
    deleted: false,
    available: true,
    id: '795762672992911390',
    shardID: 0,
    name: 'Friends',
    icon: 'e568b8c3624d2929ff11a89124371a79',
    splash: null,
    discoverySplash: null,
    region: 'europe',
    memberCount: 5,
    large: false,
    features: [],
    applicationID: null,
    afkTimeout: 300,
    afkChannelID: null,
    systemChannelID: '795762672992911392',
    embedEnabled: undefined,
    premiumTier: 0,
    premiumSubscriptionCount: 0,
    verificationLevel: 'NONE',
    explicitContentFilter: 'DISABLED',
    mfaLevel: 0,
    joinedTimestamp: 1609952119734,
    defaultMessageNotifications: 'ALL',
    systemChannelFlags: SystemChannelFlags { bitfield: 0 },
    maximumMembers: 250000,
    maximumPresences: null,
    approximateMemberCount: null,
    approximatePresenceCount: null,
    vanityURLCode: null,
    vanityURLUses: null,
    description: null,
    banner: null,
    rulesChannelID: null,
    publicUpdatesChannelID: null,
    preferredLocale: 'en-US',
    ownerID: '692344575192334356',
    emojis: GuildEmojiManager {
      cacheType: [class Collection extends Collection],
      cache: [Collection [Map]],
      guild: [Circular *1]
    }
  },
  status: 'idle',
  activities: [
    Activity {
      name: 'Custom Status',
      type: 'CUSTOM_STATUS',
      url: null,
      details: null,
      state: 'ඞ when the status kinda sus',
      applicationID: null,
      timestamps: null,
      party: null,
      assets: null,
      syncID: undefined,
      flags: [ActivityFlags],
      emoji: null,
      createdTimestamp: 1629888527968
    }
  ],
  clientStatus: { mobile: 'idle' }
}
*/

client.on("presenceUpdate", (oldPresence, newPresence) => {
    if (!newPresence.activities) return;
    if (newPresence.guild.id != 795762672992911390) return;
    const statusColors = { online:'GREEN', idle:'ORANGE', dnd:'RED', streaming:'PURPLE' };
    var embed = new discord.MessageEmbed();
    newPresence.activities.forEach(activity => {
        /*
        console.log('===========================')
        console.log('User ' + newPresence.user.tag)
        console.log('Status ' + newPresence.status)
        console.log('UserID ' + newPresence.userID)
        console.log('Icon ' + newPresence.guild.icon)
        console.log('Channel ID ' + newPresence.guild.id)
        console.log('Channel Name ' + newPresence.guild.name)
        console.log('Activity name ' + activity.name)
        console.log('Activity type ' + activity.type)     
        console.log('Activity state ' + activity.state)
        console.log('===========================')
        */
        embed.setAuthor(newPresence.user.tag + " (" + newPresence.userID + ")");
        embed.addFields(
            { name: 'Status', value: newPresence.status },
            { name: 'Channel ID', value: newPresence.guild.id },
            { name: 'Activity', value: activity.name },
            { name: 'State', value: activity.state },
        );
        if (activity.type == "STREAMING") {
        	embed.addFields(
                { name: 'Activity url', value: activity.url },
        		{ name: 'Activity details', value: activity.details },
            );
        	embed.setDescription(newPresence.user.tag + " is streaming at " + activity.url);
        };
        embed.setTimestamp();
        embed.setFooter(newPresence.guild.name, newPresence.guild.iconURL({size: 4096}));
        embed.setColor(statusColors[newPresence.status]);
        client.channels.cache.get(channelids.LOGS_MICH).send(embed).catch(console.error);
        // console.log(`${newPresence.user.tag} is streaming at ${activity.url}.`);
    });
});

client.on("messageDelete", messageDelete => {

    if(messageDelete.author.bot) return;

    var embed = new discord.MessageEmbed()
    .setAuthor(messageDelete.author.tag + " (" + messageDelete.author.id + ")", messageDelete.author.avatarURL({size: 4096}))
    .setDescription("Bericht " + messageDelete.id + " is verwijdert in <#" + messageDelete.channel + ">\n\n" + messageDelete.content)
    .setTimestamp()
    .setColor("RANDOM");

    //client.channels.cache.get(channelids.LOGS_MICH).send(embed);

    messageDelete.client.users.cache.get("692352395375542284").send(embed)
        .then(() => {
            if (messageDelete.channel.type === 'dm') return;
        })
        .catch(error => {
            console.error('Could not send DM', error);
        });
});

client.on("messageUpdate", async(oldMessage, newMessage) => {

    if(newMessage.author.bot) return;

    if(oldMessage.content == newMessage.content) return;
    
    deleteDiscordLink(newMessage);

    var embed = new discord.MessageEmbed()
        .setAuthor(newMessage.author.tag + " (" + newMessage.author.id + ")", newMessage.author.avatarURL({size: 4096}))
        .setDescription("Bericht " + newMessage.id + " is bewerkt in <#" + newMessage.channel + ">\n\n**Oud bericht:** " + oldMessage.content + "\n**Nieuw bericht:** " + newMessage.content)
        .setTimestamp()
        .setColor("RANDOM");

    //client.channels.cache.get(channelids.LOGS_MICH).send(embed);

    newMessage.client.users.cache.get("692352395375542284").send(embed)
        .then(() => {
            if (newMessage.channel.type === 'dm') return;
        })
        .catch(error => {
            console.error('Could not send DM', error);
        });
});
function sendBirthday() {
    var now = moment().tz('Europe/Amsterdam').format("HH:mm");
    
    if(now == "00:00") {
        console.log("Birthday check...");
    
        con.query(`SELECT UserID, Username, Birthday, FLOOR(DATEDIFF(CURRENT_DATE(),Birthday)/365) Age, DAY(Birthday) BirthdayDay, MONTH(Birthday) BirthdayMonth FROM birthday WHERE SUBSTRING(Birthday, 6, 5) = SUBSTRING(CURRENT_DATE() + INTERVAL 1 DAY, 6, 5) AND Active = 1`,(err, result) => {
            if(err) throw err;
            if(result.length > 0){
                Object.keys(result).forEach(function(key) {
                    var birthdaylist = "";
                    var row = result[key];

                    birthdaylist += "Gefeliciteerd met je " + row.Age + "e verjaardag " + row.Username;
                    if(row.UserID > 0) birthdaylist += " <@" + row.UserID + ">";
                    birthdaylist += "!\n";


                    var embed = new discord.MessageEmbed()
                        .setTitle("Happy Birthday :partying_face:")
                        .addField("\u200b", birthdaylist)
                        .setFooter(client.user.username, client.user.displayAvatarURL())
                        .setColor("RANDOM")
                    	.attachFiles(['img/balloons64.png'])
            			.setThumbnail('attachment://balloons64.png');


                    console.log("Run Birthday " + moment().tz('Europe/Amsterdam').format('DD-MM-YYYY HH:mm:ss'));

                    client.channels.cache.get(channelids.BIRTHDAYS_FRIENDS).send(embed);
                    //client.channels.cache.get(channelids.ALGEMEEN_MICH).send(embed);
                });
            }
        });
    }
}
setInterval(sendBirthday, 60000);

var activity;

client.on("ready", async () => {
    console.log(client.user.username + " is online.");
    changeActivity();
    function changeActivity(){
        activity = activities[Math.floor(Math.random() * activities.length)];
        
        client.user.setPresence({
            status: "online",  // online, dnd, invisible, idle
            activity: {
                name: activity,
                type: "PLAYING" // PLAYING STREAMING LISTENING WATCHING CUSTOM_STATUS COMPETING
            }
        });
        console.log("Activity changed " + moment().tz('Europe/Amsterdam').format('DD-MM-YYYY HH:mm:ss'));
        setTimeout(changeActivity, 1800000); // 300000 = 5minutes
    }
});

client.on("message", async message =>{

    //const args = message.content.trim.split(/ +/);
    var msg = message.content.trim();
    const args = msg.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();
    const commands = client.commands.get(command) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(command));
    msg = msg.toLowerCase();
    
	deleteDiscordLink(message);
    
    if(message.channel.id === channelids.ALGEMEEN_MICH){
        const eachLine = message['content'].split('\n')
        for(const line of eachLine) {
            if(line.includes('=')) {
                const split = line.split('=')
                const emoji = split[0].trim()
                try {
                	await message.react(emoji)
                } catch (error) {
					//console.error('One of the emojis failed to react:', error);
                }
			}
        }
    }
    
    if(message.author.bot) {
        if(msg.includes("ik ben de mol")){
            return message.channel.send(`Ik wist het ${message.author.username}!`);
        }
        else if(msg.includes("hoi berend")){
            return message.channel.send(`Hey ${message.author.username}!`);
        }
        return;
    }
    
    if(message.mentions.has(client.user)) {
        if(msg.includes("hallo") || msg.includes("hoi") || msg.includes("hey")){
			return message.channel.send(`Hallo ${message.author.username}!`);
		}
		else if(msg.startsWith("welteruste") || msg.startsWith("truste") || (msg.startsWith("slaap") && msg.includes("lekker"))){
            return message.channel.send(`Slaap lekker ${message.author.username}!`);
        }
        else if(msg.startsWith("dag") || msg.startsWith("doei") || msg.startsWith("tot ziens")){
            return message.channel.send(`Fijne dag ${message.author.username}! Tot de volgende keer!`);
        }
        else if(msg.startsWith("goedemorg") || msg.startsWith("morning")){
            return message.channel.send(`Goedemorgen ${message.author.username}! :coffee:`)
        }
    }
    /*
    if(msg.includes("hoe is") || msg.includes("hoe gaat")) {
        return message.channel.send(`Met mij gaat alles goed hoor! :relaxed: En met jou ${message.author.username}?`).then(async msg =>{
            
            /*
            var emoji = await promptMessage(msg, message.author, 30, ["✅", "❌"]);
            
            if(emoji === "✅"){
                
                msg.delete();
                
                message.channel.send("Yes!");
            } else if(emoji === "❌"){
                
                msg.delete();
                
                message.reply("Jammer").then(m => m.delete({timeout: 5000}));
            }
            */
            /*
            message.channel.awaitMessages(m => m.author.id === message.author.id, {max: 1, time: 30000, errors: ['time']}).then(collected =>{
                    var c = collected.first().content.toLowerCase();
                    if(c.includes("goed") || c.includes("ja") || c.includes("prima") || c.includes("best") || c.includes("uitstekend")) {
                        return message.channel.send(`Mooi zo :relaxed:`);
                    }
                    else {
                        return message.channel.send(`Niet zo goed? :worried:`).then(async msg =>{
                        
                            message.channel.awaitMessages(m => m.author.id === message.author.id, {max: 1, time: 30000, errors: ['time']}).then(collected =>{
                                var c = collected.first().content.toLowerCase();
                                if(c.includes("nee") || c.includes("nope") || c.includes("idd") || c.includes("inderdaad") || c.includes("klopt")) {
                                    return message.channel.send(`Oh jeej! Hopelijk gaat het snel weer beter! :hugging:`);
                                } else {
                                    return message.channel.send(`Dat antwoord begrijp ik nog niet.`);
                                }
                            });
                        });
                    }
            }).catch(collected => message.channel.send(`Ik heb geen antwoord gekregen ${message.author.username} :worried:`));
        });
    }
    else
    */
    if(command ===  "quote"){
        return message.channel.send(`${activity}`);
    }
    else if(msg.includes("berend")){
        return message.channel.send("Dat ben ik! :blush:")
    }
    else if(msg.includes("slaapliedje")){
        var slaapliedje = slaapliedjes[Math.floor(Math.random() * slaapliedjes.length)];
        return message.channel.send(`*${slaapliedje}*`);
    }
    else if(msg.includes("pooh") || msg.includes("poeh beer") || msg.includes("poeh bear")){
        var quote = poohQuotes[Math.floor(Math.random() * poohQuotes.length)];
        return message.channel.send(`**“${quote}”** *- Silly Old Bear :bear::honey_pot:*`);
    }
    else if(msg.includes("lol")){
        return message.channel.send(`Ik vind het ook erg grappig! :grin:`);
    }
    else if(msg.includes("tempa") || msg.includes("temptation")){
        return message.channel.send(`Gaat het nou alweer over tempa? :tired_face:`);
    }
    //else if(msg.includes("de mol")){
    //    return message.channel.send("Rusty is de mol! :face_with_hand_over_mouth:")
    //}
    /*
    else if(msg.startsWith("test")){
        //message.react('bla bla');
        return message.channel.send(`blablabla`)
        .then(function (message) {
              message.react("👍")
              message.react("👎")
              //message.pin()
              //message.delete()
            }).catch(function() {
              //Something
             });
    }
    */
    
    if(message.channel.type == "dm") {
        if(!message.author.bot) return message.author.send("Sorry " + message.author.username + ", ik houd niet van privégesprekken :flushed:");
    }
    if(message.author.id === client.user.id) return;
    if(!msg.startsWith(prefix) || message.author.bot) return;
	if (!commands) return;
	
    if(commands.permissions){
 	    const authorPerms = message.channel.permissionsFor(message.author);
 	    if(!authorPerms || !authorPerms.has(commands.permissions)){
            return message.reply('Je hebt niet de juiste permissies om dit command te kunnen gebruiken').then(msg => {
                msg.delete({ timeout: 20000 })
            }).catch(console.error);
        }
    }
    
    try {
		commands.execute(message, args);
	} catch (error) {
		console.error(error);
		return message.reply('there was an error trying to execute that command!');
	}
});

async function promptMessage(message, author, time, reactions){
    time *= 1000;
    
    for(const reaction of reactions){
        await message.react(reaction);
    }
    
    var filter = (reaction, user) => reactions.includes(reaction.emoji.name) && user.id === author.id;
    
    return message.awaitReactions(filter, {max:1, time: time}).then(collected => collected.first() && collected.first().emoji.name);
}
console.log('Node.js versie:', process.version);
console.log('Discord.js versie:', require('discord.js').version);

// Load environment variables FIRST
require('dotenv').config();

const { Client, GatewayIntentBits, Collection, EmbedBuilder, REST, Routes } = require('discord.js');
const cron = require("node-cron");
const con = require("./mysqlcon.js");
const moment = require("moment");
const tz = require("moment-timezone");
const fs = require("fs");

// Client met intents
const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.DirectMessages
    ]
});

// Collections voor commands
client.commands = new Collection();
client.slashCommands = new Collection();

// Config object
const config = {
    token: process.env.DISCORD_TOKEN,
    clientId: process.env.DISCORD_CLIENT_ID, // Voeg toe aan je .env
    guildId: process.env.DISCORD_GUILD_ID,   // Voeg toe aan je .env (optioneel, voor guild-specific commands)
    prefix: process.env.DISCORD_PREFIX || '!',
    servername: process.env.SERVER_NAME || 'Friends',
    channelids: {
        AREA51_FRIENDS: process.env.CHANNEL_AREA51_FRIENDS,
        BOTTESTKANAAL_FRIENDS: process.env.CHANNEL_BOTTESTKANAAL_FRIENDS,
        BIRTHDAYS_FRIENDS: process.env.CHANNEL_BIRTHDAYS_FRIENDS,
        ALGEMEEN_MICH: process.env.CHANNEL_ALGEMEEN_MICH,
        LOGS_MICH: process.env.CHANNEL_LOGS_MICH,
        TEST_MICH: process.env.CHANNEL_TEST_MICH,
        RULES_MICH: process.env.CHANNEL_RULES_MICH
    },
    roles: {
        Mute: process.env.ROLE_MUTE,
        Lid: process.env.ROLE_LID
    },
    database: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        timezone: process.env.DB_TIMEZONE || 'Z'
    }
};

// Quotes en activities
const {poohQuotes, activities, slaapliedjes} = require("./quotes.json");

// Validatie
if (!config.token) {
    console.error('❌ DISCORD_TOKEN not found in environment variables!');
    process.exit(1);
}

console.log('✅ Config loaded successfully');

// Load commands (oude prefix commands - tijdelijk)
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    console.log(`${file} loaded`);
    client.commands.set(command.name, command);
}

// Slash Commands registratie
const slashCommands = [
    {
        name: 'ping',
        description: 'Test de server response tijd'
    },
    {
        name: 'serverinfo',
        description: 'Toon server informatie'
    },
    {
        name: 'help',
        description: 'Toon alle beschikbare commands'
    },
    {
        name: 'quote',
        description: 'Random inspirational quote'
    }
];

// Register slash commands
async function registerSlashCommands() {
    try {
        console.log('Started refreshing application (/) commands.');
        
        const rest = new REST().setToken(config.token);
        
        if (config.guildId) {
            // Guild-specific commands (sneller voor development)
            await rest.put(
                Routes.applicationGuildCommands(config.clientId, config.guildId),
                { body: slashCommands }
            );
        } else {
            // Global commands (langzamer, maar voor alle servers)
            await rest.put(
                Routes.applicationCommands(config.clientId),
                { body: slashCommands }
            );
        }
        
        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error('Error registering slash commands:', error);
    }
}

// Discord link deletion function
function deleteDiscordLink(message) {
    var msg = message.content.trim();
    if (msg.toLowerCase().includes('discord.gg/') || msg.toLowerCase().includes('discordapp.com/invite/')) {
        const msgShortened = ((msg.length > 1900) ? msg.slice(0, 1900 - 3) + '...' : msg);
        if (!message.guild) return;
        if (!message.member.permissions.has('ManageMessages')) {
            message.delete()
            .then(() => {
                message.author.send(`Hey!\nJouw bericht met een link naar een andere Discord is automatisch verwijderd. Het is in ${config.servername} namelijk niet toegestaan om reclame te maken voor een andere Discord. Je kunt de regels altijd nog even nalezen in het welcome-kanaal.\nDenk je dat jouw Discord een echte toevoeging is voor onze leden? Spreek dan even iemand van het Staff- of Moderatorteam aan om te overleggen wat de mogelijkheden zijn.\n\nDe ${config.servername} Crew`)
                .catch(error => {
                    if (config.channelids.LOGS_MICH) {
                        client.channels.cache.get(config.channelids.LOGS_MICH).send(`DM kon niet worden verstuurd aan ${message.author.tag} (${message.author.id})\n${error}`).catch(console.error);
                    }
                    console.error(`DM kon niet worden verstuurd aan ${message.author.tag} (${message.author.id})`, error);
                });
                
                const embed = new EmbedBuilder()
                .setAuthor({name: `${message.author.tag} (${message.author.id})`, iconURL: message.author.displayAvatarURL({size: 4096})})
                .setDescription(`Bericht ${message.id} is verwijderd in <#${message.channel.id}>\n\n${msgShortened}`)
                .setTimestamp()
                .setColor('Random');
                
                if (config.channelids.LOGS_MICH) {
                    client.channels.cache.get(config.channelids.LOGS_MICH).send({embeds: [embed]}).catch(console.error);
                }
            });
        }
    }
}

// Presence update handler
client.on("presenceUpdate", (oldPresence, newPresence) => {
    if (!newPresence.activities) return;
    if (newPresence.guild.id != '795762672992911390') return;
    
    newPresence.activities.forEach(activity => {
        if (activity.type == "Streaming") {
            console.log('Streaming detected:', newPresence.user.tag);
            
            const embed = new EmbedBuilder()
                .setAuthor({name: `${newPresence.user.username} is nu live! 📹`, iconURL: newPresence.user.displayAvatarURL()})
                .setTitle(activity.details ? activity.details : '\u200B')
                .setURL(activity.url)
                .addFields({name: 'Speelt 🎮', value: activity.state ? `[${activity.state}](https://www.twitch.tv/directory/game/${encodeURIComponent(activity.state)})` : '[Just Chatting](https://www.twitch.tv/directory/game/Just%20Chatting)'})
                .setThumbnail(newPresence.user.displayAvatarURL())
                .setTimestamp()
                .setFooter({text: newPresence.guild.name, iconURL: newPresence.guild.iconURL({size: 4096})})
                .setColor('Purple');
                
            if (config.channelids.AREA51_FRIENDS) {
                client.channels.cache.get(config.channelids.AREA51_FRIENDS).send({content: '@everyone', embeds: [embed]}).catch(console.error);
            }
        }
    });
});

// Message delete handler
client.on("messageDelete", messageDelete => {
    if(messageDelete.author?.bot) return;

    const embed = new EmbedBuilder()
    .setAuthor({name: `${messageDelete.author.tag} (${messageDelete.author.id})`, iconURL: messageDelete.author.displayAvatarURL({size: 4096})})
    .setDescription(`Bericht ${messageDelete.id} is verwijderd in <#${messageDelete.channel.id}>\n\n${messageDelete.content}`)
    .setTimestamp()
    .setColor('Random');

    messageDelete.client.users.cache.get("692352395375542284")?.send({embeds: [embed]})
        .catch(error => {
            console.error('Could not send DM', error);
        });
});

// Message update handler
client.on("messageUpdate", async(oldMessage, newMessage) => {
    if(newMessage.author?.bot) return;
    if(oldMessage.content == newMessage.content) return;
    
    deleteDiscordLink(newMessage);

    const embed = new EmbedBuilder()
        .setAuthor({name: `${newMessage.author.tag} (${newMessage.author.id})`, iconURL: newMessage.author.displayAvatarURL({size: 4096})})
        .setDescription(`Bericht ${newMessage.id} is bewerkt in <#${newMessage.channel.id}>\n\n**Oud bericht:** ${oldMessage.content}\n**Nieuw bericht:** ${newMessage.content}`)
        .setTimestamp()
        .setColor('Random');

    newMessage.client.users.cache.get("692352395375542284")?.send({embeds: [embed]})
        .catch(error => {
            console.error('Could not send DM', error);
        });
});

// Birthday function
function sendBirthday() {
    const TimeZone = 'Europe/Amsterdam';
    const now = moment().tz(TimeZone).format("HH:mm");
    
    if(now == "02:00") {
        console.log("Birthday check...");
    
        con.query(`SELECT UserID, Username, Birthday, FLOOR(DATEDIFF(CURRENT_DATE(),Birthday)/365) Age, DAY(Birthday) BirthdayDay, MONTH(Birthday) BirthdayMonth FROM birthday WHERE SUBSTRING(Birthday, 6, 5) = SUBSTRING(CURRENT_DATE(), 6, 5) AND Active = 1`,(err, result) => {
            if(err) throw err;
            if(result.length > 0){
                Object.keys(result).forEach(function(key) {
                    const row = result[key];
                    let birthdaylist = `Gefeliciteerd met je ${row.Age}e verjaardag ${row.Username}`;
                    if(row.UserID > 0) birthdaylist += ` <@${row.UserID}>`;
                    birthdaylist += "!\n";

                    const embed = new EmbedBuilder()
                        .setTitle("Happy Birthday :partying_face:")
                        .addFields({name: '\u200b', value: birthdaylist})
                        .setFooter({text: client.user.username, iconURL: client.user.displayAvatarURL()})
                        .setColor('Random')
                        .setThumbnail('attachment://balloons64.png');

                    console.log("Run Birthday " + moment().tz('Europe/Amsterdam').format('DD-MM-YYYY HH:mm:ss'));

                    if (config.channelids.BIRTHDAYS_FRIENDS) {
                        client.channels.cache.get(config.channelids.BIRTHDAYS_FRIENDS).send({embeds: [embed], files: ['img/balloons64.png']});
                    }
                });
            }
        });
    }
}
setInterval(sendBirthday, 60000);

// Activity changer
let activity;
function changeActivity(){
    activity = activities[Math.floor(Math.random() * activities.length)];
    
    client.user.setPresence({
        status: "online",
        activities: [{
            name: activity,
            type: 0 // PLAYING
        }]
    });
    console.log("Activity changed " + moment().tz('Europe/Amsterdam').format('DD-MM-YYYY HH:mm:ss'));
    setTimeout(changeActivity, 1800000); // 30 minutes
}

// Ready event
client.on("clientReady", async () => {
    console.log(`${client.user.username} is online!`);
    
    // Register slash commands
    if (config.clientId) {
        await registerSlashCommands();
    } else {
        console.warn('⚠️ CLIENT_ID not set, skipping slash command registration');
    }
    
    changeActivity();
});

// Slash command handler
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const { commandName } = interaction;

    try {
        switch(commandName) {
            case 'ping':
                await interaction.reply(`Pong! ${Date.now() - interaction.createdTimestamp}ms`);
                break;
                
            case 'serverinfo':
                const guild = interaction.guild;
                const memberCount = guild.memberCount;
                const bots = guild.members.cache.filter(m => m.user.bot).size;
                const peoples = memberCount - bots;
                const online = guild.members.cache.filter(m => ['online', 'dnd', 'idle'].includes(m.presence?.status)).size;
                
                const embed = new EmbedBuilder()
                    .setTitle("Server Info")
                    .setThumbnail(guild.iconURL())
                    .setDescription(`${guild.name}'s information`)
                    .addFields(
                        {name: "Owner", value: `<@${guild.ownerId}>`, inline: true},
                        {name: "Member Count", value: memberCount.toString(), inline: true},
                        {name: "Peoples", value: peoples.toString(), inline: true},
                        {name: "Bots", value: bots.toString(), inline: true},
                        {name: "Online", value: online.toString(), inline: true},
                        {name: "Emoji Count", value: `${guild.emojis.cache.size} emojis`, inline: true},
                        {name: "Roles Count", value: `${guild.roles.cache.size} roles`, inline: true},
                        {name: "Created", value: moment(guild.createdAt).format("DD-MM-YYYY HH:mm"), inline: true},
                        {name: "ID", value: guild.id, inline: true}
                    )
                    .setColor('Random');
                    
                await interaction.reply({embeds: [embed]});
                break;
                
            case 'help':
                const helpEmbed = new EmbedBuilder()
                    .setTitle("Help - Slash Commands")
                    .setDescription("Beschikbare slash commands:")
                    .addFields(
                        {name: "/ping", value: "Test de server response tijd"},
                        {name: "/serverinfo", value: "Toon server informatie"},  
                        {name: "/help", value: "Toon deze help"},
                        {name: "/quote", value: "Random inspirational quote"}
                    )
                    .setThumbnail(client.user.displayAvatarURL())
                    .setFooter({text: interaction.guild.name, iconURL: interaction.guild.iconURL()})
                    .setColor('Random');
                    
                await interaction.reply({embeds: [helpEmbed]});
                break;
                
            case 'quote':
                await interaction.reply(`**"${activity}"**`);
                break;
                
            default:
                await interaction.reply('Deze command is nog niet geïmplementeerd!');
        }
    } catch (error) {
        console.error('Slash command error:', error);
        const errorReply = 'Er is een fout opgetreden bij het uitvoeren van deze command!';
        
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp(errorReply);
        } else {
            await interaction.reply(errorReply);
        }
    }
});

// Legacy message handler (tijdelijk voor oude commands)
client.on("messageCreate", async message => {
    if(message.author.bot) return;
    
    const msg = message.content.trim().toLowerCase();
    deleteDiscordLink(message);
    
    // Auto react voor polls
    if(message.channel.id === config.channelids.ALGEMEEN_MICH){
        const eachLine = message.content.split('\n');
        for(const line of eachLine) {
            if(line.includes('=')) {
                const split = line.split('=');
                const emoji = split[0].trim();
                try {
                    await message.react(emoji);
                } catch (error) {
                    // Emoji failed
                }
            }
        }
    }
    
    // Bot mentions
    if(message.mentions.has(client.user)) {
        if(msg.includes("hallo") || msg.includes("hoi") || msg.includes("hey")){
            return message.channel.send(`Hallo ${message.author.username}! :wave:`);
        }
        // ... andere mentions
    }
    
    // Legacy prefix commands (tijdelijk)
    if(!msg.startsWith(config.prefix)) return;
    
    const args = msg.slice(config.prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();
    const commands = client.commands.get(command) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(command));
    
    if (!commands) return;
    
    // Permission check
    if(commands.permissions){
        const authorPerms = message.channel.permissionsFor(message.author);
        if(!authorPerms || !authorPerms.has(commands.permissions)){
            return message.reply('Je hebt niet de juiste permissies om dit command te kunnen gebruiken').then(msg => {
                setTimeout(() => msg.delete().catch(console.error), 20000);
            }).catch(console.error);
        }
    }
    
    try {
        commands.execute(message, args);
    } catch (error) {
        console.error(error);
        return message.reply('Er is een fout opgetreden bij het uitvoeren van die command!');
    }
});

// Login
client.login(config.token);
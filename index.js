console.log('Node.js versie:', process.version);
console.log('Discord.js versie:', require('discord.js').version);

// Load environment variables FIRST
require('dotenv').config();

const { Client, GatewayIntentBits, Collection, EmbedBuilder, REST, Routes, SlashCommandBuilder } = require('discord.js');
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
    clientId: process.env.DISCORD_CLIENT_ID,
    guildId: process.env.DISCORD_GUILD_ID,
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

// Load slash commands dynamically
const slashCommandsArray = [];

// Check if slash commands directory exists
if (fs.existsSync('./commands/slash')) {
    const slashCommandFiles = fs.readdirSync('./commands/slash').filter(file => file.endsWith('.js'));

    for (const file of slashCommandFiles) {
        try {
            const command = require(`./commands/slash/${file}`);
            console.log(`✅ Slash command ${file} loaded`);
            client.slashCommands.set(command.data.name, command);
            slashCommandsArray.push(command.data.toJSON());
        } catch (error) {
            console.error(`❌ Error loading slash command ${file}:`, error.message);
        }
    }
} else {
    console.warn('⚠️ ./commands/slash directory not found');
}

// Load legacy prefix commands (tijdelijk)
if (fs.existsSync('./commands/legacy')) {
    const commandFiles = fs.readdirSync('./commands/legacy').filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        try {
            const command = require(`./commands/legacy/${file}`);
            console.log(`📄 Legacy command ${file} loaded`);
            client.commands.set(command.name, command);
        } catch (error) {
            console.error(`❌ Error loading legacy command ${file}:`, error.message);
        }
    }
}

console.log(`📊 Loaded ${client.slashCommands.size} slash commands and ${client.commands.size} legacy commands`);

// Register slash commands
async function registerSlashCommands() {
    if (slashCommandsArray.length === 0) {
        console.warn('⚠️ No slash commands to register');
        return;
    }

    try {
        console.log(`🔄 Started refreshing ${slashCommandsArray.length} application (/) commands.`);
        
        const rest = new REST().setToken(config.token);
        
        if (config.guildId) {
            // Guild-specific commands (sneller voor development)
            await rest.put(
                Routes.applicationGuildCommands(config.clientId, config.guildId),
                { body: slashCommandsArray }
            );
            console.log(`✅ Successfully reloaded ${slashCommandsArray.length} guild (/) commands.`);
        } else {
            // Global commands (langzamer, maar voor alle servers)
            await rest.put(
                Routes.applicationCommands(config.clientId),
                { body: slashCommandsArray }
            );
            console.log(`✅ Successfully reloaded ${slashCommandsArray.length} global (/) commands.`);
        }
        
    } catch (error) {
        console.error('❌ Error registering slash commands:', error);
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

// Slash command handler - NIEUWE VERSIE
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.slashCommands.get(interaction.commandName);

    if (!command) {
        console.error(`❌ No command matching ${interaction.commandName} was found.`);
        await interaction.reply({
            content: 'Deze command bestaat niet of is niet geladen!',
            ephemeral: true
        });
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(`❌ Error executing slash command ${interaction.commandName}:`, error);
        const errorReply = 'Er is een fout opgetreden bij het uitvoeren van deze command!';
        
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: errorReply, ephemeral: true });
        } else {
            await interaction.reply({ content: errorReply, ephemeral: true });
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
        else if(msg.includes("welterusten") || msg.includes("truste") || (msg.includes("slaap") && msg.includes("lekker"))){
            return message.channel.send(`Slaap lekker ${message.author.username}! :sleeping_accommodation:`);
        }
        else if(msg.includes("dag") || msg.includes("doei") || msg.includes("tot ziens")){
            return message.channel.send(`Fijne dag ${message.author.username}! Tot de volgende keer! :wave:`);
        }
        else if(msg.includes("goedemorg") || msg.includes("morning")){
            return message.channel.send(`Goedemorgen ${message.author.username}! :coffee:`);
        }
    }
    
    // Word triggers (zonder mention)
    if(msg.includes("pedro") && !msg.startsWith(config.prefix + "pedro")) {
        return message.channel.send({ files: ["./img/pedro.gif"] });
    }
    else if(msg.includes("berend")){
        return message.channel.send("Dat ben ik! :blush:");
    }
    else if(msg.includes("hallo") || msg.includes("hoi") || msg.includes("hey") || msg.includes("hai")){
        return message.channel.send(`Hey ${message.author.username}! :wave:`);
    }
    else if(msg.includes("slaapliedje")){
        const slaapliedje = slaapliedjes[Math.floor(Math.random() * slaapliedjes.length)];
        return message.channel.send(`*${slaapliedje}*`);
    }
    else if(msg.includes("pooh") || msg.includes("poeh")){
        const quote = poohQuotes[Math.floor(Math.random() * poohQuotes.length)];
        const embed = new EmbedBuilder()
            .setDescription(`**${quote}**`)
            .setColor('Random')
            .setThumbnail('attachment://pooh.png')
            .setFooter({text: "Silly Old Bear 🐻🍯"});
        return message.channel.send({embeds: [embed], files: ['./img/pooh.png']}).catch(err => {
            console.log(err);
        });
    }
    else if(msg.includes("lol")){
        return message.channel.send(`Ik vind het ook erg grappig! :grin:`);
    }
    else if(msg.includes("tempa") || msg.includes("temptation")){
        return message.channel.send(`Gaat het nou alweer over temptation island? :tired_face:`);
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
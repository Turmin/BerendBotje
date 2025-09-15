require('dotenv').config();
const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: 'idea',
    aliases: ['idee'],
    execute(message, args) {
        const content = args.join(" ");

        // Channel restrictions using environment variables
        const allowedChannels = [
            process.env.CHANNEL_BOTTESTKANAAL_FRIENDS,
            process.env.CHANNEL_TEST_MICH,
            process.env.CHANNEL_ALGEMEEN_MICH
        ].filter(Boolean); // Remove undefined values

        if (allowedChannels.length > 0 && !allowedChannels.includes(message.channel.id)) {
            return message.reply("Je mag dit niet in dit kanaal plaatsen.\n\n💡 *Tip: Deze functie wordt binnenkort vervangen door een moderne slash command!*").then(msg => {
                msg.delete({ timeout: 5000}).catch(console.error);
            }).catch(console.error);
        }
        
        if(content == "") return message.reply("Je hebt geen bericht meegegeven.\n\n💡 *Tip: Deze functie wordt binnenkort vervangen door een moderne slash command!*");
        
        var embed = new EmbedBuilder()
            .setAuthor({name: message.member.displayName, iconURL: message.author.displayAvatarURL({ dynamic: true })})
            .setDescription(content)
            .addFields({name: "Status", value: "📊 Stemronde"})
            .setColor("#fa9600")
            .setFooter({text: "💡 Tip: Deze functie wordt binnenkort vervangen door een moderne slash command!"});
        
        const targetChannelId = process.env.CHANNEL_ALGEMEEN_MICH;
        const targetChannel = message.client.channels.cache.get(targetChannelId);
        
        if(targetChannel) {
            return targetChannel.send({embeds: [embed]}).then(async e => {
                await e.react('✅').catch(console.error);
                await e.react('❌').catch(console.error);
                return message.channel.send("Bedankt, " + message.author.username + "! Je idee is geplaatst in <#" + targetChannelId + ">!");
            }).catch(err => {
                console.log(err);
                return message.channel.send("Het is niet gelukt het bericht te verzenden");
            });
        } else {
            return message.channel.send("Het is niet gelukt het bericht te verzenden");
        }
    },
};
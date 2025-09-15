const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: 'giveaway',
    permissions: 'ManageMessages',
    execute(message, args) {
        const content = args.join(" ");
        if(content == "") {
            return message.reply("Je hebt geen bericht meegegeven.\n\n💡 *Note: Dit is een legacy giveaway command - moderne bots hebben uitgebreidere giveaway functionaliteit.*");
        }
        
        const embed = new EmbedBuilder()
            .setTitle("🎉 Giveaway!")
            .setDescription(content)
            .addFields(
                {name: "📋 Hoe meedoen?", value: "React met 🎉 om mee te doen!", inline: false},
                {name: "⏰ Status", value: "Actief", inline: true},
                {name: "👤 Gestart door", value: message.author.username, inline: true}
            )
            .setColor("Gold")
            .setFooter({text: "💡 Note: Legacy giveaway - moderne bots hebben timer en automatische winner selection"})
            .setTimestamp();
        
        message.channel.send({embeds: [embed]}).then(async giveawayMsg => {
            await giveawayMsg.react('🎉').catch(console.error);
            
            message.channel.send(`✅ Giveaway gestart! Gebruikers kunnen reageren met 🎉\n\n💡 *Note: Dit is een legacy giveaway command zonder automatische winner selection.*`).then(confirmMsg => {
                setTimeout(() => confirmMsg.delete().catch(console.error), 10000);
            });
        }).catch(error => {
            console.error('Giveaway creation error:', error);
            message.reply('❌ Er is een fout opgetreden bij het maken van de giveaway.');
        });
        
        message.delete().catch(console.error);
    },
};
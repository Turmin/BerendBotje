require('dotenv').config();
const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: 'kroket',
    description: 'Legacy kroket command',
    execute(message, args) {
        message.delete().catch(console.error);
        
        const embed = new EmbedBuilder()
            .setTitle("🥖 Kroket")
            .addFields({name: "Airfryer XL", value: "11 minuten op 200°C"})
            .setColor('Random')
            .setImage('attachment://broodje-kroket.png')
            .setFooter({text: "💡 Tip: Gebruik /kroket voor de nieuwe slash command!"});
            
        return message.channel.send({
            embeds: [embed],
            files: ['img/broodje-kroket.png']
        });
    },
};
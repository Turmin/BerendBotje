require('dotenv').config();
const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: 'help',
    description: 'Legacy help command',
    execute(message, args) {
        const embed = new EmbedBuilder()
            .setTitle("📋 Help - Bot Commands")
            .setDescription("🔥 **Nieuwe Slash Commands beschikbaar!**\n\nType `/help` voor de moderne command lijst.")
            .setColor("Blue")
            .addFields(
                {name: "🆕 Moderne Commands", value: "Type `/` om alle nieuwe slash commands te zien!\n• `/ping` - Response tijd\n• `/cat` - Random katje\n• `/pokemon [naam]` - Pokémon info\n• `/help` - Volledige command lijst", inline: false},
                {name: "📱 Voordelen Slash Commands", value: "• Autocomplete ondersteuning\n• Parameter validatie\n• Betere gebruikerservaring\n• Type hints en beschrijvingen", inline: false},
                {name: "⚠️ Legacy Commands", value: "Deze `!` commands blijven tijdelijk werken voor een soepele overgang, maar gebruik de nieuwe `/` commands!", inline: false},
                {name: "🔄 Enkele Legacy Commands", value: "`!ping` `!cat` `!dog` `!kroket` `!pokemon` `!serverinfo`", inline: false}
            )
            .setThumbnail(message.client.user.displayAvatarURL())
            .setFooter({text: `${message.guild.name} • Gebruik /help voor de volledige lijst`, iconURL: message.guild.iconURL()});
        
        message.channel.send({embeds: [embed]});
        message.delete().catch(console.error);
    },
};
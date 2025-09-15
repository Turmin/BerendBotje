const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: 'userinfo',
    description: 'Show user information',
    execute(message, args) {
        // Get target user (mentioned user, user by ID, or message author)
        let targetUser;
        if (message.mentions.users.first()) {
            targetUser = message.mentions.users.first();
        } else if (args[0] && !isNaN(args[0])) {
            targetUser = message.client.users.cache.get(args[0]);
        } else {
            targetUser = message.author;
        }
        
        if (!targetUser) {
            return message.reply("Gebruiker niet gevonden\n\n💡 *Note: Dit is een legacy command.*");
        }
        
        const member = message.guild.members.cache.get(targetUser.id);
        const nickname = member ? member.nickname : null;
        const displayName = nickname || targetUser.username;
        
        const embed = new EmbedBuilder()
            .setTitle("👤 User Info")
            .setThumbnail(targetUser.displayAvatarURL({size: 256}))
            .addFields(
                {name: "Username", value: targetUser.username, inline: true},
                {name: "Display Name", value: displayName, inline: true},
                {name: "User ID", value: targetUser.id, inline: true},
                {name: "Account Created", value: targetUser.createdAt.toLocaleDateString(), inline: true}
            )
            .setColor("Random")
            .setFooter({text: "💡 Note: Dit is een legacy command - moderne bots hebben uitgebreidere user info commands"});
        
        if (member) {
            embed.addFields(
                {name: "Joined Server", value: member.joinedAt ? member.joinedAt.toLocaleDateString() : "Unknown", inline: true},
                {name: "Roles", value: member.roles.cache.size > 1 ? member.roles.cache.filter(r => r.name !== '@everyone').map(r => r.name).slice(0, 5).join(', ') : "No roles", inline: false}
            );
        }
        
        message.channel.send({embeds: [embed]});
    },
};
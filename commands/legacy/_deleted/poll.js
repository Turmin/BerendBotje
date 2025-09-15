require('dotenv').config();

module.exports = {
    name: 'poll', 
    description: 'Create a poll with emoji reactions',
    execute(message, args) {
        // This command was designed to work with specific channels
        const allowedChannels = [process.env.CHANNEL_ALGEMEEN_MICH].filter(Boolean);
        
        if (allowedChannels.length > 0 && !allowedChannels.includes(message.channel.id)) {
            return message.reply("Dit commando werkt alleen in specifieke kanalen.\n\n💡 *Note: Legacy poll functie - moderne bots hebben poll slash commands.*");
        }
        
        console.log("Legacy poll command triggered");
        
        const { content } = message;
        const eachLine = content.split('\n');
        
        let reactionsAdded = 0;
        
        for(const line of eachLine) {
            if(line.includes('=')) {
                const split = line.split('=');
                const emoji = split[0].trim();
                
                message.react(emoji).then(() => {
                    reactionsAdded++;
                }).catch(error => {
                    console.error(`Failed to react with ${emoji}:`, error);
                });
            }
        }
        
        if (reactionsAdded === 0) {
            message.channel.send(
                `📊 **Poll Instructies:**\n` +
                `Gebruik het formaat:\n` +
                `\`\`\`\n` +
                `🍕 = Pizza\n` +
                `🍔 = Burger\n` +
                `🌮 = Taco\n` +
                `\`\`\`\n` +
                `💡 *Note: Dit is een legacy poll functie - moderne bots hebben betere poll commands.*`
            ).then(helpMsg => {
                setTimeout(() => helpMsg.delete().catch(console.error), 15000);
            });
        }
    },
};
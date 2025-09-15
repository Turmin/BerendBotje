const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: 'page',
    description: 'Paginated embed example',
    execute(message, args) {
        let pages = [
            'Page one - Dit is de eerste pagina',
            'Second page - Dit is de tweede pagina', 
            'Third page - Dit is de derde pagina',
            'You can add pages - Je kunt meer pagina\'s toevoegen',
            'All you need to do is add another item in the array',
            '**Supports markdown and regular chat description properties**',
            '💡 *Note: Deze legacy functie kan vervangen worden door moderne slash commands met buttons!*'
        ];
        let page = 1;
        
        const embed = new EmbedBuilder()
            .setColor('Red')
            .setFooter({text: `Page ${page} of ${pages.length} | 💡 Tip: Moderne bots gebruiken buttons in plaats van reactions!`})
            .setDescription(pages[page-1]);
            
        message.channel.send({embeds: [embed]}).then(msg => {
            msg.react('⏮️').then(r => {
                msg.react('⏭️').then(() => {
                    const backwardsFilter = (reaction, user) => reaction.emoji.name === '⏮️' && user.id === message.author.id;
                    const forwardsFilter = (reaction, user) => reaction.emoji.name === '⏭️' && user.id === message.author.id;
        
                    const backwards = msg.createReactionCollector({filter: backwardsFilter, time: 60000});
                    const forwards = msg.createReactionCollector({filter: forwardsFilter, time: 60000});
        
                    backwards.on('collect', r => {
                        if (page === 1) return;
                        page--;
                        embed.setDescription(pages[page-1]);
                        embed.setFooter({text: `Page ${page} of ${pages.length} | 💡 Tip: Moderne bots gebruiken buttons!`});
                        msg.edit({embeds: [embed]}).catch(console.error);
                    });
                    
                    forwards.on('collect', r => {
                        if (page === pages.length) return;
                        page++;
                        embed.setDescription(pages[page-1]);
                        embed.setFooter({text: `Page ${page} of ${pages.length} | 💡 Tip: Moderne bots gebruiken buttons!`});
                        msg.edit({embeds: [embed]}).catch(console.error);
                    });
                }).catch(console.error);
            }).catch(console.error);
        }).catch(console.error);
    },
};
const {MessageEmbed} = require("discord.js");

module.exports = {
	name: 'page',
	description: '',
	execute(message, args) {
	    
	   /*
	   message.client.on("messageReactionAdd", (reaction, user) => {
	        if(message.author.id !== message.client.user.id) {
            	reaction.remove(user).then(reaction => {
            		console.log('Removed a reaction.');
            	});
	        }
        });

	    */
        let pages = ['page one', 'second', 'third', 'you can add pages', 'all you need to do is add another item in the array', '**Supports markdown and regular chat description properties**'];
        let page = 1;
        const embed = new MessageEmbed()
            .setColor('red')
            .setFooter(`Page ${page} of ${pages.length}`)
            .setDescription(pages[page-1])
            message.channel.send(embed).then(msg => {
                msg.react('⏮️').then(r => {
                    msg.react('⏭️')
                    const backwardsFilter = (reaction, user) => reaction.emoji.name === '⏮️' && user.id === message.author.id;
                    const forwardsFilter = (reaction, user) => reaction.emoji.name === '⏭️' && user.id === message.author.id;
                    
                    //reaction.users.remove(user.id);
        
                    const backwards = msg.createReactionCollector(backwardsFilter, { time: 60000 });
                    const forwards = msg.createReactionCollector(forwardsFilter, { time: 60000 });
        
                    backwards.on('collect', r => {
                        if (page ===1) return;
                        page--;
                        embed.setDescription(pages[page-1]);
                        embed.setFooter(`Page ${page} of ${pages.length}`)
                        msg.edit(embed)
                    })
                    forwards.on('collect', r => {
                        if (page === pages.length) return;
                        page++;
                        embed.setDescription(pages[page-1]);
                        embed.setFooter(`Page ${page} of ${pages.length}`);
                        msg.edit(embed)
                        //mg.reactions.get("💖").remove(user);
                    })
                })
            })
    },
};
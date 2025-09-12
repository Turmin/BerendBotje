const fetch = require("node-fetch");

// [x] random.cat
// [x] randomfox.ca
// [x] birb.pw
// [x] dog.ceo
// [x] bunnies.io
// [x] random-d.uk
// [x] anidiots.guide
// [x] floofybot.moe
// [x] shibe.online
// https://github.com/Dev-CasperTheGhost/ghostybot/blob/main/docs/APIS_USED.md

module.exports = {
	name: 'fox',
	aliases: ['vos'],
	description: 'Random image of a fox',
    execute(message, args) {
        (async () => {
            const { image } = await fetch('https://randomfox.ca/floof/').then(response => response.json());
            message.channel.send(image);
        })();
        
        message.delete({timeout: 500});
    },
};
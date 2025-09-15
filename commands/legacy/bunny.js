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
	name: 'bunny',
	aliases: ['rabbit','konijn'],
	description: 'Random image of a bunny',
    execute(message, args) {
        (async () => {
            const { media } = await fetch('https://api.bunnies.io/v2/loop/random/?media=gif,png').then(response => response.json());
            message.channel.send(media['gif']);
        })();
        
        message.delete({timeout: 500});
    },
};
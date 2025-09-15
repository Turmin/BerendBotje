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

module.exports = {
	name: 'animal',
	//aliases: [''],
	description: '',
	execute(message, args) {
        //https://dog.ceo/api/breeds/image/random
        (async () => {
            const { url } = await fetch('https://random.dog/woof.json').then(response => response.json());
            message.channel.send(url);
        })();
        
        message.delete({timeout: 500});
    },
};
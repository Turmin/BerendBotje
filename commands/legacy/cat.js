const fetch = require("node-fetch");

module.exports = {
	name: 'cat',
	aliases: ['kat'],
	description: 'Random image of a cat',
    execute(message, args) {
        (async () => {
            // https://nekos.life/api/v2/img/meow
            // https://aws.random.cat/meow
            const { url } = await fetch('https://nekos.life/api/v2/img/meow').then(response => response.json());
            message.channel.send(url);
        })();
        
        message.delete({timeout: 500});
    },
};
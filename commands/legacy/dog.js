const fetch = require("node-fetch");

module.exports = {
	name: 'dog',
	aliases: ['hond'],
	description: 'Random image off a dog',
	execute(message, args) {
	    (async () => {
            //https://dog.ceo/api/breeds/image/random
            const { url } = await fetch('https://random.dog/woof.json').then(response => response.json());
            message.channel.send(url);
	    })();
        
        message.delete({timeout: 500});
    },
};
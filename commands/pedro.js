const fetch = require("node-fetch");
module.exports = {
	name: 'pedro',
	//aliases: ['hond'],
	description: 'Pedro',
	execute(message, args) {
        //url = 'https://c.tenor.com/LJ8is9KE6C0AAAAd/tenor.gif'
        
        //message.channel.send(url);
        
        message.channel.send({ files: ["./img/pedro.gif"] });
        
        message.delete({timeout: 500});
    },
};
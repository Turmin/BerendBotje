module.exports = {
	name: 'ping',
	//aliases: [''],
	description: '',
	execute(message, args) {
        //message.channel.send(`<@${message.author.id}>, pong ${(Date.now() - message.createdTimestamp)} ms`);
        message.reply("pong " + (Date.now() - message.createdTimestamp) + " ms");
        
        message.delete({timeout: 500});
    },
};
module.exports = {
	name: 'userinfo',
	//aliases: [''],
	//description: '',
	execute(message ,args) { // message, args, client
	
	    //var member = message.guild.member(message.mentions.users.first() || message.client.users.cache.get(args[0]));
	    var member = message.guild.member(message.author.id);
	    var nickname = member.nickname;
	    var name = (nickname == null ? member.user.username : nickname);
	    
        message.channel.send("Naam: " + name);
    },
};
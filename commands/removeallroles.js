module.exports = {
	name: 'removeallroles',
	//aliases: ['foo', 'bar'],
	permissions: 'KICK_MEMBERS',
	execute(message, args) {

        args = args.map(a => a.toLowerCase());
		if(!args[0]) return message.reply("Geef een rol ID mee");
		if(isNaN(+args[0])) return message.reply("Geef een geldig rol ID mee");
        
        const role = message.guild.roles.cache.get(args[0]);
        if(role) {
            message.guild.roles.create({
                data: {
                    name: role.name,
                    color: role.color,
                    hoist: role.hoist,
                    position: role.position,
                    permissions: role.permissions,
                    mentionable: role.mentionable
                }
            })
            .then(r => { role.delete('I had to.'); console.log(role, r + ' created'); })
            .catch(console.error)
        } else return message.reply('Deze rol ID bestaat niet')
	},
};
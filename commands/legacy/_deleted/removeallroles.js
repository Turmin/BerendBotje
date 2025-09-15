module.exports = {
    name: 'removeallroles',
    permissions: 'KickMembers',
    execute(message, args) {
        args = args.map(a => a.toLowerCase());
        if(!args[0]) return message.reply("Geef een rol ID mee\n\n💡 *Note: Dit is een gevaarlijk admin command - gebruik voorzichtig!*");
        if(isNaN(+args[0])) return message.reply("Geef een geldig rol ID mee\n\n💡 *Note: Dit is een gevaarlijk admin command!*");
        
        const role = message.guild.roles.cache.get(args[0]);
        if(role) {
            message.guild.roles.create({
                name: role.name,
                color: role.color,
                hoist: role.hoist,
                position: role.position,
                permissions: role.permissions,
                mentionable: role.mentionable
            })
            .then(newRole => { 
                role.delete('Role recreation via legacy command'); 
                console.log(`Role ${role.name} recreated as ${newRole.name}`);
                message.channel.send(`✅ Rol "${role.name}" opnieuw aangemaakt met ID: ${newRole.id}\n\n⚠️ *Note: Dit is een legacy admin command - wees voorzichtig!*`);
            })
            .catch(error => {
                console.error('Role recreation error:', error);
                message.channel.send('❌ Er is een fout opgetreden bij het opnieuw aanmaken van de rol.');
            });
        } else {
            return message.reply('Deze rol ID bestaat niet');
        }
    },
};
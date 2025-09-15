module.exports = {
	name: 'prune',
	permissions: 'MANAGE_MESSAGES',
	execute(message, args) {
        if(message.author.id !== '692352395375542284'){
            return message.reply("Jij mag dit niet").then(msg => {
                msg.delete({ timeout: 10000 })
            }).catch(console.error);
        }
    	const amount = parseInt(args[0]) + 1;
    
    	if (isNaN(amount)) {
    		return message.reply('that doesn\'t seem to be a valid number.');
    	} else if (amount <= 1 || amount > 100) {
    		return message.reply('you need to input a number between 1 and 99.');
    	}
    
    	message.channel.bulkDelete(amount, true).catch(err => {
    		console.error(err);
    		message.channel.send('Er is een fout opgetreden');
    	});
    },
};
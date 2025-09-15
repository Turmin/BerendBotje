module.exports = {
    name: 'prune',
    permissions: 'ManageMessages',
    execute(message, args) {
        if(message.author.id !== '692352395375542284'){
            return message.reply("Jij mag dit niet\n\n💡 *Tip: Probeer ook \`/prune [aantal]\` voor de nieuwe slash command!*").then(msg => {
                msg.delete({ timeout: 10000 }).catch(console.error);
            }).catch(console.error);
        }
        
        const amount = parseInt(args[0]) + 1;

        if (isNaN(amount)) {
            return message.reply('That doesn\'t seem to be a valid number.\n\n💡 *Tip: Probeer ook `/prune [aantal]` voor de nieuwe slash command!*');
        } else if (amount <= 1 || amount > 100) {
            return message.reply('You need to input a number between 1 and 99.\n\n💡 *Tip: Probeer ook `/prune [aantal]` voor de nieuwe slash command!*');
        }

        message.channel.bulkDelete(amount, true).then(deleted => {
            message.channel.send(`✅ ${deleted.size} berichten verwijderd!\n\n💡 *Tip: Probeer ook \`/prune [aantal]\` voor de nieuwe slash command!*`).then(msg => {
                setTimeout(() => msg.delete().catch(console.error), 5000);
            });
        }).catch(err => {
            console.error(err);
            message.channel.send('Er is een fout opgetreden');
        });
    },
};
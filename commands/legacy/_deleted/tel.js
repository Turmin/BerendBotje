module.exports = {
    name: 'tel',
    description: 'Count numbers',
    execute(message, args) {
        var amount;
        
        for (let i = 0; i < args.length; i++) {
            if(!isNaN(args[i])) {
                amount = args[i];
                break;
            }
        }
    
        if (isNaN(amount)) {
            return message.reply('Tot hoever moet ik tellen?\n\n💡 *Tip: Probeer ook \`/tel [aantal]\` voor de nieuwe slash command!*');
        } else {
            if(amount < 1 || amount > 10) {
                return message.channel.send("Ik kan maar tot 10 tellen\n\n💡 *Tip: Probeer ook \`/tel [aantal]\` voor de nieuwe slash command!*");
            }
            message.channel.send(`Ik tel tot ${amount}`);
            
            (async () => {
                for (let i = 1; i <= amount; i++) {
                    await delay(i);
                }
                message.channel.send("💡 *Tip: Probeer ook `/tel [aantal]` voor de nieuwe slash command!*");
            })();
            
            function delay(i) {
                return new Promise(resolve => setTimeout(() => {
                    message.channel.send(i.toString());
                    resolve();
                }, 2000));
            }
        }
        return;
    },
};
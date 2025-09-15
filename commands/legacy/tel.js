module.exports = {
	name: 'tel',
	//aliases: [''],
	//description: '',
	execute(message, args) {
    
        var amount;
        
        for (let i = 0; i < args.length; i++) {
            if(!isNaN(args[i])) {
                amount = args[i];
                break;
            }
        }
    
        if (isNaN(amount)) {
    	    message.reply('Tot hoever moet ik tellen?');
        }
        else {
            if(amount < 1 || amount > 10) {
                return message.channel.send("Ik kan maar tot 10 tellen");
            }
            message.channel.send(`Ik tel tot ${amount}`);
            // message.channel.send(`${i}`);
            
            (async () => {
                for (let i = 1; i <= amount; i++) {
                    await delay(i);
                }
            })();
            
            function delay(i) {
                return new Promise(resolve => setTimeout(() => {
                    message.channel.send(i);
                    resolve();
                }, 2000));
            }
        }
        return;
    },
};
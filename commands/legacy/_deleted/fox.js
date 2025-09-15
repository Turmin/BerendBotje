module.exports = {
    name: 'fox',
    aliases: ['vos'],
    description: 'Random image of a fox',
    execute(message, args) {
        (async () => {
            try {
                const { image } = await fetch('https://randomfox.ca/floof/').then(response => response.json());
                await message.channel.send(`${image}`);
            } catch (error) {
                await message.channel.send('Er ging iets mis bij het ophalen van een vossenafbeelding! 🦊');
            }
        })();
        
        message.delete({timeout: 500}).catch(console.error);
    },
};
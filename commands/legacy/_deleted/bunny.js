module.exports = {
    name: 'bunny',
    aliases: ['rabbit','konijn'],
    description: 'Random image of a bunny',
    execute(message, args) {
        (async () => {
            try {
                const { media } = await fetch('https://api.bunnies.io/v2/loop/random/?media=gif,png').then(response => response.json());
                await message.channel.send(`${media['gif']}`);
            } catch (error) {
                await message.channel.send('Er ging iets mis bij het ophalen van een konijnenafbeelding! 🐰');
            }
        })();
        
        message.delete({timeout: 500}).catch(console.error);
    },
};
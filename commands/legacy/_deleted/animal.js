module.exports = {
    name: 'animal',
    description: 'Random animal image',
    execute(message, args) {
        (async () => {
            try {
                const { url } = await fetch('https://random.dog/woof.json').then(response => response.json());
                await message.channel.send(`🐾 Random animal!\n${url}`);
            } catch (error) {
                await message.channel.send('Er ging iets mis bij het ophalen van een dierenafbeelding! 🐾');
            }
        })();
        
        message.delete({timeout: 500}).catch(console.error);
    },
};
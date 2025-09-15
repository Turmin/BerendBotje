module.exports = {
    name: 'dog',
    aliases: ['hond'],
    description: 'Random image of a dog',
    execute(message, args) {
        (async () => {
            try {
                const { url } = await fetch('https://random.dog/woof.json').then(response => response.json());
                await message.channel.send(`${url}`);
            } catch (error) {
                await message.channel.send('Er ging iets mis bij het ophalen van een hondenafbeelding! 🐕');
            }
        })();
        
        message.delete({timeout: 500}).catch(console.error);
    },
};
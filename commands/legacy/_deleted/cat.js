module.exports = {
    name: 'cat',
    aliases: ['kat'],
    description: 'Random image of a cat',
    execute(message, args) {
        (async () => {
            try {                
                const response = await fetch('https://nekos.life/api/v2/img/meow');
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                
                if (data && data.url) {
                    await message.channel.send(`${data.url}`);
                } else {
                    await message.channel.send('Er ging iets mis bij het ophalen van een kattenafbeelding! 🐱');
                }
            } catch (error) {
                console.error('Cat command error:', error);
                await message.channel.send('Er ging iets mis bij het ophalen van een kattenafbeelding! 🐱');
            }
        })();
        
        message.delete({timeout: 500}).catch(console.error);
    },
};
module.exports = {
    name: 'pedro',
    description: 'Pedro GIF',
    execute(message, args) {
        try {
            message.channel.send({ 
                files: ["./img/pedro.gif"],
                content: "Pedro! 🦝"
            });
        } catch (error) {
            message.channel.send('❌ Pedro is er even niet... probeer het later opnieuw!');
        }
        
        message.delete({timeout: 500}).catch(console.error);
    },
};
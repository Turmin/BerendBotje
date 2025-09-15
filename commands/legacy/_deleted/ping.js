module.exports = {
    name: 'ping',
    description: 'Legacy ping command',
    execute(message, args) {
        const ping = Date.now() - message.createdTimestamp;
        message.reply(`🏓 Pong! ${ping}ms\n\n💡 *Tip: Probeer ook de nieuwe \`/ping\` slash command!*`);
        message.delete({timeout: 500}).catch(console.error);
    },
};
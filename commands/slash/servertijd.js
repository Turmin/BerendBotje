const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const moment = require('moment');
const con = require('../../mysqlcon.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('servertijd')
        .setDescription('Toon de huidige server- en database tijd'),
    async execute(interaction) {
        // Defer reply as database query might take time
        await interaction.deferReply();
        
        try {
            con.query("SELECT UTC_TIMESTAMP() as timeutc, CURRENT_TIMESTAMP() as timetz", function (err, result) {
                if (err) {
                    console.error('Database error:', err);
                    interaction.editReply('❌ Er ging iets mis bij het ophalen van de database tijd.');
                    return;
                }
                
                const now = moment();
                const nowTZ = moment().tz('Europe/Amsterdam');
                
                const embed = new EmbedBuilder()
                    .setTitle('🕒 Server Tijd Informatie')
                    .addFields(
                        { 
                            name: '🖥️ Server Tijd (UTC)', 
                            value: `\`${now.format('DD-MM-YYYY HH:mm:ss')}\``, 
                            inline: true 
                        },
                        { 
                            name: '🇳🇱 Server Tijd (Amsterdam)', 
                            value: `\`${nowTZ.format('DD-MM-YYYY HH:mm:ss')}\``, 
                            inline: true 
                        },
                        { 
                            name: '⏰ Tijdzone', 
                            value: `\`${nowTZ.format('z')}\``, 
                            inline: true 
                        },
                        { name: '\u200B', value: '\u200B', inline: false }, // Spacer
                        { 
                            name: '🗄️ Database Tijd (UTC)', 
                            value: `\`${moment(result[0].timeutc).format('DD-MM-YYYY HH:mm:ss')}\``, 
                            inline: true 
                        },
                        { 
                            name: '🗄️ Database Tijd (TZ)', 
                            value: `\`${moment(result[0].timetz).format('DD-MM-YYYY HH:mm:ss')}\``, 
                            inline: true 
                        },
                        { 
                            name: '📊 Uptime', 
                            value: formatUptime(process.uptime()), 
                            inline: true 
                        }
                    )
                    .setColor('Blue')
                    .setThumbnail('attachment://sandclock64.png')
                    .setTimestamp()
                    .setFooter({ 
                        text: `Opgevraagd door ${interaction.user.username}`,
                        iconURL: interaction.user.displayAvatarURL()
                    });
                
                // Calculate time differences
                const serverTime = moment();
                const dbTime = moment(result[0].timeutc);
                const timeDiff = Math.abs(serverTime.diff(dbTime, 'milliseconds'));
                
                if (timeDiff > 1000) { // More than 1 second difference
                    embed.addFields({
                        name: '⚠️ Tijd Verschil',
                        value: `${timeDiff}ms tussen server en database`,
                        inline: false
                    });
                    embed.setColor('Orange');
                }
                
                interaction.editReply({
                    embeds: [embed],
                    files: ['img/sandclock64.png']
                });
            });
        } catch (error) {
            console.error('Servertijd command error:', error);
            await interaction.editReply('❌ Er is een fout opgetreden bij het ophalen van de tijdinformatie.');
        }
    },
};

// Helper function to format uptime
function formatUptime(seconds) {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    let uptime = '';
    if (days > 0) uptime += `${days}d `;
    if (hours > 0) uptime += `${hours}h `;
    if (minutes > 0) uptime += `${minutes}m `;
    uptime += `${secs}s`;
    
    return uptime;
}
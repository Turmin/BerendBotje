const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('prune')
        .setDescription('Verwijder berichten uit dit kanaal')
        .addIntegerOption(option =>
            option.setName('aantal')
                .setDescription('Aantal berichten om te verwijderen (1-99)')
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(99))
        .addUserOption(option =>
            option.setName('gebruiker')
                .setDescription('Verwijder alleen berichten van deze gebruiker (optioneel)')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('reden')
                .setDescription('Reden voor het verwijderen (optioneel)')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    async execute(interaction) {
        // Double check permissions
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
            await interaction.reply({
                content: '❌ Je hebt geen permissie om berichten te verwijderen!',
                ephemeral: true
            });
            return;
        }
        
        // Additional permission check for specific user
        if (interaction.user.id !== '692352395375542284') {
            await interaction.reply({
                content: '❌ Alleen de bot eigenaar mag dit commando gebruiken!',
                ephemeral: true
            });
            return;
        }
        
        const aantal = interaction.options.getInteger('aantal');
        const targetUser = interaction.options.getUser('gebruiker');
        const reden = interaction.options.getString('reden') || 'Geen reden opgegeven';
        
        try {
            // Defer reply as this might take time
            await interaction.deferReply({ ephemeral: true });
            
            let deleted;
            
            if (targetUser) {
                // Fetch more messages to filter by user
                const messages = await interaction.channel.messages.fetch({ limit: 100 });
                const userMessages = messages.filter(m => m.author.id === targetUser.id).first(aantal);
                
                if (userMessages.length === 0) {
                    await interaction.editReply(`❌ Geen recente berichten gevonden van ${targetUser.username}.`);
                    return;
                }
                
                deleted = await interaction.channel.bulkDelete(userMessages, true);
                
                await interaction.editReply(
                    `✅ ${deleted.size} berichten van ${targetUser.username} verwijderd!\n` +
                    `**Reden:** ${reden}`
                );
            } else {
                // Delete any messages
                deleted = await interaction.channel.bulkDelete(aantal, true);
                
                await interaction.editReply(
                    `✅ ${deleted.size} berichten verwijderd!\n` +
                    `**Reden:** ${reden}`
                );
            }
            
            // Log the action (if logs channel exists)
            const logChannelId = process.env.CHANNEL_LOGS_MICH;
            if (logChannelId) {
                const logChannel = interaction.client.channels.cache.get(logChannelId);
                if (logChannel) {
                    const { EmbedBuilder } = require('discord.js');
                    
                    const logEmbed = new EmbedBuilder()
                        .setTitle('🗑️ Berichten Verwijderd')
                        .addFields(
                            { name: 'Moderator', value: `<@${interaction.user.id}>`, inline: true },
                            { name: 'Kanaal', value: `<#${interaction.channel.id}>`, inline: true },
                            { name: 'Aantal', value: deleted.size.toString(), inline: true },
                            { name: 'Reden', value: reden, inline: false }
                        )
                        .setColor('Red')
                        .setTimestamp();
                    
                    if (targetUser) {
                        logEmbed.addFields({ name: 'Gefilterd op gebruiker', value: `<@${targetUser.id}>`, inline: true });
                    }
                    
                    await logChannel.send({ embeds: [logEmbed] });
                }
            }
            
            // Auto-delete the confirmation message after 10 seconds
            setTimeout(async () => {
                try {
                    await interaction.deleteReply();
                } catch (error) {
                    // Message might already be deleted
                }
            }, 10000);
            
        } catch (error) {
            console.error('Prune command error:', error);
            
            let errorMessage = '❌ Er is een fout opgetreden bij het verwijderen van berichten.';
            
            if (error.code === 50034) {
                errorMessage = '❌ Kan alleen berichten verwijderen die jonger zijn dan 14 dagen.';
            } else if (error.code === 50013) {
                errorMessage = '❌ Ik heb geen permissie om berichten te verwijderen in dit kanaal.';
            }
            
            await interaction.editReply(errorMessage);
        }
    },
};
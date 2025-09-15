const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('embed')
        .setDescription('Verstuur een aangepaste embed naar een kanaal')
        .addChannelOption(option =>
            option.setName('kanaal')
                .setDescription('Het kanaal waar de embed naartoe moet')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('json')
                .setDescription('JSON code voor de embed (gebruik embed generator)')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('tekst')
                .setDescription('Extra tekst boven de embed (optioneel)')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    async execute(interaction) {
        // Permission check
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
            await interaction.reply({
                content: '❌ Je hebt geen permissie om embed berichten te versturen!',
                ephemeral: true
            });
            return;
        }
        
        const targetChannel = interaction.options.getChannel('kanaal');
        const jsonString = interaction.options.getString('json');
        const extraText = interaction.options.getString('tekst') || '';
        
        try {
            // Parse JSON
            const embedData = JSON.parse(jsonString);
            
            // Validate that it's an object
            if (typeof embedData !== 'object' || embedData === null) {
                await interaction.reply({
                    content: '❌ Ongeldige JSON! Zorg dat je een geldig embed object doorgeeft.',
                    ephemeral: true
                });
                return;
            }
            
            // Create embed from JSON
            const embed = new EmbedBuilder(embedData);
            
            // Send to target channel
            await targetChannel.send({
                content: extraText,
                embeds: [embed]
            });
            
            // Confirm success
            const successEmbed = new EmbedBuilder()
                .setTitle('✅ Embed Verstuurd!')
                .addFields(
                    { name: 'Kanaal', value: `<#${targetChannel.id}>`, inline: true },
                    { name: 'Door', value: `<@${interaction.user.id}>`, inline: true }
                )
                .setColor('Green')
                .setTimestamp();
            
            await interaction.reply({ 
                embeds: [successEmbed],
                ephemeral: true 
            });
            
            // Log the action
            const logChannelId = process.env.CHANNEL_LOGS_MICH;
            if (logChannelId) {
                const logChannel = interaction.client.channels.cache.get(logChannelId);
                if (logChannel) {
                    const logEmbed = new EmbedBuilder()
                        .setTitle('📝 Embed Verstuurd')
                        .addFields(
                            { name: 'Moderator', value: `<@${interaction.user.id}>`, inline: true },
                            { name: 'Doel Kanaal', value: `<#${targetChannel.id}>`, inline: true },
                            { name: 'Extra Tekst', value: extraText || 'Geen', inline: false }
                        )
                        .setColor('Blue')
                        .setTimestamp();
                    
                    await logChannel.send({ embeds: [logEmbed] });
                }
            }
            
        } catch (error) {
            console.error('Embed command error:', error);
            
            let errorMessage = '❌ Er is een fout opgetreden bij het verwerken van de embed.';
            
            if (error instanceof SyntaxError) {
                errorMessage = '❌ Ongeldige JSON syntax! Controleer je JSON code.\n\n**Tip:** Gebruik een online JSON validator of embed generator.';
            } else if (error.code === 50013) {
                errorMessage = '❌ Ik heb geen permissie om berichten te versturen in dat kanaal.';
            }
            
            await interaction.reply({
                content: errorMessage,
                ephemeral: true
            });
        }
    },
};
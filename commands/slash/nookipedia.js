const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nookipedia')
        .setDescription('Zoek een Animal Crossing villager')
        .addStringOption(option =>
            option.setName('naam')
                .setDescription('De naam van de villager')
                .setRequired(true)),
    async execute(interaction) {
        const villagerNaam = interaction.options.getString('naam').toLowerCase();
        
        // Defer reply because API call might take time
        await interaction.deferReply();
        
        try {
            const headers = {
                'X-API-KEY': 'bf930b29-5302-41c5-8db9-75d9e699e7cb',
                'Accept-Version': '1.4.0'
            };
            
            const response = await fetch('https://api.nookipedia.com/villagers', {
                method: 'GET', 
                headers: headers
            });
            
            if (!response.ok) {
                await interaction.editReply('❌ Er is een probleem met de Nookipedia API.');
                return;
            }
            
            const villagers = await response.json();
            
            // Search for villager (case insensitive)
            const villager = villagers.find(v => v.name.toLowerCase() === villagerNaam);
            
            if (!villager) {
                // Try partial match if exact match fails
                const partialMatch = villagers.find(v => 
                    v.name.toLowerCase().includes(villagerNaam) || 
                    villagerNaam.includes(v.name.toLowerCase())
                );
                
                if (partialMatch) {
                    const embed = new EmbedBuilder()
                        .setTitle('🤔 Bedoel je misschien...')
                        .setDescription(`Ik kon "${villagerNaam}" niet vinden, maar wel "${partialMatch.name}". Probeer het nogmaals met de exacte naam.`)
                        .setColor('Orange');
                    
                    await interaction.editReply({ embeds: [embed] });
                    return;
                }
                
                await interaction.editReply(`❌ Villager "${villagerNaam}" niet gevonden. Controleer de spelling!`);
                return;
            }
            
            // Create villager embed
            const villagerEmbed = new EmbedBuilder()
                .setTitle(`🏝️ ${villager.name}`)
                .setDescription(`*"${villager.quote}"*`)
                .addFields(
                    { name: '🐾 Soort', value: villager.species, inline: true },
                    { name: '😊 Persoonlijkheid', value: villager.personality, inline: true },
                    { name: '⚧️ Geslacht', value: villager.gender, inline: true },
                    { name: '🎂 Verjaardag', value: `${villager.birthday_day} ${villager.birthday_month}`, inline: true },
                    { name: '♒ Sterrenbeeld', value: villager.sign || 'Onbekend', inline: true },
                    { name: '💬 Slagzin', value: `"${villager.phrase}"`, inline: true },
                    { name: '👕 Standaard kleding', value: villager.clothing || 'Onbekend', inline: false }
                )
                .setColor(`#${villager.title_color}`)
                .setImage(villager.image_url)
                .setFooter({ 
                    text: `Debut: ${villager.debut || 'Onbekend'} | ID: ${villager.id || 'N/A'}`,
                    iconURL: 'https://dodo.ac/np/images/2/2c/NH-icon-Nook_Phone.png'
                });
            
            // Add URL if available
            if (villager.url) {
                villagerEmbed.setURL(villager.url);
            }
            
            // Add appearances info if available
            if (villager.appearances && villager.appearances.length > 0) {
                const appearances = villager.appearances.slice(0, 5).join(', '); // Limit to 5 games
                villagerEmbed.addFields({ 
                    name: '🎮 Verschenen in', 
                    value: appearances, 
                    inline: false 
                });
            }
            
            await interaction.editReply({ embeds: [villagerEmbed] });
            
        } catch (error) {
            console.error('Nookipedia API error:', error);
            await interaction.editReply('❌ Er is een fout opgetreden bij het zoeken naar deze villager. Probeer het later opnieuw.');
        }
    },
};
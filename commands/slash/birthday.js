const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const moment = require('moment');
const con = require('../../mysqlcon.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('birthday')
        .setDescription('Beheer verjaardagen')
        .addSubcommand(subcommand =>
            subcommand
                .setName('lijst')
                .setDescription('Toon alle verjaardagen'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('toevoegen')
                .setDescription('Voeg een nieuwe verjaardag toe')
                .addStringOption(option =>
                    option.setName('naam')
                        .setDescription('Naam van de persoon')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('datum')
                        .setDescription('Geboortedatum (DD-MM-YYYY)')
                        .setRequired(true))
                .addUserOption(option =>
                    option.setName('gebruiker')
                        .setDescription('Tag de Discord gebruiker (optioneel)')
                        .setRequired(false))),
    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();
        
        if (subcommand === 'lijst') {
            // Show birthday list
            con.query("SELECT UserID, Username, Birthday FROM birthday WHERE Active = 1 ORDER BY MONTH(Birthday) ASC, DAY(Birthday) ASC", function (err, result) {
                if (err) {
                    console.error('Database error:', err);
                    interaction.reply('Er is een fout opgetreden bij het ophalen van verjaardagen.');
                    return;
                }
                
                if (result.length > 0) {
                    let birthdaylist = "";
                    
                    result.forEach(row => {
                        birthdaylist += `${moment(row.Birthday).format("DD MMM")} - ${row.Username}`;
                        if (row.UserID > 0) birthdaylist += ` <@${row.UserID}>`;
                        birthdaylist += "\n";
                    });
                    
                    const embed = new EmbedBuilder()
                        .setTitle('🎂 Verjaardagen')
                        .setDescription(birthdaylist)
                        .setColor('Random')
                        .setThumbnail('attachment://balloons64.png');
                    
                    interaction.reply({
                        embeds: [embed],
                        files: ['img/balloons64.png']
                    });
                } else {
                    interaction.reply('Geen verjaardagen gevonden in de database.');
                }
            });
            
        } else if (subcommand === 'toevoegen') {
            // Add birthday - check permissions first
            if (interaction.user.id !== '692352395375542284') {
                await interaction.reply({
                    content: '❌ Je hebt geen permissie om verjaardagen toe te voegen!',
                    ephemeral: true
                });
                return;
            }
            
            const naam = interaction.options.getString('naam');
            const datum = interaction.options.getString('datum');
            const gebruiker = interaction.options.getUser('gebruiker');
            
            // Validate date format
            if (!moment(datum, 'DD-MM-YYYY', true).isValid()) {
                await interaction.reply({
                    content: '❌ Ongeldige datum! Gebruik het formaat: DD-MM-YYYY (bijvoorbeeld: 15-03-1990)',
                    ephemeral: true
                });
                return;
            }
            
            const userID = gebruiker ? gebruiker.id : 0;
            const birthday = moment(datum, 'DD-MM-YYYY').format("YYYY-MM-DD");
            
            // Check if user already exists
            con.query(`SELECT UserID FROM birthday WHERE UserID = ? AND UserID != 0`, [userID], (err, result) => {
                if (err) {
                    console.error('Database error:', err);
                    interaction.reply('Er is een database fout opgetreden.');
                    return;
                }
                
                if (result.length > 0) {
                    interaction.reply({
                        content: '❌ Deze gebruiker bestaat al in de verjaardagenlijst.',
                        ephemeral: true
                    });
                } else {
                    // Insert new birthday
                    con.query(`INSERT INTO birthday (UserID, Username, Birthday, Active) VALUES (?, ?, ?, 1)`, 
                    [userID, naam, birthday], function (err, result) {
                        if (err) {
                            console.error('Database error:', err);
                            interaction.reply('Er is een fout opgetreden bij het toevoegen van de verjaardag.');
                            return;
                        }
                        
                        const successMessage = `✅ ${naam} is toegevoegd aan de verjaardagenlijst!`;
                        const birthDate = moment(datum, 'DD-MM-YYYY');
                        const nextBirthday = moment().year() >= birthDate.year() ? 
                            birthDate.clone().year(moment().year() + 1) : 
                            birthDate.clone().year(moment().year());
                            
                        const daysUntil = nextBirthday.diff(moment(), 'days');
                        
                        const embed = new EmbedBuilder()
                            .setTitle('🎂 Verjaardag toegevoegd!')
                            .addFields(
                                { name: 'Naam', value: naam, inline: true },
                                { name: 'Datum', value: birthDate.format('DD MMMM'), inline: true },
                                { name: 'Dagen tot verjaardag', value: daysUntil.toString(), inline: true }
                            )
                            .setColor('Green');
                            
                        if (gebruiker) {
                            embed.addFields({ name: 'Discord gebruiker', value: `<@${userID}>`, inline: true });
                        }
                        
                        interaction.reply({ embeds: [embed] });
                    });
                }
            });
        }
    },
};
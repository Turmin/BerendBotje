const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Toon alle beschikbare commands'),
    async execute(interaction) {
        // Dynamically generate help from available slash commands
        const commands = interaction.client.slashCommands;
        
        const helpFields = [];
        commands.forEach((command, name) => {
            const commandData = command.data;
            let commandString = `/${name}`;
            
            // Add options to the command string
            if (commandData.options && commandData.options.length > 0) {
                const requiredOptions = commandData.options.filter(option => option.required);
                const optionalOptions = commandData.options.filter(option => !option.required);
                
                if (requiredOptions.length > 0) {
                    commandString += ` ${requiredOptions.map(opt => `[${opt.name}]`).join(' ')}`;
                }
                if (optionalOptions.length > 0) {
                    commandString += ` ${optionalOptions.map(opt => `(${opt.name})`).join(' ')}`;
                }
            }
            
            helpFields.push({
                name: commandString,
                value: commandData.description,
                inline: false
            });
        });
        
        const helpEmbed = new EmbedBuilder()
            .setTitle("Help - Slash Commands")
            .setDescription("Beschikbare slash commands:")
            .addFields(helpFields)
            .setThumbnail(interaction.client.user.displayAvatarURL())
            .setFooter({text: interaction.guild.name, iconURL: interaction.guild.iconURL()})
            .setColor('Random');
            
        await interaction.reply({embeds: [helpEmbed]});
    },
};
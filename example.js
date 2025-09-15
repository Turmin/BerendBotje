// 1. Deferred replies voor lange operaties
await interaction.deferReply();
await interaction.editReply('Result!');

// 2. Ephemeral replies voor errors
await interaction.reply({ content: 'Error!', ephemeral: true });

// 3. Permission checks
if (!interaction.member.permissions.has('ManageMessages')) {
    // deny
}

// 4. Subcommands
// .addSubcommand(sub => sub.setName('add').setDescription('...'))

// 5. Error handling met try/catch
try {
    // risky operation
} catch (error) {
    console.error('Error:', error);
    await interaction.reply('Something went wrong!');
}
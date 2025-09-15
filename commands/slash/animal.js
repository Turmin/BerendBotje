const { SlashCommandBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('animal')
        .setDescription('Random afbeelding van een willekeurig dier'),
    async execute(interaction) {
        // Array of different animal APIs to randomly choose from
        const animalAPIs = [
            {
                name: 'dog',
                url: 'https://random.dog/woof.json',
                property: 'url',
                emoji: '🐕'
            },
            {
                name: 'cat',
                url: 'https://nekos.life/api/v2/img/meow',
                property: 'url',
                emoji: '🐱'
            },
            {
                name: 'fox',
                url: 'https://randomfox.ca/floof/',
                property: 'image',
                emoji: '🦊'
            }
        ];
        
        try {
            // Randomly select an animal API
            const randomAPI = animalAPIs[Math.floor(Math.random() * animalAPIs.length)];
            
            const response = await fetch(randomAPI.url);
            const data = await response.json();
            
            await interaction.reply({
                content: `${randomAPI.emoji} Random ${randomAPI.name}!`,
                files: [data[randomAPI.property]]
            });
        } catch (error) {
            console.error('Animal API error:', error);
            await interaction.reply('Er ging iets mis bij het ophalen van een dierenafbeelding! 🐾');
        }
    },
};
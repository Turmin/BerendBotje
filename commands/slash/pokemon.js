const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pokemon')
        .setDescription('Zoek informatie over een Pokémon')
        .addStringOption(option =>
            option.setName('naam')
                .setDescription('De naam of ID van de Pokémon')
                .setRequired(true)),
    async execute(interaction) {
        const pokemonNaam = interaction.options.getString('naam').toLowerCase();
        
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonNaam}`);
            if (!response.ok) {
                await interaction.reply(`Pokémon "${pokemonNaam}" is niet gevonden.`);
                return;
            }
            
            const pokemon = await response.json();
            
            const statsNL = {
                'hp': 'Kracht',
                'attack': 'Aanval', 
                'defense': 'Verdediging',
                'special-attack': 'Speciale aanval',
                'special-defense': 'Speciale verdediging',
                'speed': 'Snelheid'
            };
            
            const stats = pokemon.stats.map(stat => ({
                name: statsNL[stat.stat.name] || stat.stat.name,
                value: `${stat.base_stat}/255`,
                inline: true
            }));
            
            const abilities = pokemon.abilities.map(ability => 
                ability.ability.name.charAt(0).toUpperCase() + ability.ability.name.slice(1)
            );
            
            const types = pokemon.types.map(type => 
                type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1)
            );
            
            const pokemonEmbed = new EmbedBuilder()
                .setTitle(pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1))
                .setDescription(`#${pokemon.id}`)
                .addFields(
                    {name: "Type(s)", value: types.join(", ")},
                    {name: "Capaciteit(en)", value: abilities.join(", ")},
                    ...stats,
                    {name: "Lengte", value: pokemon.height >= 10 ? `${pokemon.height / 10} m` : `${pokemon.height * 10} cm`, inline: true},
                    {name: "Gewicht", value: `${pokemon.weight / 10} kg`, inline: true}
                )
                .setColor('Random')
                .setThumbnail(`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`);
            
            await interaction.reply({embeds: [pokemonEmbed]});
        } catch (error) {
            console.error('Pokemon API error:', error);
            await interaction.reply("Er is een fout opgetreden bij het zoeken naar deze Pokémon.");
        }
    },
};
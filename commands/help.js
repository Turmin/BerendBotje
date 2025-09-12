const discord = require("discord.js");

module.exports = {
	name: 'help',
	//aliases: [''],
	description: '',
	execute(message, args) {
        var embed = new discord.MessageEmbed()
        .setTitle("Help")
        .setDescription("Commando's")
        .setColor("RANDOM")
        .addFields(
            {name: "!bday", value: "Lijst met verjaardagen"},
            {name: "!bday set <Naam> <DD-MM-YYYY> <@tag> *Tag is optioneel*", value: "Voeg nieuwe verjaardag toe."},
            {name: "!tel <getal 1-10>", value: "Laat de bot tellen"},
            {name: "!animal", value: "Afbeelding van een willekeurig dier"},
            {name: "!cat", value: "Afbeelding van een kat"},
            {name: "!dog", value: "Afbeelding van een hond"},
            {name: "!fox", value: "Afbeelding van een vos"},
            {name: "!bunny", value: "Afbeelding van een konijn"},
            {name: "!kroket", value: "Hoelang moet je kroket in de airfryer?"},
            {name: "!pokedex alias !poke", value: "Zoek een pokemon"},
            {name: "!nookipedia alias !ac", value: "Zoek een Animal Crossing villager"},
            {name: "!ping", value: "Test de server response"},
            {name: "!prune <1-99>", value: "Verwijder 1 tot max 99 berichten in één keer"},
            {name: "@Berend Botje", value: "hallo, hoi of hey\ngoedemorgen of morning\nwelterusten of slaap lekker\ndag, doei of tot ziens"},
            {name: "Woorden", value: "slaapliedje\nberend\nlol\npooh, poeh beer\ntempa"}
        )
        //.setThumbnail(message.client.user.displayAvatarURL())
        .setThumbnail(message.client.user.displayAvatarURL())
        .setFooter(message.guild.name, message.guild.iconURL());
        
        message.channel.send(embed);
        
        message.delete({timeout: 500});
    },
};
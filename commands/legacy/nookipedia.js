const discord = require("discord.js");
const fetch = require("node-fetch");

// https://api.nookipedia.com/doc
// https://stackoverflow.com/questions/40099282/node-fetch-api-get-with-headers

/*
Response {
  size: 0,
  timeout: 0,
  [Symbol(Body internals)]: {
    body: PassThrough {
      _readableState: [ReadableState],
      _events: [Object: null prototype],
      _eventsCount: 5,
      _maxListeners: undefined,
      _writableState: [WritableState],
      allowHalfOpen: true,
      [Symbol(kCapture)]: false,
      [Symbol(kTransformState)]: [Object]
    },
    disturbed: false,
    error: null
  },
  [Symbol(Response internals)]: {
    url: 'https://api.nookipedia.com/villagers',
    status: 200,
    statusText: 'OK',
    headers: Headers { [Symbol(map)]: [Object: null prototype] },
    counter: 0
  }
}
{
  name: 'Ribbot',
  url: 'https://nookipedia.com/wiki/Ribbot',
  alt_name: '',
  title_color: 'bfbfbf',
  text_color: '5e5e5e',
  id: 'flg01',
  image_url: 'https://dodo.ac/np/images/9/94/Ribbot_NH.png',
  species: 'Frog',
  personality: 'Jock',
  gender: 'Male',
  birthday_month: 'February',
  birthday_day: '13',
  sign: 'Aquarius',
  quote: 'Never rest, never rust.',
  phrase: 'zzrrbbit',
  clothing: 'Simple Parka',
  islander: false,
  debut: 'DNM',
  prev_phrases: [ 'toady' ],
  appearances: [
    'DNM',    'AC',
    'E_PLUS', 'WW',
    'CF',     'NL',
    'WA',     'NH',
    'HHD',    'PC'
  ]
}
*/

module.exports = {
	name: 'nookipedia',
	aliases: ['ac','animalcrossing'],
	description: '',
    execute(message, args) {
         if (!args.length) {
           message.delete();
           return message.reply("Geef een geldige naam mee");
        }
        
        args = args.map(a => a.toLowerCase())
        //const query = querystring.stringify({ term: args.join(' ') });
        
        const headers = {
          'X-API-KEY': 'bf930b29-5302-41c5-8db9-75d9e699e7cb',
          'Accept-Version': '1.4.0'
        }
        
        fetch('https://api.nookipedia.com/villagers', {method: 'GET', headers: headers})
        .then(response => {
            return response.json()
        }).then(json => {
            //console.log(json)
            const villager = json.find(o => o.name.toLowerCase() === args[0])
            if(typeof villager !== 'undefined' && villager) {
                var embed = new discord.MessageEmbed()
                    .setTitle(villager.name)
                    .setDescription(villager.quote)
                    .addField("Soort", villager.species, true)
                    .addField("Persoonlijkheid", villager.personality, true)
                    .addField("Geslacht", villager.gender, true)
                    .addField("Verjaardag", villager.birthday_day + " " + villager.birthday_month)
                    .addField("Slagzin", villager.phrase)
                    .addField("Kleding", villager.clothing)
                    .setColor('#' + villager.title_color)
                    //.setThumbnail(villager.image_url)
                    .setImage(villager.image_url);
                return message.channel.send(embed);
            } else {
                return message.reply("Naam \"" + args[0] + "\" niet gevonden")
            }
        }).catch(function(err) {
            console.log(err.response)
           	return message.channel.send("Er is een fout opgetreden.")
        });
    },
};
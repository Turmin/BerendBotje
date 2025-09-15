// https://www.youtube.com/watch?v=PaZuNKxTF04
const {channelids} = require("../config.json");

const channels = [channelids.ALGEMEEN_MICH]

module.exports = {
    execute(message, args) {
        
        console.log("hoi");
        
        const { content } = message
        
        const eachLine = content.split('\n')
        
        for(const line of eachLine) {
            if(line.includes('=')) {
                const split = line.split('=')
                const emoji = split[0].trim()
                message.react(emoji)
            }
        }
    },
};
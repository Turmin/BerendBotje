const cron = require("node-cron");
const moment = require("moment");
const tz = require("moment-timezone");

module.exports = {
    name: 'testcron',
    description: 'Test cron job functionality',
    execute(message, args) {
        message.delete().catch(console.error);

        const hours = (args[0] && !isNaN(args[0]) ? args[0] : '20');
        const minutes = (args[1] && !isNaN(args[1]) ? args[1] : '00');

        message.channel.send(`⏰ Cronjob gezet voor ${hours}:${minutes}\n\n💡 *Note: Dit is een legacy test command - !testcron [hours] [minutes]*`);

        // Create test cron jobs (A through E)
        const cronJobs = [];
        
        for (let i = -2; i <= 2; i++) {
            const testHour = moment(hours, 'HH').add(i, 'hours').format("HH");
            const cronLabel = String.fromCharCode(65 + i + 2); // A, B, C, D, E
            
            const job = cron.schedule(`${minutes} ${testHour} * * *`, () => {
                const currentTime = moment().tz('Europe/Amsterdam').format('HH:mm:ss');
                const serverTime = moment().format('HH:mm:ss');
                
                message.channel.send(
                    `---------------------------------\n` +
                    `Cron ${cronLabel} uitgevoerd\n` +
                    `Uitvoer tijd: ${testHour}:${minutes}\n` +
                    `Tijd Europe/Amsterdam: ${currentTime}\n` +
                    `Tijd server: ${serverTime}\n` +
                    `💡 *Legacy test cron ${cronLabel}*\n` +
                    `---------------------------------`
                );
            }, {
                scheduled: true,
                timezone: "Europe/Amsterdam"
            });
            
            cronJobs.push(job);
        }
        
        // Auto-cleanup after 24 hours to prevent memory leaks
        setTimeout(() => {
            cronJobs.forEach(job => {
                if (job) job.destroy();
            });
            console.log('Test cron jobs cleaned up after 24 hours');
        }, 24 * 60 * 60 * 1000);
    },
};
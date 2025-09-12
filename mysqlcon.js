const mysql = require("mysql"); // https://www.npmjs.com/package/mysql (Database)
const {database} = require("./config.json");
const moment = require("moment");
const tz = require("moment-timezone");
const dt = moment().tz('Europe/Amsterdam').format('DD-MM-YYYY HH:mm:ss');

// var con = mysql.createConnection({
var con = mysql.createPool({
    connectionLimit : 2,
    host: database.host,
    user: database.user,
    password: database.password,
    database: database.database,
    dateStrings: true,
    timezone: database.timezone
});

function handleDisconnect(con) {

    var con = mysql.createConnection({
        host: database.host,
        user: database.user,
        password: database.password,
        database: database.database,
        dateStrings: true,
        timezone: database.timezone
    });
    
    con.connect(function(err) {              // The server is either down
        const dt = moment().tz('Europe/Amsterdam').format('DD-MM-YYYY HH:mm:ss');
        if(err) {                                     // or restarting (takes a while sometimes).
            console.log("error when connecting to db:", err, dt);
            setTimeout(handleDisconnect, 10000); // We introduce a delay before attempting to reconnect,
        } else {                                    // to avoid a hot loop, and to allow our node script to
            console.log("Connected to database", dt);
        }
    });                                     // process asynchronous requests in the meantime.
                                        // If you're also serving http, display a 503 error.
    con.on('error', function(err) {
        console.log("DB error", err);
        if(err.code) { // Connection to the MySQL server is usually
            handleDisconnect();                         // lost due to either server restart, or a
        } else {                                      // connnection idle timeout (the wait_timeout
            throw err;                                  // server variable configures this)
        }
    });
}

handleDisconnect(con);

module.exports = con;
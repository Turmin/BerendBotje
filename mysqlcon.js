// Load environment variables
require('dotenv').config();

const mysql = require("mysql");
const moment = require("moment");
const tz = require("moment-timezone");

// Database config from environment variables
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    timezone: process.env.DB_TIMEZONE || 'Z',
    dateStrings: true,
    connectionLimit: 2
};

// Validate required environment variables
if (!dbConfig.host || !dbConfig.user || !dbConfig.password || !dbConfig.database) {
    console.error('❌ Missing required database environment variables!');
    console.error('Required: DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE');
    process.exit(1);
}

console.log('📊 Database config loaded from environment variables');

// Create connection pool
const con = mysql.createPool(dbConfig);

function handleDisconnect() {
    const singleConnection = mysql.createConnection({
        host: dbConfig.host,
        user: dbConfig.user,
        password: dbConfig.password,
        database: dbConfig.database,
        dateStrings: true,
        timezone: dbConfig.timezone
    });
    
    singleConnection.connect(function(err) {
        const dt = moment().tz('Europe/Amsterdam').format('DD-MM-YYYY HH:mm:ss');
        if(err) {
            console.error("❌ Database connection error:", err.code, dt);
            setTimeout(handleDisconnect, 10000); // Retry after 10 seconds
        } else {
            console.log("✅ Connected to database", dt);
        }
    });
    
    singleConnection.on('error', function(err) {
        console.error("❌ Database error:", err.code || err.message);
        if(err.code === 'PROTOCOL_CONNECTION_LOST' || err.code === 'ECONNRESET') {
            console.log("🔄 Attempting to reconnect to database...");
            handleDisconnect();
        } else {
            throw err;
        }
    });
    
    return singleConnection;
}

// Test the connection
con.getConnection((err, connection) => {
    if (err) {
        console.error('❌ Database pool connection failed:', err.code);
        handleDisconnect();
    } else {
        console.log('✅ Database pool connection successful');
        connection.release();
    }
});

// Handle pool errors
con.on('error', function(err) {
    console.error('❌ Database pool error:', err.code || err.message);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        handleDisconnect();
    } else {
        throw err;
    }
});

module.exports = con;
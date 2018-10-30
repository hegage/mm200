var mysql = require('mysql');

var connection = mysql.createConnection({
    host     : process.env.JAWSDB_URL,
    user     : process.env.JAWSDB_US,
    password : process.env.JAWSDB_PW,
    database : process.env.JAWSDB_DB
});
connection.connect();

module.exports = connection;
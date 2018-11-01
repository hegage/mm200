var mysql = require('mysql');

if(typeof process.env.prod === 'undefined') {
    
    var connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : 'password',
        database : 'todoapp'
    });
    
} else {
   
    var connection = mysql.createConnection({
        host     : process.env.JAWSDB_URL,
        user     : process.env.JAWSDB_US,
        password : process.env.JAWSDB_PW,
        database : process.env.JAWSDB_DB
    });
}
    connection.connect();

module.exports = connection;
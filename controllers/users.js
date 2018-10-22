
//include the model (aka DB connection)
var db = require('../models/dbconnection');
var apiCallback = require('../models/apicallback')

var Items = {
    get: (req, res) => {
        let pathname = req._parsedUrl.pathname.split('/');
        let section = pathname[1];
        db.query('SELECT * FROM users WHERE id = ?', [req.params.id], 
        (err, result) => apiCallback(err, result, section, req, res)); 
    },
    create: (req, res) => {
        let pathname = req._parsedUrl.pathname.split('/');
        let section = pathname[1];

        // TODO: Hash her.
        let password = req.body.password;
        
        db.query(
            'INSERT INTO users(username, password, email) VALUES (?, ?, ?)',
            [req.body.username, password, req.body.email], (error, results) => {
                if (error) {
                    var apiResult = {};

                    apiResult.meta = {
                        table: section,
                        type: "collection",
                        total: 0
                    }

                    apiResult.data = [];

                    res.json(error);
                }

                var apiResult = {};

                db.query('SELECT * FROM users WHERE id = ?', [results.insertId], function (err, results) {
                    if (err) throw err;
                    let resultJson = JSON.stringify(results);
                    resultJson = JSON.parse(resultJson);
                    apiResult.data = resultJson;

                    //send JSON to Express
                    res.json(apiResult);
                });

            });
    },
    put: (req, res) => {
        let pathname = req._parsedUrl.pathname.split('/');
        let section = pathname[1]; 

        const password = req.body.password;
        
        db.query('UPDATE users SET `password` = ? WHERE id = ?', [password, req.params.id],
        (err, result) => apiCallback(err, result, section, req, res));
    },
    delete: (req, res) => {
        let pathname = req._parsedUrl.pathname.split('/');
        let section = pathname[1];

        db.query('DELETE FROM users WHERE id = ?', [req.params.id],
        (err, result) => apiCallback(err, result, section, req, res));
    },
};
module.exports = Items;
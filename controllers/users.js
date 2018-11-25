
//include the model (aka DB connection)
var db = require('../models/dbconnection');
var apiCallback = require('../models/apicallback')
var bcrypt = require('bcrypt');

var Items = {
    get: (req, res) => {
        let pathname = req._parsedUrl.pathname.split('/');
        let section = pathname[1];
        db.query('SELECT id, username, email FROM users WHERE id = ?', [req.params.id],
        (err, result) => apiCallback(err, result, section, req, res));
    },
    create: (req, res) => {
        let pathname = req._parsedUrl.pathname.split('/');
        let section = pathname[1];

        bcrypt.hash(req.body.password, 10, (err, hash) => {
            if(err) {
               return res.status(500).json({
                  error: err
               });
            } else {
                db.query(
                    'INSERT INTO users(username, password, email) VALUES (?, ?, ?)',
                    [req.body.username, hash, req.body.email], (error, results) => {
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

                        db.query('SELECT username, id, email FROM users WHERE id = ?', [results.insertId], function (err, results) {
                            if (err) throw err;
                            let resultJson = JSON.stringify(results);
                            resultJson = JSON.parse(resultJson);
                            apiResult.data = resultJson;

                            //send JSON to Express
                            res.json(apiResult);
                        });

                    });
            }
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
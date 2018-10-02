
//include the model (aka DB connection)
var db = require('../models/dbconnection');
var apiCallback = require('../models/apicallback')

var Items = {
    get: (req, res) => {
        let pathname = req._parsedUrl.pathname.split('/');
        let section = pathname[1];
        db.query('SELECT * FROM items WHERE id = ?', [req.params.id], 
        (err, result) => apiCallback(err, result, section, req, res)); 
    },
    create: (req, res) => {
        let pathname = req._parsedUrl.pathname.split('/');
        let section = pathname[1];
        db.query(
            'INSERT INTO items(title, list_id) VALUES (?, ?)',
            [req.body.title, req.body.list_id], (error, results) => {
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

                db.query('SELECT * FROM items WHERE id = ?', [results.insertId], function (err, results) {
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
        throw new Error('Not yet implemented');
    },
    delete: (req, res) => {
        let pathname = req._parsedUrl.pathname.split('/');
        let section = pathname[1];

        db.query('DELETE FROM items WHERE id = ?', [req.params.id],
        (err, result) => apiCallback(err, result, section, req, res));
    },
};
module.exports = Items;

//include the model (aka DB connection)
var db = require('../models/dbconnection');
var apiCallback = require('../models/apicallback')

//create class
var Items = {
    //function to query all items
    getAll: (req, res) => {
        let pathname = req._parsedUrl.pathname.split('/');
        let section = pathname[1];

        db.query('SELECT * from ??', [section], 
        (err, result) => apiCallback(err, result, section, req, res));
    },

    /**
     * Get single list
     */
    get: (req, res) => {
        let pathname = req._parsedUrl.pathname.split('/');
        let section = pathname[1];

        db.query('SELECT * from ?? WHERE id = ?', [section, req.params.id],
        (err, result) => apiCallback(err, result, section, req, res));
    },

    /**
     * Create new list.
     */
    create: (req, res) => {
        let pathname = req._parsedUrl.pathname.split('/');
        let section = pathname[1];
        db.query(
            'INSERT INTO lists(name) VALUES (?)',
            [req.body.name], (error, results) => {
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

                db.query('SELECT * FROM lists WHERE id = ?', [results.insertId], function (err, results) {
                    if (err) throw err;
                    let resultJson = JSON.stringify(results);
                    resultJson = JSON.parse(resultJson);
                    console.log(resultJson);
                    //add our JSON results to the data table
                    apiResult.data = resultJson;

                    //send JSON to Express
                    res.json(apiResult);
                });

            });
    },

    put: (req, res) => {
        let pathname = req._parsedUrl.pathname.split('/');
        let section = pathname[1]; 
        db.query('UPDATE ?? SET `name` = ? WHERE id = ?', [section, req.body.name, req.params.id],
        (err, result) => apiCallback(err, result, section, req, res));
    },
    delete: (req, res) => {
        let pathname = req._parsedUrl.pathname.split('/');
        let section = pathname[1];

        db.query('DELETE FROM ?? WHERE id = ?', [section, req.params.id], this.apiCallback);
    },
};
module.exports = Items;

//include the model (aka DB connection)
var db = require('../models/dbconnection');

//create class
var Items = {
    //function to query all items
    getAll: function (req, res) {
        //grab the site section from the req variable (/strains/)
        //console.log(req) to see all the goodies
        let pathname = req._parsedUrl.pathname.split('/');
        //split makes an array, so pick the second row
        let section = pathname[1];

        //query the DB using prepared statement
        db.query('SELECT * from ??', [section], function (error, results, fields) {
            //if error, print blank results
            if (error) {
                // console.log(error);
                var apiResult = {};

                apiResult.meta = {
                    table: section,
                    type: "collection",
                    total: 0
                }
                //create an empty data table
                apiResult.data = [];

                //send the results (apiResult) as JSON to Express (res)
                //Express uses res.json() to send JSON to client
                //you will see res.send() used for HTML
                res.json(apiResult);

            }

            //make results 
            var resultJson = JSON.stringify(results);
            resultJson = JSON.parse(resultJson);
            var apiResult = {};


            // create a meta table to help apps
            //do we have results? what section? etc
            apiResult.meta = {
                table: section,
                type: "collection",
                total: 1,
                total_entries: 0
            }

            //add our JSON results to the data table
            apiResult.data = resultJson;

            //send JSON to Express
            res.json(apiResult);
        });
    },
    create: (req, res) => {
        console.log(req.body);
        //grab the site section from the req variable (/strains/)
        //console.log(req) to see all the goodies
        let pathname = req._parsedUrl.pathname.split('/');
        //split makes an array, so pick the second row
        let section = pathname[1];
        const body = req.body;
        const result = db.query(
            'INSERT INTO items(title,list_id) VALUES (?,?)',
            [req.body.title, req.body.list_id], (error, results) => {
                //if error, print blank results
                if (error) {
                    // console.log(error);
                    var apiResult = {};

                    apiResult.meta = {
                        table: section,
                        type: "collection",
                        total: 0
                    }
                    //create an empty data table
                    apiResult.data = [];

                    //send the results (apiResult) as JSON to Express (res)
                    //Express uses res.json() to send JSON to client
                    //you will see res.send() used for HTML
                    res.json(error);

                }


                var apiResult = {};

                db.query('SELECT * FROM items WHERE id = ?', [results.insertId], function (err, results) {
                    if (err) throw err;
                    let resultJson = JSON.stringify(results);
                    resultJson = JSON.parse(resultJson);

                    //add our JSON results to the data table
                    apiResult.data = apiResult;

                    //send JSON to Express
                    res.json(apiResult);
                })


            });
    }
};
module.exports = Items;
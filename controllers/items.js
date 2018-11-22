
//include the model (aka DB connection)
var db = require('../models/dbconnection');
var apiCallback = require('../models/apicallback')

var Items = {
    get: (req, res) => {
        db.query(`
            SELECT items.id, items.list_id, items.title, items.completed
            FROM Lists
            INNER JOIN Items ON Lists.id=Items.list_id WHERE items.id = ? AND owner_id = ?`, 
            [req.params.id, req.user._id],
        (err, result) => apiCallback(err, result, 'lists', req, res));
    },
    create: (req, res) => {
        db.query(
            'INSERT INTO items(title, list_id, created_at) VALUES (?, ?, ?)',
            [req.body.title, req.body.list_id, new Date()], (error, results) => {
                db.query('SELECT * FROM items WHERE id = ?', [results.insertId], function (err, results) {
                    apiCallback(err, results, 'items', req, res);
                });
            });
    },
    put: (req, res) => {
        db.query('UPDATE items SET ? WHERE id = ?', 
                [req.body, req.params.id],
        (err, result) => apiCallback(err, result, 'items', req, res));
    },

    /**  
     * Get the items completed status.
     * Flips the boolean from 1/0 to 0/1 in the database.
     */
    setCompleted: (req, res) => {
        db.query('SELECT completed FROM items WHERE id = ?', 
        [req.params.id], (err, result)=> {
            const completed = result[0].completed === 0 ? 1 : 0;
            
            req.body.completed = completed;
            req.body.updated_at = new Date();

            db.query('UPDATE items SET ? WHERE id = ?', 
                    [req.body, req.params.id],
            (err, result) => apiCallback(err, result, 'items', req, res));
        })
    },
    delete: (req, res) => {
        let pathname = req._parsedUrl.pathname.split('/');
        let section = pathname[1];

        db.query('DELETE FROM items WHERE id = ?', [req.params.id],
        (err, result) => {
            
            db.query('SELECT * FROM items WHERE id = ?', [result.insertId], function (err, results) {
                apiCallback(err, results, 'items', req, res);
            });
        })
    },
};
module.exports = Items;
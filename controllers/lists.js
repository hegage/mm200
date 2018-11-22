
var db = require('../models/dbconnection');
var apiCallback = require('../models/apicallback')

var Lists = {
    // function to query all items
    getAll: (req, res) => {
        db.query('SELECT ??, ?? FROM ?? WHERE ?? = ? ', 
        ['id', 'name', 'lists', 'owner_id', req.user._id], 
        (err, result) => apiCallback(err, result, 'lists', req, res));
    },

    /**
     * Get single list
     */
    get: (req, res) => {
        db.query('SELECT ??, ?? from ?? WHERE id = ? AND owner_id=?', 
            ['name', 'id', 'lists', req.params.id, req.user._id],
            (err, result) =>  {

                if(err) { return res.json(JSON.stringify(err)); }

                var resultat = result;
                db.query('SELECT ??, ??, ??, ??, ??, ?? FROM items WHERE list_id = ?', 
                    ['id', 'title', 'created_at', 'due_date', 'completed', 'updated_at', req.params.id], 
                (err, result) => {
                    let extras = result;                
                    apiCallback(err, resultat, 'lists', req, res, extras);
                });

            })
    },

    /**
     * Create new list.
     */
    create: (req, res) => {
        db.query(
            'INSERT INTO lists(name, owner_id) VALUES (?, ?)',
            [req.body.name, req.user._id], (error, results) => {
                db.query('SELECT * FROM lists WHERE id = ?', [results.insertId], function (err, results) {
                    apiCallback(err, results, 'lists', req, res);
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
        db.query('DELETE FROM ?? WHERE id = ?', ['lists', req.params.id], 
        (err, result) => {
            apiCallback(err, result, 'lists', req, res)
        });
    },
};
module.exports = Lists;
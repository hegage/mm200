
var db = require('../models/dbconnection');
var apiCallback = require('../models/apicallback')

var Lists = {
    // function to query all items
    getAll: (req, res) => {
        db.query('SELECT ??, ?? FROM ?? WHERE ?? = ?',
            ['id', 'title', 'lists', 'owner_id', req.user._id],
            (err, result) => {
                if (typeof result === 'undefined') { return res.status(404).json({ failed: 'No lists found' }) }

                var lists = JSON.stringify(result);
                lists = JSON.parse(lists);
                let listIds = lists.map(list => list.id);

                db.query('SELECT ??, ??, ??, ??, ??, ?? FROM ?? WHERE list_id in(' + listIds.join(',') + ')',
                    ['id', 'title', 'list_id', 'completed', 'updated_at', 'created_at', 'items', listIds],
                    (err, response) => {
                        try {
                            let items = JSON.stringify(response);
                            items = JSON.parse(items)

                            const partitionedItems = items.reduce((prev, current) => {
                                if (prev.hasOwnProperty(current.list_id)) {
                                    prev[current.list_id].push(current);
                                    return prev;
                                } else {
                                    prev[current.list_id] = [current];
                                    return prev;
                                }
                            }, {});

                            Object.keys(partitionedItems).forEach(listId => {
                                lists.find(list => list.id == listId).items = partitionedItems[listId];
                            });

                            return res.json(lists);

                        } catch (err) {
                            return res.json({ err });
                        }
                    });
            });
    },

    /**
     * Get single list
     */
    get: (req, res) => {
        db.query('SELECT ??, ?? from ?? WHERE id = ? AND owner_id=?',
            ['title', 'id', 'lists', req.params.id, req.user._id],
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
            'INSERT INTO lists(title, owner_id) VALUES (?, ?)',
            [req.body.name, req.user._id], (error, results) => {
                db.query('SELECT * FROM lists WHERE id = ?', [results.insertId], function (err, results) {
                    apiCallback(err, results, 'lists', req, res);
                });
            });
    },

    put: (req, res) => {
        let pathname = req._parsedUrl.pathname.split('/');
        let section = pathname[1];
        db.query('UPDATE ?? SET `title` = ? WHERE id = ?', [section, req.body.name, req.params.id],
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
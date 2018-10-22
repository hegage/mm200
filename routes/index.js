'use strict';
module.exports = function (app) {
    var users = require('../controllers/users');
    var items = require('../controllers/items');
    var lists = require('../controllers/lists');

    app.route('/users/:id')
        .get(users.get)
        .put(users.put)
        .delete(users.delete);

    app.route('/users').post(users.create);


    app.route('/items/:id')
        .get(items.get)
        .put(items.put)
        .delete(items.delete);

    app.route('/items').post(items.create);


    // LISTS
    app.route('/lists')
        .get(lists.getAll)
        .post(lists.create);

    app.route('/lists/:id')
        .get(lists.get)
        .put(lists.put)
        .delete(lists.delete);
}
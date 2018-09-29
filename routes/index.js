'use strict';
module.exports = function (app) {
    var items = require('../controllers/items');
    var lists = require('../controllers/lists');

    app.route('/items').get(items.getAll);
    app.route('/items').post(items.create)



    // LISTS
    app.route('/lists').get(lists.getAll);
    app.route('/lists/:id').get(lists.get);
    app.route('/lists').post(lists.create);
    app.route('/lists/:id').put(lists.put);
    app.route('/lists/:id').delete(lists.delete);
}
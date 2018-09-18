
var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
var pgp        = require('pg-promise')();

var db = pgp('postgres://postgres:passord@localhost:5432/todo')


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;      

var router = express.Router();            

router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

/**
 * Get all lists.
 */
router.get('/lists', (req, res) => {
    db.query('SELECT name FROM lists.lists')
      .then(function (data) {
          return res.json( data )
      })
      .catch(function (error) {
        console.log('ERROR:', error)
      });
});
/**
 * Add new list item
 */
router.post('/lists', (req, res) => {
    db.one('INSERT INTO lists.lists(name) VALUES($1) RETURNING name', [req.body.name])
        .then(data => {
            console.log(data); // print new user id;
        })
        .catch(error => {
            console.log('ERROR:', error); // print error;
        });

})

app.use('/api', router);
app.listen(port);
console.log('Magic happens on port ' + port);

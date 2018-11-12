
const express = require('express');
const app = express();
const routes = require('./routes/index');
const bodyParser = require('body-parser');
var jwt = require('express-jwt');

const port = process.env.PORT || 4200;

app.use(bodyParser.json())
app.use(jwt({ secret: process.env.SECRET || 'UniCornsCannaeFly1337'}).unless({path: ['/login']}));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
routes(app);

app.listen(port);

console.log('Todo API server started on: ' + port);
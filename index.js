
const express = require('express');
const app = express();
const routes = require('./routes/index');
const bodyParser = require('body-parser');
const port = process.env.PORT || 4200;

app.use(bodyParser.json())


routes(app);

app.listen(port);

console.log('Todo API server started on: ' + port);
const express    = require('express');
const bodyparser = require('body-parser');
const cors       = require('cors');
const routes     = require('./routes/routes');
const jwt        = require('express-jwt');
const port       = process.env.PORT || 4200;
const app        = express();
app.use([cors(), jwt({ secret: process.env.SECRET || 'UniCornsCannaeFly1337'}).unless({path: ['/login', '/validate']})])
app.use(bodyparser.json())
routes(app);

app.listen(port);

console.log('Todo API server started on: ' + port);
const express    = require('express');
const bodyparser = require('body-parser');
const cors       = require('cors');
const routes     = require('./routes/routes');
const jwt        = require('express-jwt');
const port       = process.env.PORT || 4200;

const app        = express();
app.use([cors(), jwt({ secret: process.env.SECRET || 'UniCornsCannaeFly1337'}).unless({path: ['/login', '/validate']})])
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "https://todoappaanj-frontend.herokuapp.com");
    // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept", "Authorization");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');

    next();
});
app.use(bodyparser.json())
routes(app);

app.listen(port);

console.log('Todo API server started on: ' + port);

//include the model (aka DB connection)
var db = require('../models/dbconnection');
var apiCallback = require('../models/apicallback')
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

var Items = {
    login: (req, res) => {
        let pathname = req._parsedUrl.pathname.split('/');
        db.query('SELECT * FROM users WHERE email = ?', [req.body.email], (err, result) => {
            if(err){ throw err; }
            
            var foundUser = result[0];

            bcrypt.compare(req.body.password, foundUser.password, function(err, result){
                if(err) {
                    return res.status(401).json({
                        failed: 'Unauthorized Access'
                    });
                }
                if(result) {
                    const JWTToken = jwt.sign({
                        email: foundUser.email,
                        _id: foundUser.id
                      },
                      'UniCornsCannaeFly1337',
                       {
                         expiresIn: '2h'
                       });
                       return res.status(200).json({
                         success: 'Welcome to the JWT Auth',
                         token: JWTToken
                       });
                }
                return res.status(401).json({
                    failed: 'Unauthorized Access'
                });
            });
            
        })
    },
};
module.exports = Items;
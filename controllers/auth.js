
//include the model (aka DB connection)
var db = require('../models/dbconnection');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

var Auth = {
    login: (req, res) => {
        db.query('SELECT * FROM users WHERE email = ?', [req.body.email], (err, result) => {
            if(err){ throw Error(err); }

            var foundUser = result[0];
            // Make sure we dont kill the server if no user was found.
            if (!foundUser) {
                return res.status(403).json({
                    failed: "No user with the credentials you provided exists"
                })
            }

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
                      process.env.SECRET,
                       {
                         expiresIn: '2h'
                       });
                       return res.status(200).json({
                         token: JWTToken
                       });
                }
                return res.status(401).json({
                    failed: 'Unauthorized Access'
                });
            });

        })
    },
    validate: (req, res) => {
        if (req.headers.authorization.replace('Bearer ', '') === 'undefined' || req.headers.authorization === 'Bearer null') {
            return res.status(400).json({"message": "JWT malformed"})
        }

        jwt.verify(req.headers.authorization.replace('Bearer ', ''), 'UniCornsCannaeFly1337', (err, decoded) => {
            if (err) { return res.status(401).json({"valid": false}) }

            return res.status(200).json({"valid": true});
        });

    }
};
module.exports = Auth;
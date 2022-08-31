var pool = require('../../dbConfig');
const bcrypt = require('bcrypt');

var emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
function isEmailValid(email) {
    if (!email)
        return false;

    if(email.length>254)
        return false;

    var valid = emailRegex.test(email);
    if(!valid)
        return false;

    // Further checking of some things regex can't handle
    var parts = email.split("@");
    if(parts[0].length>64)
        return false;

    var domainParts = parts[1].split(".");
    if(domainParts.some(function(part) { return part.length>63; }))
        return false;

    return true;
}

module.exports = function(app, express){

    var registrationRouter = express.Router();
    
    registrationRouter.route('/register')
    .post((req, res)=>{

        let validationErrors = [];
        var emailID = req.body.emailID;
        var password = req.body.password;
        
        if(!isEmailValid(emailID) || !req.body.emailID)
            validationErrors.push("Enter valid Email ID");
        
        if(!req.body.password)
            validationErrors.push("Enter valid password");
        
        if(validationErrors.length > 0)
                res.status(406).send(validationErrors);
        else{
            hashedPassword = bcrypt.hashSync(password, 10);
            var query1 = `SELECT * FROM logincredentials WHERE (emailid = '${emailID}')`;
            pool.query(query1, (err1, res1) => {
                if(err1)
                    throw err1;
                else{
                    if(res1.rows.length > 0){
                        validationErrors.push("EmailID already exists");
                        res.status(406).send(validationErrors);
                    }
                    else{
                        var query2 = `INSERT INTO logincredentials (emailid, password) VALUES ('${emailID}', '${hashedPassword}')`;
                        pool.query(query2, (err2, res2) => {
                            if(err2)
                                res.send(err2);
                            else{
                                res.status(200).send({msg : "User registered successfully!"});
                            }
                        });
                    }
                }
            });
        }
    });

    return registrationRouter;
}
//$2b$10$zUDA2ZDupQWO0CrOInJz0uIvTHbhBOqj/0m.2vABocPtSXmXg9Nr6
//$2b$10$QHJ6MisIBJA80FuZOZ.RNOhyRDd3lz8IjLMKRmlZYiizRppAOKzuu
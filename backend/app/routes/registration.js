var pool = require('../../dbConfig');
const bcrypt = require('bcrypt');
const e = require('express');

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
function checkdepartment(department){
    if(!department)
        return false;
    else if(department == 'CSE' || department == 'CCE' || department == 'MME' || department == 'ECE' || department == 'Non Academic')
        return true;
    return false;
}
function checkrole(role){
    if(!role)
        return false;
    else if(role == 'teachingstaff' || role == 'hod' || role == 'dofa' || role == 'director' || role == 'hos' || role == 'non_teachingstaff' || role == 'registrar')
        return true;
    return false;
}
function isUserNameValid(username) {

    const res = /^[A-Z\sa-z0-9_\.]+$/.exec(username);
    const valid = !!res;
    return valid;
}

module.exports = function(app, express){

    var registrationRouter = express.Router();
    
    registrationRouter.route('/register')
    .post((req, res)=>{

        let validationErrors = [];
        var emailID = req.body.emailID;
        var password = req.body.password;
        var username = req.body.username;
        var role = req.body.role;
        var department = req.body.department;

        if(!isEmailValid(emailID) || !req.body.emailID)
            validationErrors.push("Enter valid Email ID");
        if(!req.body.password)
            validationErrors.push("Enter valid password");
        if(!isUserNameValid(username))
            validationErrors.push("Invaild Username");
        if(!checkdepartment(department))
            validationErrors.push("Invalid Department");
        if(!checkrole(role))
            validationErrors.push("Invaild Role");

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
                                var query3 = `INSERT INTO userdetails (emailid, username, role, department) VALUES ('${emailID}', '${username}', '${role}', '${department}')`;
                                pool.query(query3, (err3, res3) => {
                                    if(err3)
                                        throw err3;
                                    else{
                                        var query4 = `INSERT INTO leavesCount (emailid) VALUES ('${emailID}')`;
                                        pool.query(query4, (err4, res4) =>{
                                            if(err4)
                                                throw err4;
                                            else{
                                                res.status(200).send({msg : "User registered successfully!"});
                                            }
                                        })
                                     
                                    }
                                });
                            }
                        });
                    }
                }
            });
        }
    });

    return registrationRouter;
}
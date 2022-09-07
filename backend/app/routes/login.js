var pool = require('../../dbConfig');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = function(app, express){

    var loginRouter = express.Router();

    loginRouter.route('/authentication')
    .post((req, res) =>{

        let validationErrors = [];
        var emailID = req.body.emailID;
        var password = req.body.password;
        if(!emailID)
            validationErrors.push("Enter valid emailID");
        if(!password)
            validationErrors.push("Enter valid password");
        
        if(validationErrors.length > 0)
            res.status(406).send(validationErrors);
        else{
            var query1 = `SELECT * FROM logincredentials WHERE (emailid = '${emailID}')`;
            pool.query(query1, (err1, res1) => {
                if(err1)
                    throw err1;
                else{
                    if(res1.rowCount == 0){
                        validationErrors.push("Entered emailID doesn't exists");
                        res.status(406).send(validationErrors);
                    }
                    else{
                        hashedpassword = res1.rows[0].password;
                        var check = bcrypt.compareSync(password, hashedpassword);
                        if(check == false){
                            validationErrors.push("Incorrect password");
                            res.status(406).send(validationErrors);
                        }
                        else{
                            var query2 = `SELECT * FROM userdetails WHERE (emailid = '${emailID}')`;
                            pool.query(query2, (err2, res2) =>{
                                if(err2)
                                    throw err2;
                                else{   
                                    const user = {
                                        user : emailID,
                                        username : res2.rows[0].username,
                                        role : res2.rows[0].role,
                                        department : res2.rows[0].department
                                    }
                                    jwt.sign({user}, 'secretKeyLMS', (err, token) => {
                                            res.status(200).send({msg : "Login Successfully",
                                            token : token
                                        });
                                    });
                                }
                            }) 
                            //res.status(200).send({msg : "Login successfully"});
                        }
                    }
                }
            })
        }
    });
    return loginRouter;

}
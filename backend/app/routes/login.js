var pool = require('../../dbConfig');
const bcrypt = require('bcrypt');
const { query } = require('express');

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
                        //console.log(hashedpassword);
                        var check = bcrypt.compareSync(password, hashedpassword);
                        if(check == false){
                            validationErrors.push("Incorrect password");
                            res.status(406).send(validationErrors);
                        }
                        else{
                            res.status(200).send({msg : "Login successfully"});
                        }
                    }
                }
            })
        }


    });

    return loginRouter;

}
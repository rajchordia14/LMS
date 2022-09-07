var pool = require('../../dbConfig');
const jwt = require('jsonwebtoken');
const verifyToken = require('../middleware/auth');
module.exports = function(app, express){
    
    var leavesCountRouter = express.Router();
    leavesCountRouter.route('/leavesCounts')
    .post(verifyToken, async (req, res) => {
        
        var emailID = req.user.user.user;
        //console.log(emailID);
        var query = `SELECT * FROM leavescount WHERE (emailid = '${emailID}')`;
        pool.query(query, (err2, result) =>{
            if(err2)
                throw err2;
            else{
                if(result.rowCount == 0){
                    res.status(406).send({msg : "Error in leavescount api"});
                }
                else{
                    res.status(200).send({
                        emailID : emailID,
                        casualleaves : result.rows[0].casual,
                        privilegeleaves : result.rows[0].privilege,
                        specialleaves : result.rows[0].special,
                        ondutyleaves : result.rows[0].onduty
                    });
                }
            }
        });
    });

    return leavesCountRouter;
}
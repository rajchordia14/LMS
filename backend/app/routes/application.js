var pool = require('../../dbConfig');
const jwt = require('jsonwebtoken');
const verifyToken = require('../middleware/auth');
const { query } = require('express');

function convertdate(input){
    const date = new Date(input);
    const result_date = date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate();
    return result_date;
}

module.exports = function(app, express){

    var applicationRouter = express.Router();

    applicationRouter.route('/newApplication')
    .post(verifyToken, async(req, res) =>{

        var emailID = req.body.emailID;
        var leaveType = req.body.leaveType;
        var numberOfDays = req.body.numberofDays;
        var reason = req.body.reason;
        var startdate = convertdate(req.body.startdate);
        var enddate = convertdate(req.body.enddate);
        
        let validationErrors = [];
        if(!emailID || !leaveType || !numberOfDays || !reason || !startdate || !enddate){
            validationErrors.push("Invalid Request");
        }
        if(validationErrors.length > 0){
            res.status(406).send(validationErrors);
        }
        else{

            var role = req.user.user.role;
            var department = req.user.user.department;
            var username = req.user.user.username;
            var authroity;

            if(role == 'teachingstaff')
                authroity = 'hod';
            else if(role == 'hod')
                authroity = 'dofa';
            else if(role == 'dofa')
                authroity = 'director';
            else if(role == 'non_teachingstaff')
                authroity = 'hos';
            else if(role == 'hos')
                authroity = 'registrar';

            var query1 = `INSERT INTO applications (emailid, type, startdate, enddate, numberofdays, status, reason, appwith) VALUES ('${emailID}','${leaveType}', '${startdate}'::date, '${enddate}'::date, '${numberOfDays}', 
            'pending', '${reason}', '${authroity}')`;

            pool.query(query1, (err, result) => {
                if(err)
                    throw err;
                else{
                    res.status(200).send({msg: "application sent successfully!"});
                }    
            });
        }   
    });
    
    return applicationRouter;
};
const { application } = require('express');

module.exports = function(app, express){

    var apiRouter = express.Router();

    apiRouter.get('/',(req, res)=>{
        res.json({message: "Welcome to LMS"});
    });

    return apiRouter;

}
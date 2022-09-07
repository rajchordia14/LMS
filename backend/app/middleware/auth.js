const jwt = require("jsonwebtoken");
const verifyToken = (req, res, next) => {
    
    const bearerHeader = req.headers['authorization'];
    if(typeof(bearerHeader) != 'undefined'){
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        if(!bearerToken)
            return res.status(403).send("A token is required for authentication");
        try{
            const decoded = jwt.verify(bearerToken, 'secretKeyLMS');
            req.user = decoded;
        }
        catch (err){
            return res.status(401).send("Invalid Token");
        }
        return next();
    }
    else{
        res.sendStatus(403).send("A token is required for authentication");
    }
}   

module.exports = verifyToken;
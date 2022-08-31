var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var path        = require('path');
var config      = require('./config');
const exp = require('constants');



app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.use(function(req, res, next){
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization');
    next();
})

app.use(express.static(__dirname + '/public'));

var apiRoutes = require('./app/routes/api')(app, express);
app.use('/api', apiRoutes);

var register = require('./app/routes/registration')(app, express);
app.use('/auth', register);

var login = require('./app/routes/login')(app, express);
app.use('/login', login);

app.listen(config.port);
console.log('Listening on port ' + config.port);
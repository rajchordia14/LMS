var express     = require('express');
var app         = app();
var bodyPraser  = require('body-praser');
var path        = require('path');
var config      = require('./config');


app.use(bodyPraser.urlencoded({extended : true}));
app.use(bodyPraser.json());

app.use(express.static(__dirname + '/public'));




app.listen(config.port);
console.log('Listening on port' + config.port);
'use strict';

var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var users = require("./user-db").create();

var PORT = 3000 || process.env.PORT;

app.use(bodyParser.json());

// get all users
// app.get("/users", function (req, res) {
//     res.status(200).send({ users: users.getAll() });
// });

// REGISTRATION
app.post("/users", function (req, res) {
    users.createUser(req.body, function(err, data) {
        if (err) res.status(400).send({ error : err });
        else res.status(200).send({ token : data });
    });
});

// SEND MESSAGE
app.post("/users/:username/messages", function (req, res) {
    var token = req.get('X-Auth');
    var isTokenValid = users.isTokenValid(token);
    
    if(!token || !isTokenValid) {
        res.status(401).send({ error : "User is not authorized" });
    } else {
        var params = {
            token : token,
            username : req.params.username,
            message : req.body
        };
        users.sendMessageToUser(params, function(err, data) {
            if(err) res.status(404).send({ error : err });
            else res.status(202).send(data);
        });
    }
});

//READ MESSAGE
app.get("/users/:username/messages", function (req, res) {
    var token = req.get('X-Auth');
    var isTokenValid = users.isTokenValid(token);
    
    if(!token || !isTokenValid) {
        res.status(401).send({ error : "User is not authorized" });
    } else {
        var params = {
            token : token,
            username : req.params.username
        };
        users.readUserMessages(params, function(err, data) {
            if(err) res.status(403).send({ error : err });
            else res.status(200).send(data);
        });
    }
});

app.listen(PORT, function () {
    console.log("test on port: ", PORT);
});
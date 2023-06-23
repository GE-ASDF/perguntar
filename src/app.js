const express = require("express");
const body = require("body-parser");
const session = require("express-session");
const flash = require("connect-flash");
const {check, validationResult} = require("express-validator");
const app = express();
const port = 3000;

app.use(body.urlencoded({extended: false}));
app.use(body.json());

app.use(session({
    secret:'flashblog',
    saveUninitialized: true,
    resave: true
}));

app.use(flash())
app.set("view engine", "ejs");
app.use(express.static("public"));

app.listen(port, (err)=>{
    if(err == null){
        console.log("Servidor rodando");
    }else{
        console.log("Servidor não está rodando")
    }
})

module.exports = {check, validationResult, body, app};
const { Sequelize } = require("sequelize");
const dot = require("dotenv").config();
const connection = new Sequelize('', '', '',{
    host: "",
    dialect: "mysql",
    dialectOptions:{
        ssl:{
            rejectUnauthorized:true,
        } 
    }
})

module.exports = connection;
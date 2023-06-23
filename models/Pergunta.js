const Sequelize = require("sequelize")
const connection = require("../core/Model");

const Pergunta = connection.define('pergunta',
    {
        titulo:{
            type: Sequelize.STRING,
            allowNull: false,
        },
        pergunta:{
            type:Sequelize.TEXT,
            allowNull:false
        }
    }
);

Pergunta.sync({force: false}).then(()=>{
    console.log("Tabela criada")
});

module.exports = Pergunta;
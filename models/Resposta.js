const Sequelize = require("sequelize");
const connection = require("../core/Model");

const Resposta = connection.define("respostas", {
    idpergunta:{
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    corpo: {
        type: Sequelize.TEXT,
        allowNull: false,
    }
})
Resposta.sync({force: false}).then(()=>{
    console.log("A tabela de respostas foi criada.");
})

module.exports = Resposta;
const { app, port, body, check, validationResult } = require("./src/app");
const connection = require("./core/Model")
const Pergunta = require("./models/Pergunta");
connection
.authenticate()
.then(()=>{
    console.log("Conexão feita com sucesso")
}).catch((err)=>{
    console.log(err)
})
app.get("/", (req, res)=>{
    res.render("index");
})

app.get("/perguntar", (req, res)=>{
    res.render("pages/perguntar", {
        success: req.flash("success"),
        error: req.flash("error"),
        titulo: req.flash("titulo"),
        pergunta: req.flash("pergunta"),
    });
});

app.post("/fazer-pergunta",[
    check('titulo').notEmpty().isLength({min:4}).trim().escape().withMessage("O campo é obrigatório e deve conter no mínimo 4 caracteres."),
    check('pergunta').notEmpty().isLength({min:4, max:255}).trim().escape().withMessage("O campo é obrigatório e deve conter no mínimo 4 caracteres."),
], (req, res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        errors.errors.forEach((erro)=>{
            req.flash(erro.path, erro.msg)
        })
        res.redirect("/perguntar");
        return;
    }
    const titulo = req.body.titulo;
    const pergunta = req.body.pergunta;
    Pergunta.create({
        titulo,
        pergunta
    }).then(()=>{
        req.flash('success', "Parabéns! A sua pergunta foi feita com sucesso!");
        res.redirect("/perguntar");
        return;
    }).catch(()=>{
        req.flash('error', "Houve um erro na hora de fazer sua pergunta. Tente novamente!");
        res.redirect("/perguntar");
        return;
    })
    
})





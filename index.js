const { app, body, check, validationResult } = require("./src/app");
const connection = require("./core/Model")
const Pergunta = require("./models/Pergunta");
const Resposta = require("./models/Resposta");
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

app.get("/perguntas-feitas", (req, res)=>{
   Pergunta.findAll({ raw: true, order:
    [
        ['id','DESC']
    ] 
    }).then(perguntas => {
        res.render("pages/perguntas-feitas", { perguntas, id: req.flash('id'), error: req.flash("error") });
    });
})

app.get("/pergunta/:id",[
    check('id').notEmpty().isInt().escape().withMessage("A pergunta não foi encontrada."),
],(req, res)=>{
    const id = req.params.id;
    Pergunta.findOne({
        where: {id: id}
    }).then((pergunta)=>{
        if(pergunta != undefined){
            Resposta.findAll({
                where: {idpergunta: pergunta.id},
                order: [['id','DESC']]
            }).then((respostas)=>{
                res.render("pages/pergunta", { 
                    pergunta, 
                    respostas,
                    success:req.flash("success"), 
                    error:req.flash('error'),
                    corpo: req.flash("corpo"),
                 })
            })
        }else{
            req.flash("error", "Pergunta não encontrada.");
            res.redirect("/perguntas-feitas");
            return;
        }
    })
})

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

app.post("/responder-pergunta", [
    check("idpergunta").notEmpty().isInt().trim().escape().withMessage("Não foi possível responder a pergunta."),
    check("corpo").notEmpty().isLength({min:4, max:1024}).trim().escape().withMessage("Este campo é obrigatório e seu valor deve ser no mínimo 4 caracteres e no máximo 1024."),
], (req, res)=>{
    const errors = validationResult(req)
    const idpergunta = req.body.idpergunta;
    const corpo = req.body.corpo;
    if(!errors.isEmpty()){
        errors.errors.forEach((erro)=>{
            req.flash(erro.path, erro.msg)
        })
        if(idpergunta){
            res.redirect(`/pergunta/${idpergunta}`)
            return;
        }
        res.redirect(`/perguntas-feitas`);
        return;
    }
    Resposta.create({
        idpergunta,
        corpo,
    }).then(()=>{
        req.flash('success', "Parabéns! A sua resposta foi registrada.");
        res.redirect(`/pergunta/${idpergunta}`);
        return;
    }).catch(()=>{
        req.flash('error', "Houve um erro na hora de responder a pergunta. Tente novamente!");
        res.redirect(`/pergunta/${idpergunta}`);
        return;
    })
})





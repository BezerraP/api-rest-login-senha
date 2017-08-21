var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Usuario = require('./app/models/usuario');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.use(express.static('views'));

var db_url = 'mongodb://admin:071298@ds149603.mlab.com:49603/bezerra-web-mongo';

mongoose.connect(db_url, (err, db) => {

  if (err)
  {
    console.log(err);
  }else {
    console.log('Conectado ao Banco de Dados');
  }

  app.listen(3000, function() {
    console.log('Incializado na porta 3000');

    var router = express.Router();

    router.use((req, res, next) => {
      console.log('Movimentação no Server');
      next();
    });

    router.get('/', (req, res) => {
      console.log('GET Inicial');
    });

    router.route('/usuarios')

    .post((req, res) => {
      var usuario = new Usuario();

      usuario.nome = req.body.nome;
      usuario.login = req.body.login;
      usuario.senha = req.body.senha;

      usuario.save((err) => {
        if (err)
        {
          console.log(err);
        }
        console.log('Post Usuario');
        res.redirect('/api/usuarios');
      });
    })

    .get((req, res) => {
      Usuario.find((err, usuarios) => {
        if (err)
        {
          console.log(err);
        }
        //res.json(usuarios);
        res.render('index.ejs', {dados: usuarios});
      });
    });

    router.route('/usuarios/:usuario_id')

    .get((req, res) => {
      /*Usuario.findById(req.params.usuario_id, (err, usuario) => {
        if (err)
        {
          console.log(err);
        }
        res.json(usuario);
      });*/
      console.log('Excluido: ', req.params.usuario_id);
      Usuario.remove({_id: req.params.usuario_id}, (err) => {
        if (err)
        {
          console.log(err);
        }
        res.redirect('/api/usuarios');
      });
    })

    .put((req, res) => {
      Usuario.findById(req.params.usuario_id, (err, usuario) => {
        if (err)
        {
          console.log(err);
        }

        usuario.nome = req.body.nome;
        usuario.login = req.body.login;
        usuario.senha = req.body.senha;

        usuario.save((err) => {
          if (err)
          {
            console.log(err);
          }
          res.json({message: 'Usuário atualizado'});
        });
      });
    })

    .delete((req, res) => {
      Usuario.remove({_id: req.params.usuario_id}, (err) => {
        if (err)
        {
          console.log(err);
        }
        res.json({message: 'Usuário excluido com sucesso'});
      });
    });

    router.route('/usuarios/modificar/:usuario_id')

    .get((req, res) => {
      Usuario.findById(req.params.usuario_id, (err, usuario) => {
        if (err)
        {
          console.log(err);
        }
        //res.json(usuarios);
        console.log(usuario);
        res.render('modify.ejs', {dados: usuario});
      });
    })

    .post((req, res) => {
      Usuario.findById(req.params.usuario_id, (err, usuario) => {
        if (err)
        {
          console.log(err);
        }

        usuario.nome = req.body.nome;
        usuario.login = req.body.login;
        usuario.senha = req.body.senha;

        usuario.save((err) => {
          if (err)
          {
            console.log(err);
          }
          console.log('Atualizado: ', usuario._id);
          res.redirect('/api/usuarios');
        });
      });
    });

    app.use('/api', router);
  });
});

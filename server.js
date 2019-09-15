// biblioteca js que faz o mapeamento das pastas em função do server.js
require('rootpath')(); 
// Inicialização do express. Notem que fiz aqui uma modificação do projeto original. criei duas variáveis de express
// separando de vez api e app. Em um desenvolvimento mais sofisticado, onde você deseje fazer balanceamento de carga
// separadamente para cada ponto da solução, você teria que criar dois server.js e quebrar de vez a aplicação
var express = require('express');
var app = express();
// Inicializando o gerenciamento de sessão. Iremos usar esse gerenciamento para armazenar o token da API e o userID logado.
var session = require('express-session');
// bibloteca que ajuda no parse de mensagens requisitadas que contém JSON
var bodyParser = require('body-parser');

// carrega as configurações mapeadas no json
var config = require('config.json');
// faz a leitura da porta que será utilizada para o app
var port = process.env.PORT || 8092;

// Inicialização do express do App. 
// A primeira linha já trata a questão falada no dia 21/02, sobre diretórios com conteúdo estático.
// Isso irá permitir que não façamos referência ao bootstrap e outras bibliotecas vindas da internet
app.use(express.static( __dirname + '/libs/'));

// Aqui existe uma configuração da camada visão criada pelo express.
// Duas configurações estão sendo feitas
// a engine de tratamento de visões usa arquivos .ejs
// a pasta com as visões se encontra em views
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Parametrização que indica o uso de json no body para transferir dados de uma camada para a outra
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// indicação dos parâmetros de sessão
app.use(session({ secret: config.secret, resave: false, saveUninitialized: true }));

// Aqui o mapemanto das rotas da aplicação. Todos esses mapeamentos fazem parte da aplicação
// A cada require, o js é inicializado
app.use('/login', require('./controllers/login.controller'));
app.use('/register', require('./controllers/register.controller'));
app.use('/app', require('./controllers/app.controller'));

// configuração do redirecionamento inicial é isso que indica o que vai acontecer quando for feita a chamada do 
// http://localhost:8092. Nesse caso, a aplicação será direcionada para 
app.get('/', function (req, res) {
    return res.redirect('/app');
});

// Por fim, a inicialização dos dois servers. O primeiro do app e o segundo para a API
// start server
var server = app.listen(port, function () {
    console.log('Server listening at http://' + server.address().address + ':' + server.address().port);
});
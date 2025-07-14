const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const turmasRoutes = require('./routes/turmas');
const alunosRoutes = require('./routes/alunos');

const app = express();

// Configurações
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Rotas
app.use('/turmas', turmasRoutes);
app.use('/alunos', alunosRoutes);

app.get('/', (req, res) => {
    res.render('index');
});

// Iniciar servidor
app.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
});


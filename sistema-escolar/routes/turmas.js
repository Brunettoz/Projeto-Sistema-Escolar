const express = require('express');
const router = express.Router();
const db = require('../database/db');

// Listar todas as turmas
router.get('/', (req, res) => {
    db.all('SELECT * FROM turmas', (err, rows) => {
        if (err) return res.send("Erro ao listar turmas");
        res.render('turmas/form', { turma: row, erro: null });
    });
});

// Formulário de nova turma
router.get('/nova', (req, res) => {
    res.render('turmas/form', { turma: {}, erro: null });
});

// Cadastrar nova turma
router.post('/nova', (req, res) => {
    const { nome, ano } = req.body;
    const query = 'INSERT INTO turmas (nome, ano) VALUES (?, ?)';
    
    db.run(query, [nome, ano], function(err) {
        if (err) {
            return res.render('turmas/form', {
                turma: { nome, ano },
                erro: err.message.includes('UNIQUE') ? 'Turma com esse nome e ano já existe!' : 'Erro ao salvar turma.'
            });
        }
        res.redirect('/turmas');
    });
});


// Formulário de edição
router.get('/editar/:id', (req, res) => {
    db.get('SELECT * FROM turmas WHERE id = ?', [req.params.id], (err, row) => {
        if (err) return res.send("Erro ao buscar turma");
        res.render('turmas/form', { turma: row });
    });
});

// Atualizar turma
router.post('/editar/:id', (req, res) => {
    const { nome, ano } = req.body;
    db.run('UPDATE turmas SET nome = ?, ano = ? WHERE id = ?', [nome, ano, req.params.id], (err) => {
        if (err) return res.send("Erro ao atualizar turma");
        res.redirect('/turmas');
    });
});

// Excluir turma
router.get('/excluir/:id', (req, res) => {
    db.run('DELETE FROM turmas WHERE id = ?', [req.params.id], (err) => {
        if (err) return res.send("Erro ao excluir turma");
        res.redirect('/turmas');
    });
});

module.exports = router;
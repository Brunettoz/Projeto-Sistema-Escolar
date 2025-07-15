const express = require('express');
const router = express.Router();
const db = require('../database/db');

// Listar alunos
router.get('/', (req, res) => {
    const query = `
        SELECT alunos.*, turmas.nome AS turma_nome
        FROM alunos
        JOIN turmas ON alunos.turma_id = turmas.id
    `;
    db.all(query, (err, rows) => {
        if (err) return res.send("Erro ao listar alunos.");
        res.render('alunos/lista', { alunos: rows });
    });
});

// Formulário novo aluno
router.get('/novo', (req, res) => {
    db.all('SELECT * FROM turmas', (err, turmas) => {
        if (err) return res.send("Erro ao carregar turmas.");
        res.render('alunos/form', { aluno: {}, turmas, erro: null });
    });
});

// Cadastrar aluno
router.post('/novo', (req, res) => {
    const { nome, matricula, turma_id } = req.body;
    const query = 'INSERT INTO alunos (nome, matricula, turma_id) VALUES (?, ?, ?)';
    
    db.run(query, [nome, matricula, turma_id], function(err) {
        if (err) {
            db.all('SELECT * FROM turmas', (err2, turmas) => {
                return res.render('alunos/form', {
                    aluno: { nome, matricula, turma_id },
                    turmas,
                    erro: err.message.includes('UNIQUE') ? 'Matrícula já cadastrada!' : 'Erro ao cadastrar aluno.'
                });
            });
        } else {
            res.redirect('/alunos');
        }
    });
});

// Editar aluno
router.get('/editar/:id', (req, res) => {
    db.get('SELECT * FROM alunos WHERE id = ?', [req.params.id], (err, aluno) => {
        if (err || !aluno) return res.send("Erro ao buscar aluno.");
        db.all('SELECT * FROM turmas', (err2, turmas) => {
            if (err2) return res.send("Erro ao carregar turmas.");
            res.render('alunos/form', { aluno, turmas, erro: null });
        });
    });
});

// Atualizar aluno
router.post('/editar/:id', (req, res) => {
    const { nome, matricula, turma_id } = req.body;
    db.run(
        'UPDATE alunos SET nome = ?, matricula = ?, turma_id = ? WHERE id = ?',
        [nome, matricula, turma_id, req.params.id],
        (err) => {
            if (err) return res.send("Erro ao atualizar aluno.");
            res.redirect('/alunos');
        }
    );
});

// Excluir aluno
router.get('/excluir/:id', (req, res) => {
    db.run('DELETE FROM alunos WHERE id = ?', [req.params.id], (err) => {
        if (err) return res.send("Erro ao excluir aluno.");
        res.redirect('/alunos');
    });
});

module.exports = router;

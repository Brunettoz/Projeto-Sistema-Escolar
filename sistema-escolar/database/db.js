const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./sistema.db');

//TURMAS//

db.serialize(() => {
    db.run(`
    CREATE TABLE IF NOT EXISTS turmas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        ano INTEGER NOT NULL,
        UNIQUE(nome, ano)
    )
    `);

//ALUNOS//

   db.run(`
    CREATE TABLE IF NOT EXISTS alunos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        matricula TEXT NOT NULL UNIQUE,
        turma_id INTEGER NOT NULL,
        FOREIGN KEY (turma_id) REFERENCES turmas(id)
    )
    `);
});

module.exports = db;
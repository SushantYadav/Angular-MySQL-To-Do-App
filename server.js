const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

/* MySQL Connection */
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'todo_app'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL');
});

/* API to get all tasks */
app.get('/tasks', (req, res) => {
    const sql = 'SELECT * from tasks';
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});

/* API to add a new task */
// POST route to add a new task
app.post('/tasks', (req, res) => {
    const { description } = req.body;
    if (!description) {
        return res.status(400).json({ error: 'Description is required' });
    }
    const sql = 'INSERT INTO tasks (description) VALUES (?)';
    db.query(sql, [description], (err, result) => {
        if (err) throw err;
        res.json({ id: result.insertId, description, completed: false });
    });
});

/* DELETE route to delete a task by ID */
app.delete('/tasks/:id', (req, res) => {
    const taskId = req.params.id;
    const sql = 'DELETE FROM tasks WHERE id = ?';

    db.query(sql, [taskId], (err, result) => {
        if (err) throw err;
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.json({ message: 'Task deleted Successfully' });
    });
});

/* Start the server */
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
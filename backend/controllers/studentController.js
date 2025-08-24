const pool = require('../config/db');

exports.getAllStudents = async (req, res) => {
	try {
		const conn = await pool.getConnection();
		const rows = await conn.query('SELECT * FROM students');
		conn.release();
		res.json(rows);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

exports.getStudentById = async (req, res) => {
	try {
		const conn = await pool.getConnection();
		const rows = await conn.query('SELECT * FROM students WHERE id = ?', [req.params.id]);
		conn.release();
		if (rows.length === 0) return res.status(404).json({ error: 'Student not found' });
		res.json(rows[0]);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

exports.createStudent = async (req, res) => {
	try {
		const { name, email, password } = req.body;
		const conn = await pool.getConnection();
		const result = await conn.query('INSERT INTO students (name, email, password) VALUES (?, ?, ?)', [name, email, password]);
		conn.release();
		res.status(201).json({ id: result.insertId, name, email });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

exports.updateStudent = async (req, res) => {
	try {
		const { name, email, password } = req.body;
		const conn = await pool.getConnection();
		const result = await conn.query('UPDATE students SET name = ?, email = ?, password = ? WHERE id = ?', [name, email, password, req.params.id]);
		conn.release();
		if (result.affectedRows === 0) return res.status(404).json({ error: 'Student not found' });
		res.json({ id: req.params.id, name, email });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

exports.deleteStudent = async (req, res) => {
	try {
		const conn = await pool.getConnection();
		const result = await conn.query('DELETE FROM students WHERE id = ?', [req.params.id]);
		conn.release();
		if (result.affectedRows === 0) return res.status(404).json({ error: 'Student not found' });
		res.json({ message: 'Student deleted' });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

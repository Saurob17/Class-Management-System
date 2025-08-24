const pool = require('../config/db');

exports.getAllResults = async (req, res) => {
	try {
		const conn = await pool.getConnection();
		const rows = await conn.query('SELECT * FROM results');
		conn.release();
		res.json(rows);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

exports.getResultById = async (req, res) => {
	try {
		const conn = await pool.getConnection();
		const rows = await conn.query('SELECT * FROM results WHERE id = ?', [req.params.id]);
		conn.release();
		if (rows.length === 0) return res.status(404).json({ error: 'Result not found' });
		res.json(rows[0]);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

exports.createResult = async (req, res) => {
	try {
		const { studentId, courseId, marks } = req.body;
		const conn = await pool.getConnection();
		const result = await conn.query('INSERT INTO results (studentId, courseId, marks) VALUES (?, ?, ?)', [studentId, courseId, marks]);
		conn.release();
		res.status(201).json({ id: result.insertId, studentId, courseId, marks });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

exports.updateResult = async (req, res) => {
	try {
		const { studentId, courseId, marks } = req.body;
		const conn = await pool.getConnection();
		const result = await conn.query('UPDATE results SET studentId = ?, courseId = ?, marks = ? WHERE id = ?', [studentId, courseId, marks, req.params.id]);
		conn.release();
		if (result.affectedRows === 0) return res.status(404).json({ error: 'Result not found' });
		res.json({ id: req.params.id, studentId, courseId, marks });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

exports.deleteResult = async (req, res) => {
	try {
		const conn = await pool.getConnection();
		const result = await conn.query('DELETE FROM results WHERE id = ?', [req.params.id]);
		conn.release();
		if (result.affectedRows === 0) return res.status(404).json({ error: 'Result not found' });
		res.json({ message: 'Result deleted' });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

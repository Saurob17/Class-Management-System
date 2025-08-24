const pool = require('../config/db');

exports.getAllCourses = async (req, res) => {
	try {
		const conn = await pool.getConnection();
		const rows = await conn.query('SELECT * FROM courses');
		conn.release();
		res.json(rows);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

exports.getCourseById = async (req, res) => {
	try {
		const conn = await pool.getConnection();
		const rows = await conn.query('SELECT * FROM courses WHERE id = ?', [req.params.id]);
		conn.release();
		if (rows.length === 0) return res.status(404).json({ error: 'Course not found' });
		res.json(rows[0]);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

exports.createCourse = async (req, res) => {
	try {
		const { name, description } = req.body;
		const conn = await pool.getConnection();
		const result = await conn.query('INSERT INTO courses (name, description) VALUES (?, ?)', [name, description]);
		conn.release();
		res.status(201).json({ id: result.insertId, name, description });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

exports.updateCourse = async (req, res) => {
	try {
		const { name, description } = req.body;
		const conn = await pool.getConnection();
		const result = await conn.query('UPDATE courses SET name = ?, description = ? WHERE id = ?', [name, description, req.params.id]);
		conn.release();
		if (result.affectedRows === 0) return res.status(404).json({ error: 'Course not found' });
		res.json({ id: req.params.id, name, description });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

exports.deleteCourse = async (req, res) => {
	try {
		const conn = await pool.getConnection();
		const result = await conn.query('DELETE FROM courses WHERE id = ?', [req.params.id]);
		conn.release();
		if (result.affectedRows === 0) return res.status(404).json({ error: 'Course not found' });
		res.json({ message: 'Course deleted' });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

const pool = require('../config/db');

exports.getAllResources = async (req, res) => {
	try {
		const conn = await pool.getConnection();
		const rows = await conn.query('SELECT * FROM resources');
		conn.release();
		res.json(rows);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

exports.getResourceById = async (req, res) => {
	try {
		const conn = await pool.getConnection();
		const rows = await conn.query('SELECT * FROM resources WHERE id = ?', [req.params.id]);
		conn.release();
		if (rows.length === 0) return res.status(404).json({ error: 'Resource not found' });
		res.json(rows[0]);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

exports.createResource = async (req, res) => {
	try {
		const { title, url, description } = req.body;
		const conn = await pool.getConnection();
		const result = await conn.query('INSERT INTO resources (title, url, description) VALUES (?, ?, ?)', [title, url, description]);
		conn.release();
		res.status(201).json({ id: result.insertId, title, url, description });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

exports.updateResource = async (req, res) => {
	try {
		const { title, url, description } = req.body;
		const conn = await pool.getConnection();
		const result = await conn.query('UPDATE resources SET title = ?, url = ?, description = ? WHERE id = ?', [title, url, description, req.params.id]);
		conn.release();
		if (result.affectedRows === 0) return res.status(404).json({ error: 'Resource not found' });
		res.json({ id: req.params.id, title, url, description });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

exports.deleteResource = async (req, res) => {
	try {
		const conn = await pool.getConnection();
		const result = await conn.query('DELETE FROM resources WHERE id = ?', [req.params.id]);
		conn.release();
		if (result.affectedRows === 0) return res.status(404).json({ error: 'Resource not found' });
		res.json({ message: 'Resource deleted' });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

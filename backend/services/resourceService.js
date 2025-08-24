const pool = require('../config/db');

exports.getAllResources = async () => {
	const conn = await pool.getConnection();
	const rows = await conn.query('SELECT * FROM resources');
	conn.release();
	return rows;
};

exports.getResourceById = async (id) => {
	const conn = await pool.getConnection();
	const rows = await conn.query('SELECT * FROM resources WHERE id = ?', [id]);
	conn.release();
	return rows[0];
};

exports.createResource = async (title, url, description) => {
	const conn = await pool.getConnection();
	const result = await conn.query('INSERT INTO resources (title, url, description) VALUES (?, ?, ?)', [title, url, description]);
	conn.release();
	return { id: result.insertId, title, url, description };
};

exports.updateResource = async (id, title, url, description) => {
	const conn = await pool.getConnection();
	const result = await conn.query('UPDATE resources SET title = ?, url = ?, description = ? WHERE id = ?', [title, url, description, id]);
	conn.release();
	return result.affectedRows > 0;
};

exports.deleteResource = async (id) => {
	const conn = await pool.getConnection();
	const result = await conn.query('DELETE FROM resources WHERE id = ?', [id]);
	conn.release();
	return result.affectedRows > 0;
};

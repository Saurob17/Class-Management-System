const pool = require('../config/db');

exports.getAllAssignments = async () => {
	const conn = await pool.getConnection();
	const rows = await conn.query('SELECT * FROM assignments');
	conn.release();
	return rows;
};

exports.getAssignmentById = async (id) => {
	const conn = await pool.getConnection();
	const rows = await conn.query('SELECT * FROM assignments WHERE id = ?', [id]);
	conn.release();
	return rows[0];
};

exports.createAssignment = async (title, description, dueDate) => {
	const conn = await pool.getConnection();
	const result = await conn.query('INSERT INTO assignments (title, description, dueDate) VALUES (?, ?, ?)', [title, description, dueDate]);
	conn.release();
	return { id: result.insertId, title, description, dueDate };
};

exports.updateAssignment = async (id, title, description, dueDate) => {
	const conn = await pool.getConnection();
	const result = await conn.query('UPDATE assignments SET title = ?, description = ?, dueDate = ? WHERE id = ?', [title, description, dueDate, id]);
	conn.release();
	return result.affectedRows > 0;
};

exports.deleteAssignment = async (id) => {
	const conn = await pool.getConnection();
	const result = await conn.query('DELETE FROM assignments WHERE id = ?', [id]);
	conn.release();
	return result.affectedRows > 0;
};

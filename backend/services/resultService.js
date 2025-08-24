const pool = require('../config/db');

exports.getAllResults = async () => {
	const conn = await pool.getConnection();
	const rows = await conn.query('SELECT * FROM results');
	conn.release();
	return rows;
};

exports.getResultById = async (id) => {
	const conn = await pool.getConnection();
	const rows = await conn.query('SELECT * FROM results WHERE id = ?', [id]);
	conn.release();
	return rows[0];
};

exports.createResult = async (studentId, courseId, marks) => {
	const conn = await pool.getConnection();
	const result = await conn.query('INSERT INTO results (studentId, courseId, marks) VALUES (?, ?, ?)', [studentId, courseId, marks]);
	conn.release();
	return { id: result.insertId, studentId, courseId, marks };
};

exports.updateResult = async (id, studentId, courseId, marks) => {
	const conn = await pool.getConnection();
	const result = await conn.query('UPDATE results SET studentId = ?, courseId = ?, marks = ? WHERE id = ?', [studentId, courseId, marks, id]);
	conn.release();
	return result.affectedRows > 0;
};

exports.deleteResult = async (id) => {
	const conn = await pool.getConnection();
	const result = await conn.query('DELETE FROM results WHERE id = ?', [id]);
	conn.release();
	return result.affectedRows > 0;
};

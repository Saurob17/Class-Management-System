const pool = require('../config/db');

exports.getAllTeachers = async () => {
	const conn = await pool.getConnection();
	const rows = await conn.query('SELECT * FROM teachers');
	conn.release();
	return rows;
};

exports.getTeacherById = async (id) => {
	const conn = await pool.getConnection();
	const rows = await conn.query('SELECT * FROM teachers WHERE id = ?', [id]);
	conn.release();
	return rows[0];
};

exports.createTeacher = async (name, email, password) => {
	const conn = await pool.getConnection();
	const result = await conn.query('INSERT INTO teachers (name, email, password) VALUES (?, ?, ?)', [name, email, password]);
	conn.release();
	return { id: result.insertId, name, email };
};

exports.updateTeacher = async (id, name, email, password) => {
	const conn = await pool.getConnection();
	const result = await conn.query('UPDATE teachers SET name = ?, email = ?, password = ? WHERE id = ?', [name, email, password, id]);
	conn.release();
	return result.affectedRows > 0;
};

exports.deleteTeacher = async (id) => {
	const conn = await pool.getConnection();
	const result = await conn.query('DELETE FROM teachers WHERE id = ?', [id]);
	conn.release();
	return result.affectedRows > 0;
};

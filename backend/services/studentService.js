const pool = require('../config/db');

exports.getAllStudents = async () => {
	const conn = await pool.getConnection();
	const rows = await conn.query('SELECT * FROM students');
	conn.release();
	return rows;
};

exports.getStudentById = async (id) => {
	const conn = await pool.getConnection();
	const rows = await conn.query('SELECT * FROM students WHERE id = ?', [id]);
	conn.release();
	return rows[0];
};

exports.createStudent = async (name, email, password) => {
	const conn = await pool.getConnection();
	const result = await conn.query('INSERT INTO students (name, email, password) VALUES (?, ?, ?)', [name, email, password]);
	conn.release();
	return { id: result.insertId, name, email };
};

exports.updateStudent = async (id, name, email, password) => {
	const conn = await pool.getConnection();
	const result = await conn.query('UPDATE students SET name = ?, email = ?, password = ? WHERE id = ?', [name, email, password, id]);
	conn.release();
	return result.affectedRows > 0;
};

exports.deleteStudent = async (id) => {
	const conn = await pool.getConnection();
	const result = await conn.query('DELETE FROM students WHERE id = ?', [id]);
	conn.release();
	return result.affectedRows > 0;
};

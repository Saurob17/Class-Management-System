const pool = require('../config/db');

exports.getAllCourses = async () => {
	const conn = await pool.getConnection();
	const rows = await conn.query('SELECT * FROM courses');
	conn.release();
	return rows;
};

exports.getCourseById = async (id) => {
	const conn = await pool.getConnection();
	const rows = await conn.query('SELECT * FROM courses WHERE id = ?', [id]);
	conn.release();
	return rows[0];
};

exports.createCourse = async (name, description) => {
	const conn = await pool.getConnection();
	const result = await conn.query('INSERT INTO courses (name, description) VALUES (?, ?)', [name, description]);
	conn.release();
	return { id: result.insertId, name, description };
};

exports.updateCourse = async (id, name, description) => {
	const conn = await pool.getConnection();
	const result = await conn.query('UPDATE courses SET name = ?, description = ? WHERE id = ?', [name, description, id]);
	conn.release();
	return result.affectedRows > 0;
};

exports.deleteCourse = async (id) => {
	const conn = await pool.getConnection();
	const result = await conn.query('DELETE FROM courses WHERE id = ?', [id]);
	conn.release();
	return result.affectedRows > 0;
};

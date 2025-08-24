const pool = require('../config/db');

exports.getAllAttendances = async () => {
	const conn = await pool.getConnection();
	const rows = await conn.query('SELECT * FROM attendances');
	conn.release();
	return rows;
};

exports.getAttendanceById = async (id) => {
	const conn = await pool.getConnection();
	const rows = await conn.query('SELECT * FROM attendances WHERE id = ?', [id]);
	conn.release();
	return rows[0];
};

exports.createAttendance = async (studentId, date, status) => {
	const conn = await pool.getConnection();
	const result = await conn.query('INSERT INTO attendances (studentId, date, status) VALUES (?, ?, ?)', [studentId, date, status]);
	conn.release();
	return { id: result.insertId, studentId, date, status };
};

exports.updateAttendance = async (id, studentId, date, status) => {
	const conn = await pool.getConnection();
	const result = await conn.query('UPDATE attendances SET studentId = ?, date = ?, status = ? WHERE id = ?', [studentId, date, status, id]);
	conn.release();
	return result.affectedRows > 0;
};

exports.deleteAttendance = async (id) => {
	const conn = await pool.getConnection();
	const result = await conn.query('DELETE FROM attendances WHERE id = ?', [id]);
	conn.release();
	return result.affectedRows > 0;
};

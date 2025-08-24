const pool = require('../config/db');

exports.getAllSchedules = async () => {
	const conn = await pool.getConnection();
	const rows = await conn.query('SELECT * FROM schedules');
	conn.release();
	return rows;
};

exports.getScheduleById = async (id) => {
	const conn = await pool.getConnection();
	const rows = await conn.query('SELECT * FROM schedules WHERE id = ?', [id]);
	conn.release();
	return rows[0];
};

exports.createSchedule = async (courseId, teacherId, date, time) => {
	const conn = await pool.getConnection();
	const result = await conn.query('INSERT INTO schedules (courseId, teacherId, date, time) VALUES (?, ?, ?, ?)', [courseId, teacherId, date, time]);
	conn.release();
	return { id: result.insertId, courseId, teacherId, date, time };
};

exports.updateSchedule = async (id, courseId, teacherId, date, time) => {
	const conn = await pool.getConnection();
	const result = await conn.query('UPDATE schedules SET courseId = ?, teacherId = ?, date = ?, time = ? WHERE id = ?', [courseId, teacherId, date, time, id]);
	conn.release();
	return result.affectedRows > 0;
};

exports.deleteSchedule = async (id) => {
	const conn = await pool.getConnection();
	const result = await conn.query('DELETE FROM schedules WHERE id = ?', [id]);
	conn.release();
	return result.affectedRows > 0;
};

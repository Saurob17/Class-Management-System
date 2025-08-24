const pool = require('../config/db');

exports.getAllSchedules = async (req, res) => {
	try {
		const conn = await pool.getConnection();
		const rows = await conn.query('SELECT * FROM schedules');
		conn.release();
		res.json(rows);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

exports.getScheduleById = async (req, res) => {
	try {
		const conn = await pool.getConnection();
		const rows = await conn.query('SELECT * FROM schedules WHERE id = ?', [req.params.id]);
		conn.release();
		if (rows.length === 0) return res.status(404).json({ error: 'Schedule not found' });
		res.json(rows[0]);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

exports.createSchedule = async (req, res) => {
	try {
		const { courseId, teacherId, date, time } = req.body;
		const conn = await pool.getConnection();
		const result = await conn.query('INSERT INTO schedules (courseId, teacherId, date, time) VALUES (?, ?, ?, ?)', [courseId, teacherId, date, time]);
		conn.release();
		res.status(201).json({ id: result.insertId, courseId, teacherId, date, time });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

exports.updateSchedule = async (req, res) => {
	try {
		const { courseId, teacherId, date, time } = req.body;
		const conn = await pool.getConnection();
		const result = await conn.query('UPDATE schedules SET courseId = ?, teacherId = ?, date = ?, time = ? WHERE id = ?', [courseId, teacherId, date, time, req.params.id]);
		conn.release();
		if (result.affectedRows === 0) return res.status(404).json({ error: 'Schedule not found' });
		res.json({ id: req.params.id, courseId, teacherId, date, time });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

exports.deleteSchedule = async (req, res) => {
	try {
		const conn = await pool.getConnection();
		const result = await conn.query('DELETE FROM schedules WHERE id = ?', [req.params.id]);
		conn.release();
		if (result.affectedRows === 0) return res.status(404).json({ error: 'Schedule not found' });
		res.json({ message: 'Schedule deleted' });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

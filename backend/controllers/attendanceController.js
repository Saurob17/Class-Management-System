const pool = require('../config/db');

exports.getAllAttendances = async (req, res) => {
	try {
		const conn = await pool.getConnection();
		const rows = await conn.query('SELECT * FROM attendances');
		conn.release();
		res.json(rows);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

exports.getAttendanceById = async (req, res) => {
	try {
		const conn = await pool.getConnection();
		const rows = await conn.query('SELECT * FROM attendances WHERE id = ?', [req.params.id]);
		conn.release();
		if (rows.length === 0) return res.status(404).json({ error: 'Attendance not found' });
		res.json(rows[0]);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

exports.createAttendance = async (req, res) => {
	try {
		const { studentId, date, status } = req.body;
		const conn = await pool.getConnection();
		const result = await conn.query('INSERT INTO attendances (studentId, date, status) VALUES (?, ?, ?)', [studentId, date, status]);
		conn.release();
		res.status(201).json({ id: result.insertId, studentId, date, status });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

exports.updateAttendance = async (req, res) => {
	try {
		const { studentId, date, status } = req.body;
		const conn = await pool.getConnection();
		const result = await conn.query('UPDATE attendances SET studentId = ?, date = ?, status = ? WHERE id = ?', [studentId, date, status, req.params.id]);
		conn.release();
		if (result.affectedRows === 0) return res.status(404).json({ error: 'Attendance not found' });
		res.json({ id: req.params.id, studentId, date, status });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

exports.deleteAttendance = async (req, res) => {
	try {
		const conn = await pool.getConnection();
		const result = await conn.query('DELETE FROM attendances WHERE id = ?', [req.params.id]);
		conn.release();
		if (result.affectedRows === 0) return res.status(404).json({ error: 'Attendance not found' });
		res.json({ message: 'Attendance deleted' });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

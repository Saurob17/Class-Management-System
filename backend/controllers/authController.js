const pool = require('../config/db');
const bcrypt = require('bcrypt');

exports.login = async (req, res) => {
	const { email, password, role } = req.body; // role: 'student' or 'teacher'
	if (!email || !password || !role) {
		return res.status(400).json({ error: 'Email, password, and role are required.' });
	}
	try {
		const conn = await pool.getConnection();
		const table = role === 'teacher' ? 'teachers' : 'students';
		const rows = await conn.query(`SELECT * FROM ${table} WHERE email = ?`, [email]);
		conn.release();
		if (rows.length === 0) {
			return res.status(401).json({ error: 'Invalid credentials.' });
		}
		const user = rows[0];
		// If passwords are hashed, use bcrypt.compare
		const match = await bcrypt.compare(password, user.password);
		if (!match) {
			return res.status(401).json({ error: 'Invalid credentials.' });
		}
		// You can add JWT token generation here for session management
		res.json({ message: 'Login successful', user: { id: user.id, name: user.name, email: user.email, role } });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

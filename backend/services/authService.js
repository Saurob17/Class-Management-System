const pool = require('../config/db');
const bcrypt = require('bcrypt');

exports.login = async (email, password, role) => {
	if (!email || !password || !role) {
		throw new Error('Email, password, and role are required.');
	}
	const table = role === 'teacher' ? 'teachers' : 'students';
	const conn = await pool.getConnection();
	const rows = await conn.query(`SELECT * FROM ${table} WHERE email = ?`, [email]);
	conn.release();
	if (rows.length === 0) {
		throw new Error('Invalid credentials.');
	}
	const user = rows[0];
	const match = await bcrypt.compare(password, user.password);
	if (!match) {
		throw new Error('Invalid credentials.');
	}
	// You can add JWT token generation here for session management
	return { id: user.id, name: user.name, email: user.email, role };
};

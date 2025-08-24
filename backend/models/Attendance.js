// Attendance model using Sequelize (MySQL)
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Attendance = sequelize.define('Attendance', {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	studentId: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
	date: {
		type: DataTypes.DATE,
		allowNull: false
	},
	status: {
		type: DataTypes.STRING,
		allowNull: false
	}
}, {
	tableName: 'attendances',
	timestamps: false
});

module.exports = Attendance;

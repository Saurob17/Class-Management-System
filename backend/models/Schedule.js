// Schedule model using Sequelize (MySQL)
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Schedule = sequelize.define('Schedule', {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	courseId: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
	teacherId: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
	date: {
		type: DataTypes.DATE,
		allowNull: false
	},
	time: {
		type: DataTypes.STRING,
		allowNull: false
	}
}, {
	tableName: 'schedules',
	timestamps: false
});

module.exports = Schedule;

// Result model using Sequelize (MySQL)
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Result = sequelize.define('Result', {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	studentId: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
	courseId: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
	marks: {
		type: DataTypes.INTEGER,
		allowNull: false
	}
}, {
	tableName: 'results',
	timestamps: false
});

module.exports = Result;

// Assignment model using Sequelize (MySQL)
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Assignment = sequelize.define('Assignment', {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	title: {
		type: DataTypes.STRING,
		allowNull: false
	},
	description: {
		type: DataTypes.TEXT,
		allowNull: false
	},
	dueDate: {
		type: DataTypes.DATE,
		allowNull: false
	}
}, {
	tableName: 'assignments',
	timestamps: false
});

module.exports = Assignment;

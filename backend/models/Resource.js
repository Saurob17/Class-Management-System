// Resource model using Sequelize (MySQL)
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Resource = sequelize.define('Resource', {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	title: {
		type: DataTypes.STRING,
		allowNull: false
	},
	url: {
		type: DataTypes.STRING,
		allowNull: false
	},
	description: {
		type: DataTypes.TEXT,
		allowNull: true
	}
}, {
	tableName: 'resources',
	timestamps: false
});

module.exports = Resource;

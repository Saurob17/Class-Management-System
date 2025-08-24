const Assignment = require('../models/Assignment');

exports.getAllAssignments = async (req, res) => {
	try {
		const assignments = await Assignment.findAll();
		res.json(assignments);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

exports.getAssignmentById = async (req, res) => {
	try {
		const assignment = await Assignment.findByPk(req.params.id);
		if (!assignment) return res.status(404).json({ error: 'Assignment not found' });
		res.json(assignment);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

exports.createAssignment = async (req, res) => {
	try {
		const assignment = await Assignment.create(req.body);
		res.status(201).json(assignment);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

exports.updateAssignment = async (req, res) => {
	try {
		const assignment = await Assignment.findByPk(req.params.id);
		if (!assignment) return res.status(404).json({ error: 'Assignment not found' });
		await assignment.update(req.body);
		res.json(assignment);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

exports.deleteAssignment = async (req, res) => {
	try {
		const assignment = await Assignment.findByPk(req.params.id);
		if (!assignment) return res.status(404).json({ error: 'Assignment not found' });
		await assignment.destroy();
		res.json({ message: 'Assignment deleted' });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

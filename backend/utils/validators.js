// Validation helper functions

// Validate email format
exports.isValidEmail = (email) => {
	const re = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
	return re.test(email);
};

// Validate password strength (min 6 chars)
exports.isStrongPassword = (password) => {
	return typeof password === 'string' && password.length >= 6;
};

// Validate required fields
exports.hasRequiredFields = (obj, fields) => {
	return fields.every(field => obj.hasOwnProperty(field) && obj[field] !== undefined && obj[field] !== '');
};

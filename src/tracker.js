var Module = require('./Module'),
	modules = {};

module.exports = {
	get: function (idLiteral) {
		var id = idLiteral.value;
		return modules[id] || (modules[id] = new Module(id));
	},
	list: function () {
		return Object.keys(modules).map(function (id) {
			return modules[id];
		});
	}
};
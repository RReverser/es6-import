var Module = require('./Module'),
	urlResolve = require('url').resolve,
	modules = {},
	paths = [];

module.exports = {
	context: {
		resolve: function () {
			return Array.prototype.reduce.call(arguments, urlResolve, paths.length > 0 ? paths[paths.length - 1] : '');
		},
		into: function (idLiteral) {
			paths.push(this.resolve(idLiteral.value));
		},
		out: function () {
			paths.pop();
		}
	},
	get: function (idLiteral) {
		var id = this.context.resolve(idLiteral.value);
		return modules[id] || (modules[id] = new Module(id));
	},
	list: function () {
		return Object.keys(modules).map(function (id) {
			return modules[id];
		});
	}
};
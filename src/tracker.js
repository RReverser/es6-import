var refs = require('./refs');

function Module(id) {
	this.id = id;
	this.isResolved = false;
	this.names = {};
}

Module.prototype = {
	toExpression: function () {
		return {
			type: 'CallExpression',
			callee: {
				type: 'MemberExpression',
				object: refs.es6i_modules,
				computed: true,
				property: {
					type: 'Literal',
					value: this.id
				}
			},
			arguments: []
		};
	}
};

var modules = {};

module.exports = {
	get: function (idLiteral) {
		var id = idLiteral.value;
		return modules[id] || (modules[id] = new Module(id));
	},
	list: function () {
		return Object.keys(modules).map(function (id) {
			return modules[id];
		});
	},
	cleanup: function () {
		this.list()
		.map(function cleanupModule(module) {
			var names = module.names;

			for (var subName in names) {
				var subModule = names[subName];
				if (subModule) {
					delete names[subName];

					var exportNames = cleanupModule(subModule).names;
					for (var exportName in exportNames) {
						names[exportName] = exportNames[exportName];
					}
				}
			}

			return module;
		})
	}
};
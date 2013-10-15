var refs = require('./refs');

var modules = {};

module.exports = {
	get: function (idLiteral) {
		var id = idLiteral.value;

		return modules[id] || (modules[id] = {
			id: id,
			isResolved: false,
			names: {}
		});
	},
	list: function () {
		return Object.keys(modules).map(function (id) {
			return modules[id];
		});
	},
	expr: function (sourceLiteral) {
		this.get(sourceLiteral);

		return {
			type: 'MemberExpression',
			object: refs.es6i_modules,
			computed: true,
			property: sourceLiteral
		};
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
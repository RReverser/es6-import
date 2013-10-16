var es6i = {
	modules: {},
	define: function (name, getter) {
		es6i.modules[name] = function () {
			var es6i_export = {};
			es6i.modules[name] = function () {
				return es6i_export;
			};
			getter(es6i_export);
			return es6i_export;
		};
	},
	pull: function (es6i_export, source) {
		var module = es6i.modules[source]();
		for (var name in module) {
			es6i_export[name] = module[name];
		}
	}
};
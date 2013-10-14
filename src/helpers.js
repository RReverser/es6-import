var es6i__modules = {};

function es6i__define(name, module) {
	es6i__modules[name] = function () {
		var exports = {};
		es6i__modules[name] = function () {
			return exports;
		};
		module(function (value, name) {
			if (arguments.length > 1) {
				if (typeof name === 'object') {
					if (name === null) {
						for (name in value) {
							exports[name] = value[name];
						}
					} else {
						var mappings = name;
						for (name in mappings) {
							exports[name] = value[mappings[name]];
						}
					}
				} else {
					exports[name] = value;
				}
			} else {
				exports = value;
			}
		});
		return exports;
	};
}
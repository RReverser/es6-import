var es6i__modules = {};

function es6i__define(name, module) {
	es6i__modules[name] = function () {
		var exports = {};
		es6i__modules[name] = function () {};
		module(function (value, name) {
			if (arguments.length > 1) {
				exports[name] = value;
			} else {
				exports = value;
			}
		});
	};
}
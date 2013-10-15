var es6i = {
	cache: {},
	define: function (name, getter) {
		es6i.cache[name] = function () {
			var es6i_export = {};
			es6i.cache[name] = function () {
				return es6i_export;
			};
			getter(es6i_export);
			return es6i_export;
		};
	}
};
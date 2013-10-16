var refs = require('./refs');

function Module(id) {
	this.id = id;
	this.isResolved = false;
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

module.exports = Module;
var tracker = require('../tracker'),
	refs = require('../refs');

exports.into = function () {
	tracker.get(this.id).isResolved = true;
};

exports.out = function () {
	if (this.source !== null) {
		return {
			type: 'VariableDeclaration',
			kind: 'var',
			declarations: [{
				type: 'VariableDeclarator',
				id: this.id,
				init: tracker.get(this.source).toExpression()
			}]
		};
	}

	return {
		type: 'ExpressionStatement',
		expression: {
			type: 'CallExpression',
			callee: refs.es6i_define,
			arguments: [
				this.id,
				{
					type: 'FunctionExpression',
					params: [refs.es6i_export],
					body: this.body
				}
			]
		}
	};
};
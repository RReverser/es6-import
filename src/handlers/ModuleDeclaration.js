var tracker = require('../tracker'),
	refs = require('../refs');

exports.into = function () {
	if (this.source !== null) return;

	tracker.get(this.id).isResolved = true;
	tracker.context.into(this.id);
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

	tracker.context.out();

	return {
		type: 'ExpressionStatement',
		expression: {
			type: 'CallExpression',
			callee: refs.es6i_define,
			arguments: [
				{
					type: 'Literal',
					value: tracker.context.resolve(this.id.value)
				},
				{
					type: 'FunctionExpression',
					params: [refs.es6i_export],
					body: this.body
				}
			]
		}
	};
};
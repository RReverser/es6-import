var tracker = require('../tracker'),
	refs = require('../refs');

exports.out = function () {
	var module = tracker.get(this.source).toExpression();

	if (this.specifiers.length === 0) {
		return {
			type: 'ExpressionStatement',
			expression: module
		};
	}

	var varDeclaration = {
		type: 'VariableDeclaration',
		kind: 'var',
		declarations: this.specifiers.map(function (specifier) {
			return {
				type: 'VariableDeclarator',
				id: specifier.name || specifier.id,
				init: {
					type: 'MemberExpression',
					object: module,
					property: specifier.id
				}
			}
		})
	};

	if (this.specifiers.length === 1) {
		if (this.kind === 'default') {
			varDeclaration.declarations[0].init.property = refs.es6i_default;
		}
		return varDeclaration;
	} else {
		return {
			type: 'BlockStatement',
			body: [
				varDeclaration,
				{
					type: 'ExpressionStatement',
					expression: {
						type: 'CallExpression',
						callee: {
							type: 'FunctionExpression',
							params: [refs.es6i_import],
							body: {
								type: 'BlockStatement',
								body: varDeclaration.declarations.map(function (declaration) {
									var init = declaration.init;
									declaration.init = undefined;
									init.object = refs.es6i_import;

									return {
										type: 'ExpressionStatement',
										expression: {
											type: 'AssignmentExpression',
											left: declaration.id,
											operator: '=',
											right: init
										}
									};
								})
							}
						},
						arguments: [module]
					}
				}
			]
		};
	}
};
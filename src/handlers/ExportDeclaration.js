var refs = require('../refs'),
	tracker = require('../tracker');

exports.out = function () {
	if (this.source !== null) {
		return {
			type: 'ExpressionStatement',
			expression: {
				type: 'CallExpression',
				arguments: [tracker.get(this.source).toExpression()],
				callee: {
					type: 'FunctionExpression',
					params: [refs.es6i_import],
					body: {
						type: 'BlockStatement',
						body:
							this.specifiers[0].type === 'ExportBatchSpecifier'
							? [{
								type: 'ForInStatement',
								left: {
									type: 'VariableDeclaration',
									kind: 'var',
									declarations: [{
										type: 'VariableDeclarator',
										id: refs.name
									}]
								},
								right: refs.es6i_import,
								body: {
									type: 'ExpressionStatement',
									expression: {
										type: 'AssignmentExpression',
										left: {
											type: 'MemberExpression',
											object: refs.es6i_export,
											computed: true,
											property: refs.name
										},
										operator: '=',
										right: {
											type: 'MemberExpression',
											object: refs.es6i_import,
											computed: true,
											property: refs.name
										}
									}
								}
							}]
							: this.specifiers.map(function (specifier) {
								return {
									type: 'ExpressionStatement',
									expression: {
										type: 'AssignmentExpression',
										left: {
											type: 'MemberExpression',
											object: refs.es6i_export,
											property: specifier.name || specifier.id
										},
										operator: '=',
										right: {
											type: 'MemberExpression',
											object: refs.es6i_import,
											property: specifier.id
										}
									}
								};
							})
					}
				}
			}
		};
	}

	switch (this.declaration.type) {
		case 'FunctionExpression':
			this.declaration.type = 'FunctionDeclaration';

		case 'FunctionDeclaration':
			return {
				type: 'BlockStatement',
				body: [
					this.declaration,
					{
						type: 'ExpressionStatement',
						expression: {
							type: 'AssignmentExpression',
							left: {
								type: 'MemberExpression',
								object: refs.es6i_export,
								property: this.declaration.id
							},
							operator: '=',
							right: isDefault ? refs.es6i_default : this.declaration.id
						}
					}
				]
			};

		case 'VariableDeclaration':
			var isDefault = this['default'];

			this.declaration.declarations.forEach(function (declaration) {
				declaration.init = {
					type: 'AssignmentExpression',
					left: {
						type: 'MemberExpression',
						object: refs.es6i_export,
						property: isDefault ? refs.es6i_default : declaration.id
					},
					operator: '=',
					right: declaration.init
				};
			});

			return this.declaration;

		default:
			return {
				type: 'ExpressionStatement',
				expression: {
					type: 'AssignmentExpression',
					left: {
						type: 'MemberExpression',
						object: refs.es6i_export,
						property: refs.es6i_default
					},
					operator: '=',
					right: this.declaration
				}
			};
	}
};
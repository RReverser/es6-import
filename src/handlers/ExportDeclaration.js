var refs = require('../refs'),
	tracker = require('../tracker');

exports.out = function () {
	if (this.source !== null) {
		var module = tracker.get(this.source);

		if (this.specifiers[0].type === 'ExportBatchSpecifier') {
			return {
				type: 'ExpressionStatement',
				expression: {
					type: 'CallExpression',
					callee: refs.es6i_pull,
					arguments: [
						refs.es6i_export,
						{
							type: 'Literal',
							value: module.id
						}
					]
				}
			}
		}

		return {
			type: 'ExpressionStatement',
			expression: {
				type: 'CallExpression',
				callee: {
					type: 'FunctionExpression',
					params: [refs.es6i_import],
					body: {
						type: 'BlockStatement',
						body: this.specifiers.map(function (specifier) {
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
				},
				arguments: [module.toExpression()]
			}
		};
	}

	var isDefault = this['default'];

	switch (this.declaration.type) {
		case 'FunctionExpression':
			this.declaration.type = 'FunctionDeclaration';
			if (!this.declaration.id && isDefault) {
				this.declaration.id = refs.es6i_default;
			}

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
var refs = require('../refs'),
	tracker = require('../tracker');

exports.out = function () {
	var moduleNode = this;

	do {
		moduleNode = moduleNode.parentNode;
	} while (moduleNode && moduleNode.type !== 'ModuleDeclaration');

	if (!moduleNode) return {type: 'EmptyStatement'};

	var module = tracker.get(moduleNode.id);

	if (this.source !== null) {
		return {
			type: 'ExpressionStatement',
			expression: {
				type: 'CallExpression',
				arguments: [tracker.expr(this.source)],
				callee: {
					type: 'FunctionExpression',
					params: [refs.es6i_import],
					body: {
						type: 'BlockStatement',
						body:
							this.specifiers[0].type === 'ExportBatchSpecifier'
							? (
								module.names[this.source.value] = tracker.get(this.source),
								[{
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
							)
							: this.specifiers.map(function (specifier) {
								module.names[(specifier.name || specifier.id).name] = false;

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
		case 'FunctionDeclaration':
			module.names[this.declaration.id.name] = false;

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
							right: this.declaration.id
						}
					}
				]
			};

		case 'VariableDeclaration':
			var isDefault = this['default'];

			this.declaration.declarations.forEach(function (declaration) {
				if (!isDefault) {
					module.names[declaration.id.name] = false;
				}

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
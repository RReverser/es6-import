var esprima = require('esprima'),
	escodegen = require('escodegen'),
	fs = require('fs'),
	testPath = __dirname + '/../test/',
	ast = esprima.parse(fs.readFileSync(testPath + 'source.in.js')),
	helpers_ast = esprima.parse(fs.readFileSync(__dirname + '/helpers.js')),
	resolvedModules = {};

fs.writeFileSync(testPath + 'source.in.json', JSON.stringify(ast, null, '\t'));

function moduleBySource(src) {
	if (!(src.value in resolvedModules)) {
		resolvedModules[src.value] = false;
	}

	return {
		type: 'MemberExpression',
		object: {
			type: 'MemberExpression',
			object: {type: 'Identifier', name: 'es6i'},
			property: {type: 'Identifier', name: 'modules'}
		},
		computed: true,
		property: src
	};
}

function resolveModule(src) {
	resolvedModules[src.value] = true;
	return src;
}

function id2literal(id) {
	return {
		type: 'Literal',
		value: id.name
	};
}

var handlers = {};

handlers.ImportDeclaration = function () {
	var module = {
			type: 'CallExpression',
			callee: moduleBySource(this.source),
			arguments: []
		},
		varDeclaration = {
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
			varDeclaration.declarations[0].init.property = {type: 'Identifier', name: 'es6i_default'};
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
							params: [{type: 'Identifier', name: 'es6i_import'}],
							body: {
								type: 'BlockStatement',
								body: varDeclaration.declarations.map(function (declaration) {
									var init = declaration.init;
									declaration.init = undefined;
									init.object = {type: 'Identifier', name: 'es6i_import'};

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

handlers.ExportDeclaration = function () {
	if (this.source !== null) {
		return {
			type: 'ExpressionStatement',
			expression: {
				type: 'CallExpression',
				callee: {
					type: 'FunctionExpression',
					params: [{type: 'Identifier', name: 'es6i_import'}],
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
										id: {type: 'Identifier', name: 'name'}
									}]
								},
								right: {type: 'Identifier', name: 'es6i_import'},
								body: {
									type: 'ExpressionStatement',
									expression: {
										type: 'AssignmentExpression',
										left: {
											type: 'MemberExpression',
											object: {type: 'Identifier', name: 'es6i_export'},
											computed: true,
											property: {type: 'Identifier', name: 'name'}
										},
										operator: '=',
										right: {
											type: 'MemberExpression',
											object: {type: 'Identifier', name: 'es6i_import'},
											computed: true,
											property: {type: 'Identifier', name: 'name'}
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
											object: {type: 'Identifier', name: 'es6i_export'},
											property: specifier.name || specifier.id
										},
										operator: '=',
										right: {
											type: 'MemberExpression',
											object: {type: 'Identifier', name: 'es6i_import'},
											property: specifier.id
										}
									}
								};
							})
					}
				},
				arguments: [{
					type: 'CallExpression',
					callee: moduleBySource(this.source),
					arguments: []
				}]
			}
		};
	}

	switch (this.declaration.type) {
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
								object: {type: 'Identifier', name: 'es6i_export'},
								property: this.declaration.id
							},
							operator: '=',
							right: this.declaration.id
						}
					}
				]
			};

		case 'FunctionExpression':
			return {
				type: 'ExpressionStatement',
				expression: {
					type: 'AssignmentExpression',
					left: {
						type: 'MemberExpression',
						object: {type: 'Identifier', name: 'es6i_export'},
						property: {type: 'Identifier', name: 'es6i_default'}
					},
					operator: '=',
					right: this.declaration
				}
			};

		case 'VariableDeclaration':
			this.declaration.declarations.forEach(function (declaration) {
				declaration.init = {
					type: 'AssignmentExpression',
					left: {
						type: 'MemberExpression',
						object: {type: 'Identifier', name: 'es6i_export'},
						property: declaration.id
					},
					operator: '=',
					right: declaration.init
				};
			});
			if (this.default) {
				this.declaration.declarations[0].init.left.property = {type: 'Identifier', name: 'es6i_default'};
			}
			return this.declaration;

		default:
			return {
				type: 'ExpressionStatement',
				expression: {
					type: 'AssignmentExpression',
					left: {
						type: 'MemberExpression',
						object: {type: 'Identifier', name: 'es6i_export'},
						property: {type: 'Identifier', name: 'es6i_default'}
					},
					operator: '=',
					right: this.declaration
				}
			};
	}
};

handlers.ModuleDeclaration = function () {
	if (this.source !== null) {
		return {
			type: 'VariableDeclaration',
			kind: 'var',
			declarations: [{
				type: 'VariableDeclarator',
				id: this.id,
				init: {
					type: 'CallExpression',
					callee: moduleBySource(this.source),
					arguments: []
				}
			}]
		};
	}

	resolveModule(this.id);

	return {
		type: 'ExpressionStatement',
		expression: {
			type: 'CallExpression',
			callee: {
				type: 'MemberExpression',
				object: {type: 'Identifier', name: 'es6i'},
				property: {type: 'Identifier', name: 'define'}
			},
			arguments: [this.id, {
				type: 'FunctionExpression',
				params: [{type: 'Identifier', name: 'es6i_export'}],
				body: this.body
			}]
		}
	};
};

handlers.BlockStatement = function () {
	this.body = this.body.reduce(function (body, statement) {
		return body.concat(statement.type === 'BlockStatement' ? statement.body : [statement]);
	}, []);
	return this;
};

function traverse(node) {
	if (node.type in handlers) {
		node = handlers[node.type].call(node);
	}

	for (var subIndex in node) {
		var subNode = node[subIndex];
		if (typeof subNode === 'object' && subNode != null) {
			node[subIndex] = traverse(subNode);
		}
	}

	return node;
}

traverse(ast);

ast.body =
	helpers_ast.body
	.concat(
		Object.keys(resolvedModules)
		.filter(function (name) { return !resolvedModules[name] })
		.map(function (name) {
			return traverse({
				type: 'ModuleDeclaration',
				id: {
					type: 'Literal',
					value: name
				},
				source: null,
				body: {
					type: 'BlockStatement',
					body: [
						{
							type: 'ExpressionStatement',
							expression: {
								type: 'Literal',
								value: '[content from ' + name + (name.slice(-3).toLowerCase() === '.js' ? '' : '.js') + ' goes here]'
							}
						}
					]
				}
			});
		})
	)
	.concat(ast.body)
;

fs.writeFileSync(testPath + 'source.out.json', JSON.stringify(ast, null, '\t'));
fs.writeFileSync(testPath + 'source.out.js', escodegen.generate(ast));
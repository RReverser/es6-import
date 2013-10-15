var esprima = require('esprima'),
	escodegen = require('escodegen'),
	fs = require('fs'),
	testPath = __dirname + '/../test/',
	ast = esprima.parse(fs.readFileSync(testPath + 'source.in.js')),
	helpers_ast = esprima.parse(fs.readFileSync(__dirname + '/helpers.js')),
	modules = {};

fs.writeFileSync(testPath + 'source.in.json', JSON.stringify(ast, null, '\t'));

function moduleBySource(src) {
	if (!(src.value in modules)) {
		modules[src.value] = {isResolved: false};
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
	};

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

handlers.ExportDeclaration = function (module) {
	if (this.source !== null) {
		return {
			type: 'ExpressionStatement',
			expression: {
				type: 'CallExpression',
				arguments: [{
					type: 'CallExpression',
					callee: moduleBySource(this.source),
					arguments: []
				}],
				callee: {
					type: 'FunctionExpression',
					params: [{type: 'Identifier', name: 'es6i_import'}],
					body: {
						type: 'BlockStatement',
						body:
							this.specifiers[0].type === 'ExportBatchSpecifier'
							? (
								module.es6i_names[this.source.value] = modules[this.source.value],
								[{
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
							)
							: this.specifiers.map(function (specifier) {
								module.es6i_names[(specifier.name || specifier.id).name] = false;

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
				}
			}
		};
	}

	switch (this.declaration.type) {
		case 'FunctionDeclaration':
			module.es6i_names[this.declaration.id.name] = false;

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

		case 'VariableDeclaration':
			var isDefault = this['default'];

			this.declaration.declarations.forEach(function (declaration) {
				if (!isDefault) {
					module.es6i_names[declaration.id.name] = false;
				}

				declaration.init = {
					type: 'AssignmentExpression',
					left: {
						type: 'MemberExpression',
						object: {type: 'Identifier', name: 'es6i_export'},
						property: isDefault ? {type: 'Identifier', name: 'es6i_default'} : declaration.id
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

	var module = modules[this.id.value] || (modules[this.id.value] = {});
	module.isResolved = true;
	module.names = this.es6i_names;

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

handlers.Program = handlers.BlockStatement = function () {
	this.body = this.body.reduce(function (body, statement) {
		return body.concat(statement.type === 'BlockStatement' ? statement.body : [statement]);
	}, []);
	return this;
};

function traverse(node, module) {
	var oldModule = module;

	if (node.type === 'Program' || node.type === 'ModuleDeclaration') {
		module = node;
		module.es6i_names = {};
	}

	for (var subIndex in node) {
		var subNode = node[subIndex];
		if (typeof subNode === 'object' && subNode != null) {
			node[subIndex] = traverse(subNode, module);
		}
	}

	module = oldModule;

	if (node.type in handlers) {
		node = handlers[node.type].call(node, module);
	}

	return node;
}

traverse(ast);

ast.body =
	helpers_ast.body
	.concat(
		Object.keys(modules)
		.filter(function (name) { return !modules[name].isResolved })
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

Object.keys(modules).forEach(function cleanupModule(name) {
	var names = modules[name].names;

	for (var subName in names) {
		if (names[subName]) {
			delete names[subName];

			var exportNames = cleanupModule(subName);
			for (var exportName in exportNames) {
				names[exportName] = exportNames[exportName];
			}
		}
	}

	return names;
});

Object.keys(modules).forEach(function (name) {
	var module = modules[name];
	module.names = Object.keys(module.names);
});

console.log(modules);
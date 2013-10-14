var esprima = require('esprima'),
	escodegen = require('escodegen'),
	fs = require('fs'),
	testPath = __dirname + '/../test/',
	ast = esprima.parse(fs.readFileSync(testPath + 'source.in.js')),
	es6i__import = {
		type: 'Identifier',
		name: 'es6i__import'
	},
	es6i__export = {
		type: 'Identifier',
		name: 'es6i__export'
	},
	empty = {
		type: 'EmptyStatement'
	};

fs.writeFileSync(testPath + 'source.in.json', JSON.stringify(ast, null, '\t'));

var handlers = {};

handlers.ImportDeclaration = function () {
	var module = {
		type: 'CallExpression',
		callee: {
			type: 'Identifier',
			name: this.source.value
		},
		arguments: []
	};

	if (this.kind === 'default') {
		return {
			type: 'VariableDeclaration',
			kind: 'var',
			declarations: [{
				type: 'VariableDeclarator',
				id: this.specifiers[0].id,
				init: module
			}]
		};
	}

	if (this.specifiers.length === 1) {
		return {
			type: 'VariableDeclaration',
			kind: 'var',
			declarations: [{
				type: 'VariableDeclarator',
				id: this.specifiers[0].name || this.specifiers[0].id,
				init: {
					type: 'MemberExpression',
					object: module,
					property: this.specifiers[0].id
				}
			}]
		};
	}

	return {
		type: 'BlockStatement',
		body: [
			{
				type: 'VariableDeclaration',
				kind: 'var',
				declarations: this.specifiers.map(function (specifier) {
					return {
						type: 'VariableDeclarator',
						id: specifier.name || specifier.id
					}
				})
			},
			{
				type: 'ExpressionStatement',
				expression: {
					type: 'CallExpression',
					callee: {
						type: 'FunctionExpression',
						params: [es6i__import],
						body: {
							type: 'BlockStatement',
							body: this.specifiers.map(function (specifier) {
								return {
									type: 'ExpressionStatement',
									expression: {
										type: 'AssignmentExpression',
										left: specifier.name || specifier.id,
										operator: '=',
										right: {
											type: 'MemberExpression',
											object: es6i__import,
											property: specifier.id
										}
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
};

handlers.ExportDeclaration = function () {
	var exports = {
		type: 'BlockStatement',
		body: []
	};

	function addExport(id, value) {
		exports.body.push({
			type: 'ExpressionStatement',
			expression: {
				type: 'AssignmentExpression',
				left: this.default ? es6i__export : {
					type: 'MemberExpression',
					object: es6i__export,
					property: id
				},
				operator: '=',
				right: value
			}
		});
	}

	switch (this.declaration.type) {
		case 'FunctionDeclaration':
			this.declaration.type = 'FunctionExpression';

		case 'FunctionExpression':
			addExport(this.declaration.id, this.declaration);
			break;

		case 'VariableDeclaration':
			this.declaration.declarations.forEach(function (declaration) {
				addExport(declaration.id, declaration.init);
			});
	}

	switch (exports.body.length) {
		case 0:  return empty;
		case 1:  return exports.body[0];
		default: return exports;
	}
};

handlers.ModuleDeclaration = function () {
	var id = this.id.type === 'Identifier' ? this.id : {
		type: 'Identifier',
		name: this.id.value
	};

	if (this.source !== null) {
		return {
			type: 'VariableDeclaration',
			kind: 'var',
			declarations: [{
				type: 'VariableDeclarator',
				id: id,
				init: {
					type: 'CallExpression',
					callee: {
						type: 'Identifier',
						name: '__somehow_load__'
					},
					arguments: [this.source]
				}
			}]
		};
	}

	return {
		type: 'FunctionDeclaration',
		id: id,
		params: [],
		body:
			this.body.body.length > 0
			? {
				type: 'BlockStatement',
				body:
					[{
						type: 'VariableDeclaration',
						kind: 'var',
						declarations: [{
							type: 'VariableDeclarator',
							id: es6i__export,
							init: {
								type: 'ObjectExpression',
								properties: []
							}
						}]
					}]
					.concat(this.body.body)
					.concat([{
						type: 'ReturnStatement',
						argument: es6i__export
					}])
			}
			: this.body
	};
};

(function traverse(node) {
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
})(ast);

fs.writeFileSync(testPath + 'source.out.json', JSON.stringify(ast, null, '\t'));
fs.writeFileSync(testPath + 'source.out.js', escodegen.generate(ast));

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
	es6i__modules = {
		type: 'Identifier',
		name: 'es6i__modules'
	},
	empty = {
		type: 'EmptyStatement'
	};

ast.body.unshift({
	type: 'VariableDeclaration',
	kind: 'var',
	declarations: [{
		type: 'VariableDeclarator',
		id: es6i__modules,
		init: {
			type: 'ObjectExpression',
			properties: []
		}
	}]
});

fs.writeFileSync(testPath + 'source.in.json', JSON.stringify(ast, null, '\t'));

function moduleById(id) {
	return {
		type: 'MemberExpression',
		object: es6i__modules,
		computed: true,
		property: id
	};
}

var handlers = {};

handlers.ImportDeclaration = function () {
	var module = {
			type: 'CallExpression',
			callee: moduleById(this.source),
			arguments: []
		},
		declarations;

	if (this.kind === 'default') {
		declarations = [{
			type: 'VariableDeclarator',
			id: this.specifiers[0].id,
			init: module
		}];
	} else
	if (this.specifiers.length === 1) {
		declarations = [{
			type: 'VariableDeclarator',
			id: this.specifiers[0].name || this.specifiers[0].id,
			init: {
				type: 'MemberExpression',
				object: module,
				property: this.specifiers[0].id
			}
		}];
	} else {
		declarations = this.specifiers.map(function (specifier) {
			return {
				type: 'VariableDeclarator',
				id: specifier.name || specifier.id,
				init: {
					type: 'MemberExpression',
					object: module,
					property: specifier.id
				}
			}
		});
	}

	return {
		type: 'VariableDeclaration',
		kind: 'var',
		declarations: declarations
	};
};

handlers.ExportDeclaration = function () {
	var exports = {
			type: 'BlockStatement',
			body: []
		},
		isDefault = this.default;

	function addExport(id, value) {
		exports.body.push({
			type: 'ExpressionStatement',
			expression: {
				type: 'AssignmentExpression',
				left: isDefault ? es6i__export : {
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
	if (this.source !== null) {
		return {
			type: 'VariableDeclaration',
			kind: 'var',
			declarations: [{
				type: 'VariableDeclarator',
				id: this.id,
				init: moduleById(this.source)
			}]
		};
	}

	var block = this.body;

	if (block.body.length > 0) {
		block.body.unshift(
			{
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
			},
			{
				type: 'ExpressionStatement',
				expression: {
					type: 'AssignmentExpression',
					left: moduleById(this.id),
					operator: '=',
					right: {
						type: 'FunctionExpression',
						params: [],
						body: {
							type: 'BlockStatement',
							body: [{
								type: 'ReturnStatement',
								argument: es6i__export
							}]
						}
					}
				}
			}
		);

		block.body.push({
			type: 'ReturnStatement',
			argument: es6i__export
		});
	}

	return {
		type: 'ExpressionStatement',
		expression: {
			type: 'AssignmentExpression',
			left: moduleById(this.id),
			operator: '=',
			right: {
				type: 'FunctionExpression',
				params: [],
				body: block
			}
		}
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

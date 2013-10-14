var esprima = require('esprima'),
	escodegen = require('escodegen'),
	fs = require('fs'),
	testPath = __dirname + '/../test/',
	ast = esprima.parse(fs.readFileSync(testPath + 'source.in.js')),
	helpers_ast = esprima.parse(fs.readFileSync(__dirname + '/helpers.js')),
	es6i__key = {
		type: 'Identifier',
		name: 'es6i__key'
	},
	es6i__export = {
		type: 'Identifier',
		name: 'export'
	},
	es6i__modules = {
		type: 'Identifier',
		name: 'es6i__modules'
	},
	es6i__define = {
		type: 'Identifier',
		name: 'es6i__define'
	},
	empty = {
		type: 'EmptyStatement'
	};

ast.body = helpers_ast.body.concat(ast.body);

fs.writeFileSync(testPath + 'source.in.json', JSON.stringify(ast, null, '\t'));

function moduleById(id) {
	return {
		type: 'MemberExpression',
		object: es6i__modules,
		computed: true,
		property: id
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

	function addExport(value, id) {
		exports.body.push({
			type: 'ExpressionStatement',
			expression: {
				type: 'CallExpression',
				callee: es6i__export,
				arguments: [value].concat(isDefault ? [] : [id])
			}
		});
	}

	if (this.source !== null) {
		addExport(
			{
				type: 'CallExpression',
				callee: moduleById(this.source),
				arguments: []
			},
			(
				this.specifiers[0].type === 'ExportBatchSpecifier'
				? {
					type: 'Literal',
					value: null
				}
				: {
					type: 'ObjectExpression',
					properties: this.specifiers.map(function (specifier) {
						return {
							type: 'Property',
							key: id2literal(specifier.name || specifier.id),
							value: id2literal(specifier.id)
						};
					})
				}
			)
		);
	} else {
		switch (this.declaration.type) {
			case 'FunctionDeclaration':
				this.declaration.type = 'FunctionExpression';

			case 'FunctionExpression':
				addExport(this.declaration, id2literal(this.declaration.id));
				break;

			case 'VariableDeclaration':
				this.declaration.declarations.forEach(function (declaration) {
					addExport(declaration.init, id2literal(declaration.id));
				});
		}
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

	return {
		type: 'ExpressionStatement',
		expression: {
			type: 'CallExpression',
			callee: es6i__define,
			arguments: [this.id, {
				type: 'FunctionExpression',
				params: [es6i__export],
				body: this.body
			}]
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

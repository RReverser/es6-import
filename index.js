var esprima = require('esprima'),
	escodegen = require('escodegen'),
	fs = require('fs'),
	refs = require('./src/refs'),
	tracker = require('./src/tracker'),
	traverse = require('./src/traverse'),
	testPath = __dirname + '/test/';

function getAST(path) {
	return esprima.parse(fs.readFileSync(path));
}

var ast = getAST(testPath + 'source.in.js');

fs.writeFile(testPath + 'source.in.json', JSON.stringify(ast, null, '\t'));

ast = traverse(ast);

var unresolvedModules;
while ((unresolvedModules = tracker.list().filter(function (module) { return !module.isResolved })).length > 0) {
	ast.body =
		unresolvedModules.map(function (module) {
			return traverse({
				type: 'ModuleDeclaration',
				id: {
					type: 'Literal',
					value: module.id
				},
				source: null,
				body: {
					type: 'BlockStatement',
					body:
						module.id === 'external/world' // the only allowed for testing
						? getAST(testPath + module.id + '.js').body
						: [{
							type: 'ExpressionStatement',
							expression: {
								type: 'Literal',
								value: '[content from ' + module.id + (module.id.slice(-3).toLowerCase() === '.js' ? '' : '.js') + ' goes here]'
							}
						}]
				}
			});
		})
		.concat(ast.body);
}

ast.body = [{
	type: 'ExpressionStatement',
	expression: {
		type: 'CallExpression',
		callee: getAST(__dirname + '/src/umd.js').body[0].expression,
		arguments: [
			{type: 'ThisExpression'},
			{
				type: 'FunctionExpression',
				params: [refs.es6i_export],
				body: {
					type: 'BlockStatement',
					body: getAST(__dirname + '/src/prepend.js').body.concat(ast.body)
				}
			}
		]
	}
}];

fs.writeFile(testPath + 'source.out.json', JSON.stringify(ast, null, '\t'), function () {
	fs.writeFile(testPath + 'source.out.js', escodegen.generate(ast));
});

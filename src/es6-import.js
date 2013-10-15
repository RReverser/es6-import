var esprima = require('esprima'),
	escodegen = require('escodegen'),
	fs = require('fs'),
	tracker = require('./tracker'),
	traverse = require('./traverse'),
	testPath = __dirname + '/../test/';

function getAST(path) {
	return esprima.parse(fs.readFileSync(path));
}

var prependAST = getAST(__dirname + '/prepend.js');

var ast = getAST(testPath + 'source.in.js');

fs.writeFile(testPath + 'source.in.json', JSON.stringify(ast, null, '\t'));

ast = traverse(ast);

ast.body =
	prependAST.body
	.concat(
		tracker.list()
		.filter(function (module) { return !module.isResolved })
		.map(function (module) {
			return traverse({
				type: 'ModuleDeclaration',
				id: {
					type: 'Literal',
					value: module.id
				},
				source: null,
				body: {
					type: 'BlockStatement',
					body: [
						{
							type: 'ExpressionStatement',
							expression: {
								type: 'Literal',
								value: '[content from ' + module.id + (module.id.slice(-3).toLowerCase() === '.js' ? '' : '.js') + ' goes here]'
							}
						}
					]
				}
			});
		})
	)
	.concat(ast.body)
;

tracker.cleanup();
console.log(tracker.list());

fs.writeFile(testPath + 'source.out.json', JSON.stringify(ast, null, '\t'), function () {
	fs.writeFile(testPath + 'source.out.js', escodegen.generate(ast));
});

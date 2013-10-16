exports.into = function () {
	this.body = this.body.reduce(function (body, statement) {
		var isTop = statement.type === 'ExportDeclaration' && statement.declaration !== null && (statement.declaration.type === 'FunctionExpression' || statement.declaration.type === 'FunctionDeclaration');
		body[isTop ? 'unshift' : 'push'](statement);
		return body;
	}, []);
};

exports.out = function () {
	this.body = this.body.reduce(function (body, statement) {
		switch (statement.type) {
			case 'BlockStatement':
				return body.concat(statement.body);

			case 'EmptyStatement':
				return body;

			default:
				body.push(statement);
				return body;
		}
	}, []);
};
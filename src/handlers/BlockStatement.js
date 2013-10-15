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
	return this;
};
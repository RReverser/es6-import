exports.out = function () {
	this.body = this.body.reduce(function (body, statement) {
		return body.concat(statement.type === 'BlockStatement' ? statement.body : [statement]);
	}, []);
	return this;
};
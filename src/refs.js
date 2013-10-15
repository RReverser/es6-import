var refs = module.exports = {
	name: {type: 'Identifier', name: 'name'},
	es6i_import: {type: 'Identifier', name: 'es6i_import'},
	es6i_export: {type: 'Identifier', name: 'es6i_export'},
	es6i_default: {type: 'Identifier', name: 'es6i_default'},
	es6i: {type: 'Identifier', name: 'es6i'}
};

refs.es6i_modules = {
	type: 'MemberExpression',
	object: refs.es6i,
	property: {type: 'Identifier', name: 'modules'}
};

refs.es6i_define = {
	type: 'MemberExpression',
	object: refs.es6i,
	property: {type: 'Identifier', name: 'define'}
};
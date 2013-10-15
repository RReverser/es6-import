var handlers = require('./handlers');

module.exports = function traverse(node, parentNode) {
	Object.defineProperty(node, 'parentNode', {value: parentNode});

	if (node instanceof Array) {
		return node.map(function (subNode) {
			return traverse(subNode, parentNode)
		});
	}

	var handler = handlers[node.type];

	function trigger(actionName) {
		var action = handler && handler[actionName];
		if (!action) return;
		node = action.call(node) || node;
	}

	trigger('into');

	for (var subIndex in node) {
		var subNode = node[subIndex];
		if (typeof subNode === 'object' && subNode !== null) {
			node[subIndex] = traverse(subNode, node);
		}
	}

	trigger('out');

	return node;
};
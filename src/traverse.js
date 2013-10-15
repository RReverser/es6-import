var handlers = require('./handlers');

module.exports = function traverse(node) {
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
			Object.defineProperty(subNode, 'parentNode', {value: node});
			node[subIndex] = traverse(subNode);
		}
	}

	trigger('out');

	return node;
};
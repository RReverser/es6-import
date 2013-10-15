var handlers = module.exports = {};

require('fs')
.readdirSync(__dirname)
.filter(function (fileName) {
	return fileName !== 'index.js' && fileName.slice(-3).toLowerCase() === '.js';
})
.forEach(function (name) {
	handlers[name.slice(0, -3)] = require('./' + name);
});
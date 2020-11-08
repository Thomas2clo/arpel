const path = require('path');

module.exports = {
	entry: {
		main: path.resolve(__dirname, './assets/js/main.js')
	},
	output: {
		path: path.resolve(__dirname, './assets/js'),
		filename: '[name].bundle.js'
	}
};

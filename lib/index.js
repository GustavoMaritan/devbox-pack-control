const update = require('./update');
const list = require('./list');

async function execute() {
	let command = process.argv.find(x => /(--update)|(--list)/.test(x));
	let version = process.argv.find(x => /(--version=)|(-v=)/.test(x));
	let message = process.argv.find(x => /(--message=)|(-m=)/.test(x));
	let pattern = process.argv.find(x => /(--pattern=)|(-p=)/.test(x));
	switch (command) {
		case '--update':
			version = version
				? version.replace(/(--version=)|(-v=)/, '')
				: null;
			message = message
				? message.replace(/(--message=)|(-m=)/, '')
				: null;
			return await update(version, message);
		case '--list':
			pattern = pattern
				? pattern.replace(/(--pattern=)|(-p=)/, '')
				: null;
			return await list(pattern);
		default:
			console.log('Comando inv?lido.');
	}
}

module.exports = execute;

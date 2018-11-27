const { spawnSync } = require('child_process');
const colors = require('colors');

module.exports = pattern => {
	let result = spawnSync('git', ['tag', '--list', pattern], {
		shell: true,
		cwd: process.cwd()
	});

	if (result.stderr.toString()) {
		console.log(colors.red(result.stderr.toString()));
		return;
	}

	console.log(colors.green(result.stdout.toString()));
};

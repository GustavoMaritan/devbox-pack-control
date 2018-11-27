const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

let versionValue = null;
let versionUpdate = null;
let commitMessage = '';

module.exports = async (toVersion, message) => {
	versionUpdate = toVersion;
	commitMessage = message;

	if (!versionUpdate) return console.log('Versão não informada.');
	if (!['patch', 'minor', 'major'].includes(versionUpdate))
		return console.log(
			"Versão informada não existe, tipos:['patch', 'minor', 'major']"
		);
	versionValue =
		versionUpdate == 'patch' ? 2 : versionUpdate == 'minor' ? 1 : 0;

	await update();
};

async function update() {
	try {
		const pack = fs.readFileSync(path.join(process.cwd(), 'package.json')),
			obj = JSON.parse(pack);

		let a = obj.version.split('.'),
			oldVersion = obj.version;

		a[versionValue] = +a[versionValue] + 1;

		if (versionUpdate == 'major') {
			a[1] = 0;
			a[2] = 0;
		}

		obj.version = a.join('.');
		fs.writeFileSync(
			path.join(process.cwd(), 'package.json'),
			JSON.stringify(obj, null, 4)
		);

		if (versionUpdate == 'major') {
			let result = await prom('git branch -a');

			const possuiBranch = new RegExp('v' + a[versionValue], 'im').test(
				result
			);

			if (!possuiBranch)
				await prom('git checkout -b v' + a[versionValue]);
			else await prom('git checkout v' + a[versionValue]);

			await prom('git add .');
			await prom(
				`git commit -m "${commitMessage ||
					`Update -${versionUpdate}- para versão ${obj.version}`}"`
			);

			if (!possuiBranch)
				await prom(
					'git push --set-upstream origin v' + a[versionValue]
				);
			else await prom('git push');

		} else {
			await prom('git pull');
			await prom('git add .');
			await prom(
				`git commit -m "${commitMessage ||
					`Update -${versionUpdate}- para versão ${obj.version}`}"`
			);
			await prom('git push');
		}

		await prom(`git tag ${obj.version}`);
		await prom(`git push origin ${obj.version}`);
		await prom(`git tag`);

		end();
	} catch (ex) {
		end(ex);
	}
}

async function prom(command) {
	return new Promise((resolve, reject) => {
		exec(command, (err, out) => {
			if (err) return reject(err);
			if (out && out.trim()) console.log(out);
			resolve(out);
		});
	});
}

function end(ex) {
	if (ex) {
		console.log('### ERROUU ###');
		console.log(ex);
	} else console.log(':: EXIT....');
	console.log(
		'______________________________________________________________________'
	);
}

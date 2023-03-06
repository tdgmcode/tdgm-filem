import fs from 'fs';
import archiver from 'archiver';
import crypto from 'crypto';


/** @type {import('./$types').RequestHandler} */
export async function GET({ params }) {
	const DATA_DIRECTORY = "/files/";
	const ZIP_DIRECTORY = "/zips/";

	let currDirectory = DATA_DIRECTORY + params.path;

	currDirectory = currDirectory.replaceAll(/\/+/g,'/');

	var path, contents;

	if (currDirectory.indexOf('./') != -1 || currDirectory.indexOf('../') != -1 || currDirectory.indexOf('//') != -1 || !fs.existsSync(currDirectory)) {
		return new Response('Invalid Path');
	} else if (fs.lstatSync(currDirectory).isDirectory()) {


		var zipDir = ZIP_DIRECTORY + (crypto.createHash('md5').update(params.path).digest('hex')) + ".zip";

		const files = fs.readdirSync(currDirectory);
		const stats = files.map(file => fs.statSync(currDirectory + '/' + file));

		var recursive = false;
		files.forEach(file => {
			if (fs.statSync(currDirectory + '/' + file).isDirectory()) {
				recursive = true;
				return;
			}
		});

		if (recursive == true) return new Response('Recursive directories cannot be downloaded.');


		const size = stats.reduce((accumulator, { size }) => accumulator + size, 0);
		if (size > 1024 * 1024 * 128) {
			return new Response('That directory is too large to request a download of.');
		}

		const mtime = stats.reduce((accumulator, { mtime }) => Math.max(accumulator, mtime), 0);
		var updated = false;
		if (fs.existsSync(zipDir) && mtime > fs.statSync(zipDir).mtime) {
			fs.unlinkSync(zipDir);
			updated = true;
		}

		if (!fs.existsSync(zipDir) || updated) {
			const output = fs.createWriteStream(zipDir);

			const archive = archiver('zip', {
				zlib: { level: 9 }
			});

			await new Promise((resolve, reject) => {
				archive.pipe(output);
				archive.directory(currDirectory, 'data');
				archive.finalize();
				output.on('close', resolve);
			});
		}

		return new Response(fs.readFileSync(zipDir));
	} else {
		return new Response(fs.readFileSync(currDirectory));
	}
}

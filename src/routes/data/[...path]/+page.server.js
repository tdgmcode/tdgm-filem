import fs from 'fs';
import sizeOf from 'image-size';

function compareFiles(a, b, dir) {

	var oldA = a;
	var oldB = b;

	a = dir + '/' + a;
	b = dir + '/' + b;

	if (oldA[0] == '!' && oldB[0] != '!') return -1;
	if (oldB[0] == '!' && oldA[0] != '!') return;
	if (fs.statSync(a).isDirectory() && !fs.statSync(b).isDirectory()) return -1;
	if (fs.statSync(b).isDirectory() && !fs.statSync(a).isDirectory()) return 1;
	return (fs.statSync(b).mtime - fs.statSync(a).mtime);
}

function getData(file, dir, path) {
	var fileData = fs.statSync(dir + '/' + file);

	var suffix = "";
	if (fileData.isDirectory()) suffix += '/';

	var d = fileData.mtime;

	return {
		"name": file + suffix,
		"link": file,
		"dir": path + '/' + file,
		"mtime": d.toUTCString(),
		"extension": file.split('.').pop()
	};
}

/** @type {import('./$types').PageLoad} */
export async function load({ params, url }) {
	const DATA_DIRECTORY = "/files/";

	let currDirectory = DATA_DIRECTORY + params.path;

	var path, contents, raw, date;

	var isDark = (url.searchParams.get('dark')) ? "dark" : "";

	if (currDirectory.indexOf('./') != -1 || currDirectory.indexOf('../') != -1 || currDirectory.indexOf('//') != -1 || !fs.existsSync(currDirectory)) {
		path = "Invalid Path";
		contents = "";
	} else if (fs.statSync(currDirectory).isDirectory()) {
		var files = [];
		fs.readdirSync(currDirectory).forEach(file => {
			if (file.search(/dir\.zip$/) != -1) return;
			files.push(file);
		});
		files.sort(function (a, b) { return compareFiles(a, b, currDirectory) });
		if (params.path != '') {
			files = [".", "..", ...files];
		} else {
			files = [".", ...files];
		}

		for (var i = 0; i < files.length; i++) {
			files[i] = getData(files[i], currDirectory, params.path);
		}

		path = currDirectory;
		contents = files;
		date = fs.statSync(currDirectory).mtime;
	} else {
		path = currDirectory;
		contents = [];
		raw = true;

		var extension = params.path.split('.').pop();
		var width, height;
		width = "calc(100vw - 100px)";
		if (extension == "png" || extension == "jpg") {
			var dimensions = sizeOf(currDirectory);
			width = dimensions.width + "px";
			height = dimensions.height;
		}
		if (extension == "sb3" || extension == "sjson") {
			width = "100vmin";
		}

		date = fs.statSync(currDirectory).mtime;

		return {
			body: {
				path, contents, raw: true, currPath: '/api/file/' + params.path,
				width: width, height: height + "px",
				extension: extension,
				date: date + "",
				isDark: isDark
			}
		};
	}


	return {
		path, contents, raw: false, currPath: '/api/file/' + params.path, width: "calc(100vw - 100px)", extension: 'none', date: date + "", isDark: isDark
	};

}

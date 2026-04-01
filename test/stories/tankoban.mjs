import { argv as NodeArgParse } from 'node:process';
import { default as NodePath } from 'node:path';
import { default as NodeFS } from 'node:fs/promises';
import http from 'node:http';
import { parseHTML as linkeParse } from 'linkedom';
import { html as $ } from 'ucontent';

let foundPreface, isVerbose, cssReset, faviconIco;
const
	_dir = import.meta.dirname,

	requiredFiles = [
		'./story_preface.page.pug',
		'./story_preface.main.styl',
		'../../distribution/common/vendor/meyerweb/reset.min.css',
		'../../distribution/common/favicons/sqwiggle.ico'
	],

	okRootPaths = ['/', '/index.html', '/index', '/tankoban.html', '/tankoban'],

	baseHTML = $`
	<!DOCTYPE html><html lang="en">
		<head>
			<meta charset="utf-8">
			<title>Tankoban</title>
			<link rel="icon" type="image/x-icon" href="/favicon.ico" />
			<link rel="stylesheet" href="/reset.css"/>
		</head>
		<body></body>
	</html>
`,

{ document: rootDoc } = linkeParse(baseHTML);


isVerbose = NodeArgParse[2] == '-v' || NodeArgParse[2] == '--verbose';
foundPreface = requiredFiles.every(async (reqFl) => await NodeFS.stat(NodePath.resolve(_dir, reqFl)));
cssReset = await NodeFS.readFile(NodePath.resolve(_dir, requiredFiles[2]), { encoding: 'utf8' });
faviconIco = await NodeFS.readFile(NodePath.resolve(_dir, requiredFiles[3]));

if (isVerbose) { console.log(`Found preface files: ${foundPreface}`); }

if (foundPreface) {
	const TankoBanServer = http.createServer(async (req, res) => {
		let
			isCSSReset = false,
			isFavicon = false,
			resCode,
			resHeader = { 'Content-Type': 'text/html' };
		const $greetElement = rootDoc.createElement('h1');

		if (req.url && okRootPaths.indexOf(req.url) != -1) {
			$greetElement.innerHTML = $`<h1>Hello</h1>`;
			resCode = 200;
		} else if (req.url && req.url == "/reset.css") {
			resHeader = { 'Content-Type': 'text/css' }
			resCode = 200;
			isCSSReset = true;
		} else if (req.url && req.url == '/favicon.ico') {
			resHeader = { 'Content-Type': 'image/x-icon' }
			resCode = 200;
			isFavicon = true;
		} else {
			$greetElement.innerHTML = $`<h1>Not Found</h1>`;
			resCode = 404;
		}

		if (isVerbose) {
			console.log("Responding to");
			console.debug(req.url);
		}

		if (isFavicon) {
			res.writeHead(resCode, resHeader);
		  res.write(faviconIco);
		} else if (isCSSReset) {
			res.writeHead(resCode, resHeader);
		  res.write(cssReset);
		} else {
			rootDoc.body.replaceChildren($greetElement);
			res.writeHead(resCode, resHeader);
		  res.write(rootDoc.toString());
		}
	  res.end();
	});

	console.log("Listening on 54321...");
	TankoBanServer.listen(54321);
} else {
	console.error(`Preface files not found - ensure files located relative to server:`);
	console.debug(requiredFiles.toString());
}

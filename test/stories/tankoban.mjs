import { argv as NodeArgParse } from 'node:process';
import { default as NodePath } from 'node:path';
import { default as NodeFS } from 'node:fs/promises';
import http from 'node:http';
import { parseHTML as linkeParse } from 'linkedom';
import { html as $ } from 'ucontent';

let foundPreface, isVerbose, cssReset, prefaceTD, faviconIco;
const
  _dir = import.meta.dirname,

  requiredFiles = [
    './story_preface.page.pug',
    './story_preface.main.styl',
    './_td.mjs',
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
      <script type="text/javascript" src="/td.mjs"></script>
    </head>
    <body>
    <div id="hookhere"></div>
    <script type="module" defer>
      let result;
      const abc = td.object(['hello']);

      td.when(abc.hello()).thenReturn('world');

      result = abc.hello();

      console.debug(td.explain(abc.hello));
      console.info(result);
    </script>
    </body>
  </html>
`,

{ document: rootDoc } = linkeParse(baseHTML);


isVerbose = NodeArgParse[2] == '-v' || NodeArgParse[2] == '--verbose';
foundPreface = requiredFiles.every(async (reqFl) => await NodeFS.stat(NodePath.resolve(_dir, reqFl)));
cssReset = await NodeFS.readFile(NodePath.resolve(_dir, requiredFiles[3]), { encoding: 'utf8' });
faviconIco = await NodeFS.readFile(NodePath.resolve(_dir, requiredFiles[4]));
prefaceTD = await NodeFS.readFile(NodePath.resolve(_dir, requiredFiles[2]));

if (isVerbose) { console.log(`Found preface files: ${foundPreface}`); }

if (foundPreface) {
  const TankoBanServer = http.createServer(async (req, res) => {
    let
      isCSSReset = false,
      isFavicon = false,
      isTDJS = false,
      resCode,
      resHeader;
    const $greetElement = rootDoc.createElement('h1');

    if (req.url) {
      if(okRootPaths.indexOf(req.url) != -1) {
        $greetElement.innerHTML = $`<h1>Hello</h1>`;
        resHeader = { 'Content-Type': 'text/html' };
        resCode = 200;
      } else if (req.url == "/reset.css") {
        resHeader = { 'Content-Type': 'text/css' };
        resCode = 200;
        isCSSReset = true;
      } else if (req.url == '/favicon.ico') {
        resHeader = { 'Content-Type': 'image/x-icon' };
        resCode = 200;
        isFavicon = true;
      } else if (req.url == '/td.mjs') {
        resHeader = { 'Content-Type': 'text/javascript'};
        resCode = 200;
        isTDJS = true;
      } else {
        $greetElement.innerHTML = $`<h1>Not Found</h1>`;
        resHeader = { 'Content-Type': 'text/html' };
        resCode = 404;
      }
    } else {
      $greetElement.innerHTML = $`<h1>Not Found</h1>`;
      resHeader = { 'Content-Type': 'text/html' }
      resCode = 404;
    }

    if (isVerbose) {
      console.log("Responding to");
      console.debug(req.url);
    }

    res.writeHead(resCode, resHeader);

    if (isFavicon) {
      res.write(faviconIco);
    } else if (isCSSReset) {
      res.write(cssReset);
    } else if (isTDJS) {
      res.write(prefaceTD);
    } else {
      rootDoc.querySelector('#hookhere')?.replaceChildren($greetElement);
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

import { argv as NodeArgParse, exit as NodeExit } from 'node:process';
import { default as NodePath } from 'node:path';
import { default as NodeFS } from 'node:fs/promises';
import http from 'node:http';
import { parseHTML as linkeParse } from 'linkedom';
import { html as $ } from 'ucontent';
import { renderFile as pugRender } from 'pug';
import { render as stylRender } from 'stylus';


const
  _dir = import.meta.dirname,
  _sourceDir = NodePath.resolve(_dir, '../../source'),
  _conteDir = NodePath.resolve(_dir, './single'),

  requiredFiles = [
    './story_preface.page.pug',
    './story_preface.main.styl',
    './_td.mjs',
    '../../distribution/common/vendor/meyerweb/reset.min.css',
    '../../distribution/common/favicons/sqwiggle.ico'
  ],

  okRootPaths = ['/', '/index.html', '/index', '/tankoban.html', '/tankoban'],

  okConte = [
    'turntable_part'
  ],

  coveragePathPrefix = '/source/behavior',
  contentPathPrefix = '/content/',
  presentationPathPrefix = '/presentation',

  { document: rootDoc } = linkeParse($`
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
  `),

  isVerbose = NodeArgParse[2] == '-v' || NodeArgParse[2] == '--verbose',
  foundPreface = requiredFiles.every(async (reqFl) => await NodeFS.stat(NodePath.resolve(_dir, reqFl))),
  cssReset = await NodeFS.readFile(NodePath.resolve(_dir, requiredFiles[3]), { encoding: 'utf8' }),
  faviconIco = await NodeFS.readFile(NodePath.resolve(_dir, requiredFiles[4])),
  prefaceTD = await NodeFS.readFile(NodePath.resolve(_dir, requiredFiles[2]), { encoding: 'utf8' });


const grabPug = (grabPath = 'missing', isPanel = true) => {
  let result;
  try {
    if (isPanel) {
      result = pugRender(NodePath.resolve(_conteDir, `./${grabPath}/panel.pug`));
    } else {
      result = pugRender(NodePath.resolve(_sourceDir, `./${grabPath}`));
    }
  } catch (pugErr) {
    console.error(pugErr);
    result = null;
  }

  return result;
};


const grabStyl = async (grabPath = 'missing', isSketch = true) => {
  let _tmp, result;
  const grabDir = NodePath.dirname(grabPath);

  try {
    if (isSketch) {
      _tmp = await NodeFS.readFile(NodePath.resolve(_conteDir,`./${grabDir}/sketch.styl`), {encoding: 'utf8'});
    } else {
      _tmp = await NodeFS.readFile(NodePath.resolve(_sourceDir, `./${grabPath}`), { encoding: 'utf8' });
    }

    result = stylRender(_tmp, {paths: [_dir, NodePath.resolve(_sourceDir, './presentation')]});
  } catch (stylErr) {
    console.error(stylErr);
    result = null;
  }

  return result;
};


const grabJSasInstrument = () => {};


const maybeGrabFile = async (maybePath = 'missing', maybeType = '') => {
  let result;

  try {
    switch(maybeType) {
      case 'pugpanel': result = grabPug(maybePath); break;
      case 'pug': result = grabPug(maybePath, false); break;
      case 'stylusSketch': result = await grabStyl(maybePath); break;
      case 'stylus': result = await grabStyl(maybePath, false); break;
      case 'instrument': grabJSasInstrument(); break;
      case 'bibl': result = await NodeFS.readFile(NodePath.resolve(_dir, `./single/${maybePath}`)); break;
      default: { // most text
        result = await NodeFS.readFile(NodePath.resolve(_dir, `./single/${maybePath}`), { encoding: 'utf8' });
      }
    }
  } catch (contentErr) {
    console.error(contentErr);
    result = null;
  }

  return result;
};


const headerForMime = (dotExt = '') => {
  let result;
  switch(dotExt) {
    case '.js':
    case '.mjs': result = { 'Content-Type': 'text/javascript' }; break;
    case '.css': result = { 'Content-Type': 'text/css' }; break;
    case '.svg': result = { 'Content-Type': 'image/svg+xml' }; break;
    case '.html': result = { 'Content-Type': 'text/html' }; break;
    case '.json': result = { 'Content-Type': 'application/json' }; break;
    case '.ico': result = { 'Content-Type': 'image/x-icon' }; break;
    default: result = { 'Content-Type': 'text/plain' }
  }

  return result;
};


const TankoBanServer = http.createServer(async (req, res) => {
  let
    isRoot = false,
    isCSSReset = false,
    isFavicon = false,
    isTDJS = false,
    foundContent = false,
    lookupUrl = req.url || '',
    lookupExt,
    lookupContent,
    resCode,
    resHeader;
  const $greetElement = rootDoc.createElement('h1');

  if (lookupUrl) {
    if(okRootPaths.indexOf(lookupUrl) != -1) {
      $greetElement.textContent = $`Hello`;
      resHeader = headerForMime('.html');
      resCode = 200;
      isRoot = true;
    } else if (lookupUrl == "/reset.css") {
      resHeader = headerForMime('.css');
      resCode = 200;
      isCSSReset = true;
    } else if (lookupUrl == "/main.css") {
      resHeader = headerForMime('.css');
      resCode = 200;
    } else if (lookupUrl == '/favicon.ico' || NodePath.extname(lookupUrl) == '.ico') {
      resHeader = headerForMime('.ico');
      resCode = 200;
      isFavicon = true;
    } else if (lookupUrl == '/td.mjs') {
      resHeader = headerForMime('.mjs');
      resCode = 200;
      isTDJS = true;
    } else {
      if (okConte.some((_conte) => lookupUrl.startsWith(`/${_conte}`))) {
        lookupExt = NodePath.extname(lookupUrl);

        if (lookupExt == '') {
          lookupContent = await maybeGrabFile(lookupUrl, 'pugpanel');
          resHeader = headerForMime('.html');
        } else if (['.js','.mjs','.svg','.json'].indexOf(lookupExt) != -1) {
          lookupContent = await maybeGrabFile(lookupUrl);
          resHeader = headerForMime(lookupExt);
        } else if (lookupExt == '.css') {
          lookupContent = await maybeGrabFile(lookupUrl, 'stylusSketch');
          resHeader = headerForMime('.css');
        } else {
          lookupContent = await maybeGrabFile(lookupUrl, 'bibl');
          resHeader = headerForMime(lookupExt);
        }

        if (lookupContent) {
          resCode = 200;
          foundContent = true;
        } else { // Couldn't read file
          $greetElement.textContent = `Not Found`;
          resHeader = headerForMime('.html');
          resCode = 404;
          foundContent = false;
        }
      } else if (lookupUrl.startsWith(coveragePathPrefix)) {
        $greetElement.textContent = `Hello`;
        resHeader = headerForMime('.mjs');
        resCode = 200;
        foundContent = true;
      } else if (lookupUrl.startsWith(contentPathPrefix)) {
        lookupContent = await maybeGrabFile(lookupUrl, 'pug');

        if (lookupContent){
          resHeader = headerForMime('.html');
          resCode = 200;
          foundContent = true;
        } else {
          $greetElement.textContent = `Not Found`;
          resHeader = headerForMime('.html');
          resCode = 404;
          foundContent = false;
        }
      } else if (lookupUrl.startsWith(presentationPathPrefix)) { 
        $greetElement.textContent = `Hello`;
        resHeader = headerForMime('.mjs');
        resCode = 200;
        foundContent = true;
      } else {
        $greetElement.textContent = `Not Found`;
        resHeader = headerForMime('.html');
        resCode = 404;
        foundContent = false;
      }
    }
  } else {
    $greetElement.textContent = `Not Found`;
    resHeader = headerForMime('.html');
    resCode = 404;
    foundContent = false;
  }

  if (isVerbose) {
    if (isRoot || isFavicon || isCSSReset || isTDJS || foundContent) {
      console.debug(`Responding to: ${lookupUrl}`);
    } else {
      console.warn(`Responding (404) to: ${lookupUrl}`);
    }
  }

  res.writeHead(resCode, resHeader);

  switch(true) {
    case isFavicon: res.write(faviconIco); break;
    case isCSSReset: res.write(cssReset); break;
    case isTDJS: res.write(prefaceTD); break;
    case foundContent: res.write(lookupContent); break;
    default: {
      rootDoc.querySelector('#hookhere')?.replaceChildren($greetElement);
      res.write(rootDoc.toString());
    }
  }

  res.end();
});


// Start

if (!foundPreface) {
  console.error(`Preface files not found - ensure files located relative to server:`);
  console.debug(requiredFiles.toString());
  NodeExit(1);
}

console.log("Listening on 54321...");
TankoBanServer.listen(54321);

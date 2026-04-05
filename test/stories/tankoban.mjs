import { argv as NodeArgParse, exit as NodeExit } from 'node:process';
import { default as NodePath } from 'node:path';
import { default as NodeFS } from 'node:fs/promises';
import http from 'node:http';

import { parseHTML as linkeParse } from 'linkedom';
import { html as $ } from 'ucontent';
import { renderFile as pugRender } from 'pug';
import { render as stylRender } from 'stylus';
import { rollup } from 'rollup';

import { default as testShared } from '../compass.mjs';


const
  _dir = import.meta.dirname,
  isVerbose = NodeArgParse[2] == '-v' || NodeArgParse[2] == '--verbose',

  requiredFiles = [
    NodePath.resolve(_dir, './story_preface.page.pug'),
    NodePath.resolve(_dir, './story_preface.main.styl'),
    NodePath.resolve(_dir, './_td.mjs'),
    NodePath.resolve(testShared.cssreset_path, './reset.min.css'),
    NodePath.resolve(testShared.favicon_path, './sqwiggle.ico'),
  ],

  okRootPaths = ['/', '/index.html', '/index', '/tankoban.html', '/tankoban'],

  coveragePathPrefix = '/source/behavior',
  contentPathPrefix = '/content',
  presentationPathPrefix = '/presentation',

  { document: rootDoc } = linkeParse($`
    <!DOCTYPE html><html lang="en">
      <head>
        <meta charset="utf-8">
        <title>Tankoban</title>
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="stylesheet" href="/reset.css"/>
        <style>html { background-color: gray; }</style>
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

  foundPreface = requiredFiles.every(async (reqFl) => await NodeFS.stat(NodePath.resolve(_dir, reqFl))),
  cssReset = await NodeFS.readFile(requiredFiles[3], { encoding: 'utf8' }),
  faviconIco = await NodeFS.readFile(requiredFiles[4]),
  prefaceTD = await NodeFS.readFile(requiredFiles[2], { encoding: 'utf8' });


const grabPug = (grabPath = 'missing', grabType = 'panel') => {
  let result;

  switch(grabType) {
    case 'panel': {
      result = pugRender(NodePath.resolve(testShared.conte_oneshot_path, `./${grabPath}/panel.pug`)); break;
    }
    case 'subject': {
      result = pugRender(NodePath.resolve(testShared.conte_oneshot_path, `./${grabPath}.pug`)); break;
    }
    default: result = pugRender(NodePath.resolve(testShared.source_path, `./${grabPath}`));
  }

  return result;
};


const grabStyl = async (grabPath = 'missing', isSketch = true) => {
  let _tmp, result;
  const grabDir = NodePath.dirname(grabPath);

  if (isSketch) {
    _tmp = await NodeFS.readFile(
      NodePath.resolve(testShared.conte_oneshot_path,`./${grabDir}/sketch.styl`), { encoding: 'utf8' }
    );
  } else {
    _tmp = await NodeFS.readFile(NodePath.resolve(testShared.source_path,
      `./${NodePath.dirname(grabPath)}/${NodePath.basename(grabPath, '.css')}.styl`), { encoding: 'utf8' }
    );
  }

  result = stylRender(_tmp, {paths: [testShared.story_path, `${testShared.source_path}/presentation`]});

  return result;
};


const grabJSBundle = async (grabPath = 'missing') => {
  let result = [];

  const
    rollupBundle = await rollup({ input: NodePath.resolve(testShared.project_path, `./${grabPath}`) }),
    { output: rollupOutput } = await rollupBundle.generate({ format: 'es' });

  for (const maybeChunk of rollupOutput) {
    if (maybeChunk.type == 'asset') { continue; }

    result.push(maybeChunk.code);
  }

  await rollupBundle.close();

  return result.join("\n");
};


const maybeGrabFile = async (maybePath = 'missing', maybeType = '') => {
  let result;

  try {
    switch(maybeType) {
      case 'pugpanel': result = grabPug(maybePath); break;
      case 'pugsubject': result = grabPug(maybePath, 'subject'); break;
      case 'pug': result = grabPug(maybePath, 'other'); break;
      case 'stylusSketch': result = await grabStyl(maybePath); break;
      case 'stylus': result = await grabStyl(maybePath, false); break;
      case 'bundle': result = await grabJSBundle(maybePath); break;
      case 'bibl':  {
        result = await NodeFS.readFile(
          NodePath.resolve(testShared.conte_oneshot_path, `./${maybePath}`)
        ); break;
      }
      default: { // most text
        result = await NodeFS.readFile(
          NodePath.resolve(testShared.conte_oneshot_path, `./${maybePath}`), { encoding: 'utf8' }
        );
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
    lookupExt, lookupContent, resCode, resHeader,
    isRoot = false, isCSSReset = false, isFavicon = false, isTDJS = false, foundContent = false,
    lookupUrl = req.url || '';
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
      if (testShared.story_path_allow.some((_conte) => lookupUrl.startsWith(`/${_conte}`))) {
        lookupExt = NodePath.extname(lookupUrl);

        if (lookupExt == '') {
          lookupContent = await maybeGrabFile(lookupUrl,
            lookupUrl.endsWith(`/subject`) ? 'pugsubject' : 'pugpanel'
          );
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
        lookupContent = await maybeGrabFile(lookupUrl, 'bundle');

        if (lookupContent) {
          resHeader = headerForMime('.mjs');
          resCode = 200;
          foundContent = true;
        } else {
          $greetElement.textContent = `Not Found`;
          resHeader = headerForMime('.html');
          resCode = 404;
          foundContent = false;
        }
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
        lookupContent = await maybeGrabFile(lookupUrl, 'stylus');

        if (lookupContent){
          resHeader = headerForMime('.css');
          resCode = 200;
          foundContent = true;
        } else {
          $greetElement.textContent = `Not Found`;
          resHeader = headerForMime('.html');
          resCode = 404;
          foundContent = false;
        }
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

console.debug(testShared.conte_oneshot_path);

if (!foundPreface) {
  console.error(`Preface files not found - ensure files located relative to server:`);
  console.debug(requiredFiles.toString());
  NodeExit(1);
}

console.log("Listening on 54321...");
TankoBanServer.listen(54321);

/**
 * @import {SourceMap} from 'rollup';
 */

import { default as NodeProcess } from 'node:process';
import { default as NodePath } from 'node:path';
import { default as NodeFS } from 'node:fs/promises';
import http from 'node:http';

import { renderFile as pugRender, compile as pugCompile } from 'pug';
import { render as stylRender } from 'stylus';
import { rollup } from 'rollup';

import { default as testShared } from '../compass.mjs';


let
  /** @type {Map<string, SourceMap>} */
  bundleMaps = new Map();
const
  _dir = import.meta.dirname,
  isVerbose = NodeProcess.argv[2] == '-v' || NodeProcess.argv[2] == '--verbose',

  requiredFiles = [
    NodePath.resolve(_dir, './story_preface.pug'),
    NodePath.resolve(_dir, './story_preface.styl'),
    NodePath.resolve(_dir, './_td.mjs'),
    NodePath.resolve(testShared.cssreset_path, './reset.min.css'),
    NodePath.resolve(testShared.favicon_path, './sqwiggle.ico'),
  ],

  okRootPaths = ['/', '/index.html', '/index', '/tankoban.html', '/tankoban'],

  coveragePathPrefix = '/source/behavior',
  contentPathPrefix = '/content',
  presentationPathPrefix = '/presentation',

  foundPreface = requiredFiles.every(async (reqFl) => {
    let result;
    try {
      result = await NodeFS.stat(NodePath.resolve(_dir, reqFl))
    } catch {
      result = false;
    }
    return result;
  }),
  cssReset = foundPreface ? await NodeFS.readFile(requiredFiles[3], { encoding: 'utf8' }) : '',
  faviconIco = foundPreface ? await NodeFS.readFile(requiredFiles[4]) : '',
  prefaceTD = foundPreface ? await NodeFS.readFile(requiredFiles[2], { encoding: 'utf8' }) : '';

const rootDocFcn = foundPreface ? pugCompile(`
doctype html
html(lang="en")
  head
    title Tankoban
    link(rel="icon" type="image/x-icon" href="/favicon.ico")
    link(ref="stylesheet" href="/reset.css")
    style.
      html { background-color: gray; }
    script(type="importmap").
      {
        "imports": {
          "testdouble": "/td.mjs"
        }
      }
  body
    header
      h1 #{greetMsg}
    script(type="module").
      import { default as td } from 'testdouble';

      let result;
      const mockdObj = td.object(['hello']);

      td.when(mockdObj.hello()).thenReturn('world');

      result = mockdObj.hello();

      console.debug(td.explain(mockdObj.hello));
      console.info(result);
  `) : function(){};

const grabPug = (grabPath = 'missing', grabType = 'panel') => {
  let result;

  switch(grabType) {
    case 'panel': {
      result = pugRender(
        NodePath.resolve(testShared.conte_oneshot_path, `./${grabPath}/panel.page.pug`)
      ); break;
    }
    case 'subject': {
      result = pugRender(NodePath.resolve(testShared.conte_oneshot_path, `./${grabPath}.page.pug`)); break;
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
      NodePath.resolve(testShared.conte_oneshot_path,`./${grabDir}/sketch.main.styl`), { encoding: 'utf8' }
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
    rollupBundle = await rollup({
      input: NodePath.resolve(testShared.project_path, `./${grabPath}`),
      external: (modID, _) => { return modID?.endsWith('_glods.mjs'); }
    }),
    { output: rollupOutput } = await rollupBundle.generate({
      format: 'es',
      sourcemap: true,
      sourcemapExcludeSources: false,
      sourcemapBaseUrl: testShared.buildEnv.localhost_url
    });

  for (const maybeChunk of rollupOutput) {
    if (maybeChunk.type == 'asset') { continue; }

    result.push(maybeChunk.code);
    bundleMaps.set(`/${maybeChunk.fileName}.map`, maybeChunk.map);
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
    case '.ico': result = { 'Content-Type': 'image/x-icon' }; break;
    case '.map':
    case '.json': result = { 'Content-Type': 'application/json' }; break;
    default: result = { 'Content-Type': 'text/plain' }
  }

  return result;
};


const TankoBanServer = http.createServer(async (req, res) => {
  let
    greeting, lookupExt, lookupContent, resCode, resHeader,
    isRoot = false, isCSSReset = false, isFavicon = false, isTDJS = false, foundContent = false,
    lookupUrl = req.url || '';

  if (lookupUrl) {
    if(okRootPaths.indexOf(lookupUrl) != -1) {
      greeting = `Hello`;
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
          greeting = `Not Found`;
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
          greeting = `Not Found`;
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
          greeting = `Not Found`;
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
          greeting = `Not Found`;
          resHeader = headerForMime('.html');
          resCode = 404;
          foundContent = false;
        }
      } else if (NodePath.extname(lookupUrl).endsWith('.map')) {
        lookupContent = bundleMaps.get(lookupUrl);

        if (lookupContent) {
          lookupContent = JSON.stringify(lookupContent);
          resHeader = headerForMime('.map');
          resCode = 200;
          foundContent = true;
        } else {
          greeting = 'Not Found';
          resHeader = headerForMime('.html');
          resCode = 200;
          foundContent = false;
        }
      } else {
        greeting = `Not Found`;
        resHeader = headerForMime('.html');
        resCode = 404;
        foundContent = false;
      }
    }
  } else {
    greeting = `Not Found`;
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
    default: res.write(rootDocFcn({ greetMsg: greeting }))
  }

  res.end();
});


// Start

if (!foundPreface) {
  console.error(`Preface files not found - check:`);
  console.debug(requiredFiles.toString());
  NodeProcess.exit(1);
}

console.log(`Listening on ${testShared.tankoban_port}...`);
TankoBanServer.listen(testShared.tankoban_port);

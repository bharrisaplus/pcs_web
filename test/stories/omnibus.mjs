import { default as NodeProcess } from 'node:process';
import { default as NodePath } from 'node:path';
import { default as NodeFS } from 'node:fs/promises';
import http from 'node:http';

import { render as pugRender } from 'pug';

import { default as testShared } from '../compass.mjs';
import { default as util } from './haishin.mjs';


let
  currentCovObj = {},
  currentChapter = '';

const
  requiredFiles = [
    NodePath.resolve(testShared.storey_ch_path, './_td.mjs'),
    NodePath.resolve(testShared.storey_ch_path, './_z.mjs'),
    NodePath.resolve(testShared.storey_ch_path, './_a.js'),
    NodePath.resolve(testShared.storey_ch_path, './tanto.mjs'),
    NodePath.resolve(testShared.cssreset_path, './reset.min.css'),
    NodePath.resolve(testShared.favicon_path, './sqwiggle.ico'),
    NodePath.resolve(testShared.source_path, './content/graphic/misc/carddeck.svg')
  ],

  coveragePathPrefix = '/source/behavior',
  presentationPathPrefix = '/presentation',

  foundReqs = requiredFiles.every(async (reqFl) => {
    let result;
    try {
      result = await NodeFS.stat(reqFl);
    } catch {
      result = false;
    }
    return result;
  }),

  cssReset = foundReqs ? await NodeFS.readFile(requiredFiles[4], { encoding: 'utf8' }) : '',
  faviconIco = foundReqs ? await NodeFS.readFile(requiredFiles[5]) : '',
  prefaceTD = foundReqs ? await NodeFS.readFile(requiredFiles[0], { encoding: 'utf8' }) : '',
  prefaceZ = foundReqs ? await NodeFS.readFile(requiredFiles[1], { encoding: 'utf8' }) : '',
  prefaceA = foundReqs ? await NodeFS.readFile(requiredFiles[2], { encoding: 'utf8' }) : '',
  cardSOT = foundReqs ? await NodeFS.readFile(requiredFiles[6], { encoding: 'utf8' }) : '',
  tanto = foundReqs ? await NodeFS.readFile(requiredFiles[3], { encoding: 'utf8' }) : '';


const notFoundDoc = foundReqs ? pugRender(`
doctype html
html(lang="en")
  head
    title Omnibus
  body
    header
      h1 Not Found
  `) : '';


const OmnibusServer = http.createServer(async (req, res) => {
  let
    lookupExt, lookupContent, resCode, resHeader,
    isCSSReset = false, isFavicon = false, isTDJS = false, isZJS = false, isAJS = false,
    isCSOT = false, isTanto = false, foundContent = false,
    lookupUrl = req.url || '';


  if (!lookupUrl) {
    resHeader = util.headerForMime('.html');
    resCode = 404;
    foundContent = false;
  } else if (lookupUrl == "/reset.css") {
    resHeader = util.headerForMime('.css');
    resCode = 200;
    isCSSReset = true;
  } else if (lookupUrl == '/favicon.ico') {
    resHeader = util.headerForMime('.ico');
    resCode = 200;
    isFavicon = true;
  } else if (lookupUrl == '/td.mjs') {
    resHeader = util.headerForMime('.mjs');
    resCode = 200;
    isTDJS = true;
  } else if (lookupUrl == '/z.mjs') {
    resHeader = util.headerForMime('.mjs');
    resCode = 200;
    isZJS = true;
  } else if (lookupUrl == '/a.js') {
    resHeader = util.headerForMime('.js');
    resCode = 200;
    isAJS = true;
  } else if (lookupUrl == '/tanto.mjs') {
    resHeader = util.headerForMime('.mjs');
    resCode = 200;
    isTanto = true;
  } else if (lookupUrl == '/cardsot.svg') {
    resHeader = util.headerForMime('.svg');
    resCode = 200;
    isCSOT = true;
  } else if (
    testShared.storey_ch_allow.some(
      (_ch) => lookupUrl.startsWith(`/${_ch}`) || lookupUrl.startsWith(`/${_ch}/`)
    )
  ) {
    lookupExt = NodePath.extname(lookupUrl);

    if (lookupUrl.endsWith(`/desk`) || lookupUrl.endsWith(`/desk/`)) {
      lookupContent = await util.maybeGrabFile(lookupUrl, 'pugDesk');
      resHeader = util.headerForMime('.html');
    } else if (['.js','.mjs','.svg','.json'].includes(lookupExt)) {
      lookupContent = await util.maybeGrabFile(lookupUrl);
      resHeader = util.headerForMime(lookupExt);
    } else if (lookupExt == '.css') {
      lookupContent = await util.maybeGrabFile(lookupUrl, 'stylus');
      resHeader = util.headerForMime('.css');
    } else {
      lookupContent = await util.maybeGrabFile(lookupUrl, 'bibl');
      resHeader = util.headerForMime(lookupExt);
    }

    if (lookupContent) {
      resCode = 200;
      foundContent = true;
    } else {
      resHeader = util.headerForMime(lookupExt || '.html');
      resCode = 404;
      foundContent = false;
    }
  } else if (lookupUrl.startsWith(coveragePathPrefix)) {
    lookupContent = await util.maybeGrabFile(lookupUrl, 'bundle');
    resHeader = util.headerForMime('.mjs');

    if (lookupContent) {
      resCode = 200;
      foundContent = true;
    } else {
      resCode = 404;
      foundContent = false;
    }
  } else if (lookupUrl.startsWith(presentationPathPrefix)) {
    lookupContent = await util.maybeGrabFile(lookupUrl, 'stylus');
    resHeader = util.headerForMime('.css');

    if (lookupContent){
      resCode = 200;
      foundContent = true;
    } else {
      resCode = 404;
      foundContent = false;
    }
  } else if (NodePath.extname(lookupUrl).endsWith('.map')) {
    lookupContent = await util.maybeGrabFile(lookupUrl, 'sourcemap');
    resHeader = util.headerForMime('.map');

    if (lookupContent) {
      lookupContent = JSON.stringify(lookupContent);
      resCode = 200;
      foundContent = true;
    } else {
      resCode = 200;
      foundContent = false;
    }
  } else {
    resHeader = util.headerForMime(NodePath.extname(lookupUrl) || '.html');
    resCode = 404;
    foundContent = false;
  }

  res.writeHead(resCode, resHeader);

  switch(true) {
    case isFavicon: res.write(faviconIco); break;
    case isCSSReset: res.write(cssReset); break;
    case isTDJS: res.write(prefaceTD); break;
    case isZJS: res.write(prefaceZ); break;
    case isAJS: res.write(prefaceA); break;
    case isTanto: res.write(tanto); break;
    case isCSOT: res.write(cardSOT); break;
    case foundContent: res.write(lookupContent); break;
    default: {
      if (NodePath.extname(lookupUrl) == '.html' || NodePath.extname(lookupUrl) == '') {
        res.write(notFoundDoc);
      } else {
        res.write('not found');
      }
    }
  }

  res.end();
});


if (!foundReqs) {
  console.error(`Preface files not found - check:`);
  console.debug(requiredFiles.toString());
  NodeProcess.exit(1);
}

if (!util.tmpDir) {
  console.warn(`Missing temp directory`);
  NodeProcess.exit(1);
}


NodeProcess.on('SIGINT', () => { // Ctrl + C
  console.log('Stopping');
  NodeProcess.exit(0);
});

NodeProcess.on('SIGQUIT', () => { // Ctrl + \
  console.log('Quitting');
  NodeProcess.exit(0);
});

NodeProcess.on('SIGTERM', () => { // Terminate/Kill
  console.log('Terminating process');
  NodeProcess.exit(0);
});

NodeProcess.on('exit', () => {
  NodeFS.rmdir(util.tmpDir).then(() => {
    NodeProcess.exit(0);
  }, () => {
    NodeProcess.exit(0);
  });
});


OmnibusServer.listen(testShared.storey_port);

console.log(`Listening on ${testShared.storey_port}...`);
console.log(`Controlling on ${testShared.BROWSER_DBG_PORT}...`);
console.info(`Checking ${currentChapter}`);
console.debug(currentCovObj);

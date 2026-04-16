import { default as NodeProcess } from 'node:process';
import { default as NodePath } from 'node:path';
import { default as NodeFS } from 'node:fs/promises';
import http from 'node:http';

import { compile as pugCompile } from 'pug';

import { default as testShared } from '../compass.mjs';
import { default as util } from './haishin.mjs';

let lastCovObj = {};
const
  isVerbose = NodeProcess.argv[2] == '-v' || NodeProcess.argv[2] == '--verbose',

  requiredFiles = [
    NodePath.resolve(testShared.storey_ch_path, './_preface.pug'),
    NodePath.resolve(testShared.storey_ch_path, './_preface.styl'),
    NodePath.resolve(testShared.storey_ch_path, './_td.mjs'),
    NodePath.resolve(testShared.storey_ch_path, './_z.mjs'),
    NodePath.resolve(testShared.storey_ch_path, './_a.js'),
    NodePath.resolve(testShared.storey_ch_path, './tanto.mjs'),
    NodePath.resolve(testShared.cssreset_path, './reset.min.css'),
    NodePath.resolve(testShared.favicon_path, './sqwiggle.ico'),
    NodePath.resolve(testShared.source_path, './content/graphic/misc/carddeck.svg')
  ],

  okRootPaths = ['/', '/index.html', '/index', '/tankoban.html', '/tankoban'],

  coveragePathPrefix = '/source/behavior',
  presentationPathPrefix = '/presentation',

  foundPreface = requiredFiles.every(async (reqFl) => {
    let result;
    try {
      result = await NodeFS.stat(reqFl);
    } catch {
      result = false;
    }
    return result;
  }),
  cssReset = foundPreface ? await NodeFS.readFile(requiredFiles[6], { encoding: 'utf8' }) : '',
  faviconIco = foundPreface ? await NodeFS.readFile(requiredFiles[7]) : '',
  prefaceTD = foundPreface ? await NodeFS.readFile(requiredFiles[2], { encoding: 'utf8' }) : '',
  prefaceZ = foundPreface ? await NodeFS.readFile(requiredFiles[3], { encoding: 'utf8' }) : '',
  prefaceA = foundPreface ? await NodeFS.readFile(requiredFiles[4], { encoding: 'utf8' }) : '',
  cardSOT = foundPreface ? await NodeFS.readFile(requiredFiles[8], { encoding: 'utf8' }) : '',
  tanto = foundPreface ? await NodeFS.readFile(requiredFiles[5], { encoding: 'utf8' }) : '';


const rootDocFcn = foundPreface ? pugCompile(`
doctype html
html(lang="en")
  head
    title Tankoban
    link(rel="icon" type="image/x-icon" href="/favicon.ico")
    link(ref="stylesheet" href="/reset.css")
    style.
      html { background-color: gray; }
  body
    header
      h1 #{greetMsg}
  `) : function(){};


const TankoBanServer = http.createServer(async (req, res) => {
  let
    greeting, lookupExt, lookupContent, resCode, resHeader,
    isRoot = false, isCSSReset = false, isFavicon = false, isTDJS = false, isZJS = false, isAJS = false,
    isCSOT = false, isTanto = false, foundContent = false,
    lookupUrl = req.url || '', uploadDump = '';


  if (!lookupUrl) {
    greeting = `Not Found`;
    resHeader = util.headerForMime('.html');
    resCode = 404;
    foundContent = false;

    res.writeHead(resCode, resHeader);
    res.write(rootDocFcn({ greetMsg: greeting }))
    res.end();
  } else if (lookupUrl == '/pushcov') { // POST
    try {
      req.on('data', (chnk) => { uploadDump += chnk; });
      req.on('end', () => {
        lastCovObj = JSON.parse(uploadDump);
        res.end('coverage upload: success');
      });
    } catch (uploadErr) {
      console.error(uploadErr);
      uploadDump = '';
      res.end('coverage upload: fail');
    }
  } else { // GET
    if(okRootPaths.indexOf(lookupUrl) != -1) {
      greeting = `Hello`;
      resHeader = util.headerForMime('.html');
      resCode = 200;
      isRoot = true;
    } else if (lookupUrl == "/reset.css") {
      resHeader = util.headerForMime('.css');
      resCode = 200;
      isCSSReset = true;
    } else if (lookupUrl == "/main.css") {
      resHeader = util.headerForMime('.css');
      resCode = 200;
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
    } else if (lookupUrl == '/getlastcov' || lookupUrl == '/getlastcov/') {
      lookupContent = util.getCovSum(lastCovObj);
      resHeader = util.headerForMime('.txt');
      foundContent = true;

      if (lookupContent) {
        resCode = 200;
      } else {
        resCode = 404;
        lookupContent = 'no coverage';
      }
    } else {
      if (testShared.storey_ch_allow.some(
        (_ch) => lookupUrl.startsWith(`/${_ch}`) || lookupUrl.startsWith(`/${_ch}/`)
      )) {
        lookupExt = NodePath.extname(lookupUrl);

        if (lookupExt == '') {
          lookupContent = await util.maybeGrabFile(lookupUrl,
            lookupUrl.endsWith(`/subject`) || lookupUrl.endsWith(`/subject/`) ? 'pugSubject' : 'pugConte'
          );
          resHeader = util.headerForMime('.html');
        } else if (['.js','.mjs','.svg','.json'].indexOf(lookupExt) != -1) {
          lookupContent = await util.maybeGrabFile(lookupUrl);
          resHeader = util.headerForMime(lookupExt);
        } else if (lookupExt == '.css') {
          lookupContent = await util.maybeGrabFile(
            lookupUrl, lookupUrl.endsWith('conte.css') ? 'stylusConte' : 'stylus'
          );
          resHeader = util.headerForMime('.css');
        } else {
          lookupContent = await util.maybeGrabFile(lookupUrl, 'bibl');
          resHeader = util.headerForMime(lookupExt);
        }

        if (lookupContent) {
          resCode = 200;
          foundContent = true;
        } else {
          greeting = `Not Found`;
          resHeader = util.headerForMime('.html');
          resCode = 404;
          foundContent = false;
        }
      } else if (lookupUrl.startsWith(coveragePathPrefix)) {
        lookupContent = await util.maybeGrabFile(lookupUrl, 'bundle');

        if (lookupContent) {
          resHeader = util.headerForMime('.mjs');
          resCode = 200;
          foundContent = true;
        } else {
          greeting = `Not Found`;
          resHeader = util.headerForMime('.html');
          resCode = 404;
          foundContent = false;
        }
      } else if (lookupUrl.startsWith(presentationPathPrefix)) { 
        lookupContent = await util.maybeGrabFile(lookupUrl, 'stylus');

        if (lookupContent){
          resHeader = util.headerForMime('.css');
          resCode = 200;
          foundContent = true;
        } else {
          greeting = `Not Found`;
          resHeader = util.headerForMime('.html');
          resCode = 404;
          foundContent = false;
        }
      } else if (NodePath.extname(lookupUrl).endsWith('.map')) {
        lookupContent = await util.maybeGrabFile(lookupUrl, 'sourcemap');

        if (lookupContent) {
          lookupContent = JSON.stringify(lookupContent);
          resHeader = util.headerForMime('.map');
          resCode = 200;
          foundContent = true;
        } else {
          greeting = 'Not Found';
          resHeader = util.headerForMime('.html');
          resCode = 200;
          foundContent = false;
        }
      } else {
        greeting = `Not Found`;
        resHeader = util.headerForMime('.html');
        resCode = 404;
        foundContent = false;
      }
    }

    if (isVerbose) {
      if (isRoot || isFavicon || isCSSReset || isTDJS || isZJS || isAJS || isCSOT || isTanto || foundContent) {
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
      case isZJS: res.write(prefaceZ); break;
      case isAJS: res.write(prefaceA); break;
      case isTanto: res.write(tanto); break;
      case isCSOT: res.write(cardSOT); break;
      case foundContent: res.write(lookupContent); break;
      default: res.write(rootDocFcn({ greetMsg: greeting }))
    }

    res.end();
  }
});


// Start

if (!foundPreface) {
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


if (isVerbose) {
  console.log(`Temp directory located at: ${util.tmpDir}`);
}

console.log(`Listening on ${testShared.tankoban_port}...`);
TankoBanServer.listen(testShared.tankoban_port);

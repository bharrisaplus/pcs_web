import { default as NodeProcess } from 'node:process';
import { default as NodePath } from 'node:path';
import { default as NodeFS } from 'node:fs/promises';
import { default as NodeFSSync } from 'node:fs';
import http from 'node:http';

import { render as pugRender } from 'pug';
import { default as CRI } from 'chrome-remote-interface';
import { CoverageReport as MonocartCoverageReport } from 'monocart-coverage-reports';

import { default as testShared } from '../compass.mjs';
import { default as util } from './haishin.mjs';

let
  ec = 0,
  /** @type {CRI.Client?} */
  brwCtrl = null;
const
  isVerbose = NodeProcess.argv.slice(2).includes('-v') || NodeProcess.argv.slice(2).includes('--verbose'),
  showTapOut = NodeProcess.argv.slice(2).includes('-to') || NodeProcess.argv.slice(2).includes('--tapout'),
  keepCov = NodeProcess.argv.slice(2).includes('-kc') || NodeProcess.argv.slice(2).includes('--coverage'),

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
  tanto = foundReqs ? await NodeFS.readFile(requiredFiles[3], { encoding: 'utf8' }) : '',
  mcCovReport = new MonocartCoverageReport();


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

  if (isVerbose) {
    if (isFavicon || isCSSReset || isTDJS || isZJS || isAJS || isCSOT || isTanto || foundContent) {
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
  ec = 1;

  console.error(`Preface files not found - check:`);
  console.debug(requiredFiles.toString());
  NodeProcess.exit(ec);
}

if (!util.tmpDir) {
  ec = 1;

  console.warn(`Missing temp directory`);
  NodeProcess.exit(ec);
}


NodeProcess.on('SIGINT', () => { // Ctrl + C
  console.log('Stopping');
  NodeProcess.exit(ec);
});

NodeProcess.on('SIGQUIT', () => { // Ctrl + \
  console.log('Quitting');
  NodeProcess.exit(ec);
});

NodeProcess.on('SIGTERM', () => { // Terminate/Kill
  console.log('Terminating process');
  NodeProcess.exit(ec);
});

NodeProcess.on('exit', (codeNum) => {
  try {
    if (OmnibusServer && OmnibusServer.listening) {
      OmnibusServer.closeAllConnections();
    }

    NodeFSSync.rmSync(util.tmpDir, { recursive: true, force: true });
  } catch {
    console.error("Exit was not clean");
  } finally {
    NodeProcess.exit(codeNum);
  }
});


if (isVerbose) {
  console.log(`Temp directory located at: ${util.tmpDir}`);
}

try {
  OmnibusServer.listen(testShared.storey_port);
  console.log(`Listening on ${testShared.storey_port}...`);

  mcCovReport.loadConfig(testShared.storey_cov_config_path);

  brwCtrl = await CRI({
    host: 'localhost',
    port: testShared.BROWSER_DBG_PORT
  });

  console.log(`Controlling via ${testShared.BROWSER_DBG_PORT}...`);

  await brwCtrl.Runtime.enable();
  await brwCtrl.DOM.enable();
  await brwCtrl.Page.enable();

  for (const stryCh of testShared.storey_ch_allow) {
    let
      testPageDoc, testPageBody, covTxt,
      foundElement, foundTest,
      testEval, covEval, tapEval;

    await brwCtrl.Page.navigate({
      url: `http://localhost:${testShared.storey_port}/${stryCh}/desk`
    });

    await brwCtrl.Page.loadEventFired();

    testPageDoc = await brwCtrl.DOM.getDocument();
    testPageBody = await brwCtrl.DOM.querySelector({ nodeId: testPageDoc.root.nodeId, selector: 'body' });
    foundElement = await brwCtrl.DOM.querySelectorAll({ nodeId: testPageBody.nodeId, selector: '#container' });
    foundTest = await brwCtrl.Runtime.evaluate({ expression: "typeof runTests == 'function'" });

    if (foundElement.nodeIds.length == 1 && foundTest.result.value) {
      testEval = await brwCtrl.Runtime.evaluate({ expression: "runTests()", awaitPromise: true });

      if (testEval.result.value) {
        if (showTapOut) {
          tapEval = await brwCtrl.Runtime.evaluate({ expression: "window.__tap__" });
        }

        if (keepCov) {
          covEval = await brwCtrl.Runtime.evaluate({ expression: "window.__coverage__", returnByValue: true });
          await mcCovReport.add(covEval.result.value);
        }
      }
    }


    if (showTapOut) {
      console.log(tapEval?.result.value || "no tap output");
    }

    console.info("Checked: " + stryCh);
    console.log(`Page loaded w/o issue: ${foundElement.nodeIds.length == 1 && foundTest.result.value}`);

    if (foundElement.nodeIds.length == 1 && foundTest.result.value) {
      console.log(`Test finished w/o issue: ${testEval?.result.value}`);
    }

    if (keepCov) {
      console.log(covTxt);
    }
  }

  await brwCtrl.close();

  if (keepCov) {
    await mcCovReport.generate();
  }
} catch (oErr) {
  ec = 1;

  if (brwCtrl) {
    await brwCtrl.close();
  }

  console.warn("Omnibus has issue");
  console.error(oErr);
} finally {
  console.log("Done");
  NodeProcess.exit(ec);
}

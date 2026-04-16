
import { default as NodePath } from 'node:path';
import { default as NodeFS } from 'node:fs/promises';
import { default as NodeProcess } from 'node:process';

import { renderFile as pugRender } from 'pug';
import { render as stylRender } from 'stylus';
import { rollup } from 'rollup';
import { default as RollupIstanbulInstrument } from 'rollup-plugin-istanbul';
import { createContext as istanbulCtx } from 'istanbul-lib-report';
import { default as istanbulCoverage } from 'istanbul-lib-coverage';
import { create as istanbulReport } from 'istanbul-reports';
import { default as ansiColorStrip } from 'strip-color';

import { default as testShared } from '../compass.mjs';


let
  rtTempDirectory = '',
  /** @type {Map<string, string>} */
  bundleMaps = new Map();
const deskData = {
  CARD_SOT_URL: `${testShared.LHOST_URL}${testShared.CARD_SOT_NAME}`
};


const pug_to_html = (grabPath = 'missing', isConte = true) => {
  let result;

  if (isConte) {
    result = pugRender(NodePath.resolve(testShared.storey_ch_path, `./${grabPath}/_conte.page.pug`));
  } else {
    result = pugRender(NodePath.resolve(testShared.storey_ch_path, `./${grabPath}.page.pug`), deskData);
  }

  return result;
};


const stylus_to_css = async (grabPath = 'missing', isConte = true) => {
  let _tmp, result;
  const grabDir = NodePath.dirname(grabPath);

  if (isConte) {
    _tmp = await NodeFS.readFile(
      NodePath.resolve(testShared.storey_ch_path,`./${grabDir}/_conte.main.styl`), { encoding: 'utf8' }
    );
  } else {
    _tmp = await NodeFS.readFile(NodePath.resolve(testShared.source_path,
      `./${NodePath.dirname(grabPath)}/${NodePath.basename(grabPath, '.css')}.styl`), { encoding: 'utf8' }
    );
  }

  result = stylRender(_tmp, {paths: [
    testShared.storey_ch_path,
    `${testShared.storey_ch_path}/${isConte ? grabDir : ''}`,
    `${testShared.source_path}/presentation`,
  ]});

  return result;
};


const js_to_bundle = async (grabPath = 'missing') => {
  let result = [];
  const
    bundleExtrnls = testShared.storey_ch_bundle_ext.get(NodePath.basename(grabPath)) || [],
    rollupBundle = await rollup({
      input: NodePath.resolve(testShared.project_path, `./${grabPath}`),
      external: (modID, _) => {
        return bundleExtrnls.some( (bundleExt) => modID?.endsWith(bundleExt) )
      },
      plugins: RollupIstanbulInstrument({
        instrumenterConfig: {
          esModule: true,
          produceSourceMap: true
        }
      })
    }),
    { output: rollupOutput } = await rollupBundle.generate({
      format: 'es',
      sourcemap: true,
      sourcemapExcludeSources: false,
      sourcemapBaseUrl: testShared.buildEnv.localhost_url
    });

  for (const maybeChunk of rollupOutput) {
    let
      srcmapFile,
      srcmapFilePath = NodePath.resolve(rtTempDirectory, `./${maybeChunk.fileName}.map`);

    if (maybeChunk.type == 'asset') { continue; }

    try {
      srcmapFile = await NodeFS.open(srcmapFilePath, 'w+');

      srcmapFile.writeFile(maybeChunk.map.toString());
    } catch (smErr) {
      console.warn("Could not write sourcemap");
      console.error(smErr);
    } finally {
      if (srcmapFile) {
        srcmapFile.close();
      }
    }

    result.push(maybeChunk.code);
    bundleMaps.set(`/${maybeChunk.fileName}.map`, srcmapFilePath);
  }

  await rollupBundle.close();

  return result.join("\n");
};


const read_and_transform = async (maybePath = 'missing', maybeType = '') => {
  let result;

  try {
    switch(maybeType) {
      case 'pugConte': result = pug_to_html(maybePath); break;
      case 'pugDesk': result = pug_to_html(maybePath, false); break;
      case 'stylusConte': result = await stylus_to_css(maybePath); break;
      case 'stylus': result = await stylus_to_css(maybePath, false); break;
      case 'bundle': result = await js_to_bundle(maybePath); break;
      case 'sourcemap': result = await NodeFS.readFile(bundleMaps.get(maybePath), { encoding: 'utf8' }); break;
      case 'bibl':  {
        result = await NodeFS.readFile(NodePath.resolve(testShared.storey_ch_path, `./${maybePath}`));
        break;
      }
      default: { // most text
        result = await NodeFS.readFile(
          NodePath.resolve(testShared.storey_ch_path, `./${maybePath}`), { encoding: 'utf8' }
        );
      }
    }
  } catch (contentErr) {
    console.error(contentErr);
    result = null;
  }

  return result;
};


const coverage_report = (covObj = {}) => {
  /** @type {string[]} */
  let result = [];
  const ogWrite = NodeProcess.stdout.write.bind(NodeProcess.stdout);

  try {
    const
      _map = istanbulCoverage.createCoverageMap(covObj),

      _ctx = istanbulCtx({
        defaultSummarizer: 'nested',
        coverageMap: _map
      }),

      _reporter = istanbulReport('text');

    NodeProcess.stdout.write = (wrtChnk, _) => {
      result.push(ansiColorStrip(wrtChnk.toString()));
      return true;
    };

    _reporter.execute(_ctx);

    NodeProcess.stdout.write = ogWrite;
  } catch (covErr) {
    console.error(covErr);
  }

  return result.join('');
};


const content_header = (dotExt = '') => {
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


const getAssistant = () => {
  return Object.freeze({
    maybeGrabFile: read_and_transform,
    getCovSum: coverage_report,
    headerForMime: content_header,

    get tmpDir() {
      return rtTempDirectory;
    }
  });
};


const singleAssistant = getAssistant();


try {
  rtTempDirectory = await NodeFS.mkdtemp(`${testShared.storey_tmp_dir}_`, { encoding: 'utf8' });

} catch (fsErr) {
  rtTempDirectory = '';
  console.warn("Could not create tmp directory - check permissions:");
  console.debug(testShared.storey_tmp_dir);
  console.error(fsErr);
}

export default singleAssistant;

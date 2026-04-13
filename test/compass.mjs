import { default as NodeProcess } from 'node:process';
import { default as NodePath } from 'node:path';


const _dir = import.meta.dirname;

const getBezel = async () => {
  const
    _build_path = NodeProcess.env.BUILD_DIR || NodePath.resolve(_dir, '../build'),
    _build_g_url = NodePath.relative(_dir,
      NodePath.resolve(_build_path, './manifest.mjs')
    ).split(NodePath.sep).join('/'),
    /** @type {BuildGlobals} */
    _build_g_import = (await import(_build_g_url)).default;

   return Object.freeze({
    project_path: NodeProcess.env.PROJECT_DIR || NodePath.resolve(_dir, '../'),
    build_path: _build_path,
    source_path: NodeProcess.env.SOURCES_DIR || NodePath.resolve(_dir, '../source'),
    common_path: NodeProcess.env.COMMON_DIR || NodePath.resolve(_dir, '../distribution/common'),
    spec_path: NodeProcess.env.SPEC_DIR || NodePath.resolve(_dir, './specs'),
    
    // test specific
    storey_path: NodeProcess.env.STOREY_DIR || NodePath.resolve(_dir, './stories'),
    storey_ch_path: NodeProcess.env.STOREY_DIR ?
      NodePath.resolve(NodeProcess.env.STOREY_DIR, './chapters') :
      NodePath.resolve(_dir, './stories/chapters'),
    cssreset_path: NodeProcess.env.COMMON_DIR ?
      NodePath.resolve(NodeProcess.env.COMMON_DIR, './vendor/meyerweb') :
      NodePath.resolve(_dir, '../distribution/common/vendor/meyerweb'),
    favicon_path: NodeProcess.env.COMMON_DIR ?
      NodePath.resolve(NodeProcess.env.COMMON_DIR, './favicons') :
      NodePath.resolve(_dir, '../../distribution/common/favicons'),
    tankoban_port: 54321,
    // Stories to run; see stories/tankoban.js
    storey_ch_allow: Object.freeze([
      'turntable_part',
      'ribbon_part'
    ]),
    // Modules imported by what's being tested; Will be mocked/cloned for a storey via importmap
    //     (see stories/assistant.mjs and stories/chapters/*/clones)
    storey_ch_bundle_ext: Object.freeze(
      new Map([
        ['turntable.part.mjs', Object.freeze(['_glods.mjs', 'scribe.hand.mjs'])],
        ['ribbon.part.mjs', Object.freeze(['_glods.mjs'])]
      ])
    ),

    buildEnv: Object.freeze(_build_g_import)
  });
};

const compassBezel = await getBezel();

export default Object.freeze(compassBezel);


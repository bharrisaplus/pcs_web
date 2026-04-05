import { default as NodeProcess } from 'node:process';
import { default as NodePath } from 'node:path';


let buildEnvUrl;
const
  _dir = import.meta.dirname,
   bezel = {
    project_path: NodeProcess.env.PROJECT_DIR || NodePath.resolve(_dir, '../'),
    build_path: NodeProcess.env.BUILD_DIR || NodePath.resolve(_dir, '../build'),
    source_path: NodeProcess.env.SOURCES_DIR || NodePath.resolve(_dir, '../source'),
    common_path: NodeProcess.env.COMMON_DIR || NodePath.resolve(_dir, '../distribution/common'),
    spec_path: NodeProcess.env.SPEC_DIR || NodePath.resolve(_dir, './specs'),
    story_path: NodeProcess.env.STORY_DIR || NodePath.resolve(_dir, './stories'),
    conte_oneshot_path: NodeProcess.env.STORY_DIR ?
      NodePath.resolve(NodeProcess.env.STORY_DIR, './single') :
      NodePath.resolve(_dir, './stories/single'),
    conte_omnibus_path: NodeProcess.env.STORY_DIR ?
      NodePath.resolve(NodeProcess.env.STORY_DIR, './stories/single') :
      NodePath.resolve(_dir, './stories/single'),
    cssreset_path: NodeProcess.env.COMMON_DIR ?
      NodePath.resolve(NodeProcess.env.COMMON_DIR, './vendor/meyerweb') :
      NodePath.resolve(_dir, '../distribution/common/vendor/meyerweb'),
    favicon_path: NodeProcess.env.COMMON_DIR ?
      NodePath.resolve(NodeProcess.env.COMMON_DIR, './favicons') :
      NodePath.resolve(_dir, '../../distribution/common/favicons'),
    // Stories to run; see stories/tankoban.js
    story_path_allow: [
      'turntable_part'
    ],
    buildEnv: {}
  };


buildEnvUrl = NodePath.relative(_dir,
  NodePath.resolve(bezel.build_path, './manifest.mjs')
).split(NodePath.sep).join('/')

bezel.buildEnv = (await import(buildEnvUrl)).default;

export default bezel;


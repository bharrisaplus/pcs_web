import { default as NodeProcess } from 'node:process';

let targetConfig;

if (NodeProcess.env.BUILD_TARGET == 'octocat') {
	switch(NodeProcess.env.BUILD_OBJECTIVE) {
		case 'demo':
		default: {
			const octocatV0 = await import('./build/octocat/demo/_rollup.config.mjs');

			targetConfig = octocatV0.default;
		}
	}
}

export default targetConfig;

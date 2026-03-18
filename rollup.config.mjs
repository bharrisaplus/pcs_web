import { default as NodeProcess } from 'node:process';

let targetConfig;

if (NodeProcess.env.BUILD_TARGET == 'octocat') {
	const octocatCurrent = await import('./build/octocat/_rollup.config.mjs');

	targetConfig = octocatCurrent.default;
} else if (NodeProcess.env.BUILD_TARGET == 'soi') {
	switch(NodeProcess.env.BUILD_OBJECTIVE) {
		case 'demo': {
			const octocatV0 = await import('./build/demo/_rollup.config.mjs');

			targetConfig = octocatV0.default;
			break;
		}
		default: {
			const soiCurrent = await import('./build/_rollup.config.mjs');

			targetConfig = soiCurrent.default;
		}
	}
}

export default targetConfig;

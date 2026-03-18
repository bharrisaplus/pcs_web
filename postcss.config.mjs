import { default as NodeProcess } from 'node:process';

let targetConfig;

if (NodeProcess.env.BUILD_TARGET == 'octocat') {
	switch(NodeProcess.env.BUILD_OBJECTIVE) {
		case NodeProcess.env.DEV_VER: {
			const octocatCurrent = await import('./build/octocat/_postcss.config.mjs');

			targetConfig = octocatCurrent.default;
			break;
		}
		case 'demo':
		default: {
			const octocatV0 = await import('./build/octocat/demo/_postcss.config.mjs');

			targetConfig = octocatV0.default;
		}
	}
} else if (NodeProcess.env.BUILD_TARGET == 'soi') {
	const soiCurrent = await import('./build/_postcss.config.mjs');

	targetConfig = soiCurrent.default;
}

export default targetConfig;

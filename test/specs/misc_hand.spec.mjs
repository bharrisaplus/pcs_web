
import { default as NodeProcess } from 'node:process';
import { default as NodePath } from 'node:path';
import { renderFile as pugFile } from 'pug';
import { test } from 'tape';


const contentDir = NodeProcess.env.CONTENT_DIR || NodePath.resolve('../../source/contnet');


test("pcs:hand:misc dummy", (swear) => {
	const
		swearLoadingIndicator = pugFile(
			NodePath.resolve(contentDir, './document/partials/loading-indicator.pug'), {}
		),
		swearDump = `<div id="inline-svg-assets-here"></div>`,
		swearHTML = `<!doctype html><html lang="en"><body>${swearLoadingIndicator}${swearDump}</body></html>`;


	console.debug(swearHTML);

	swear.plan(1);
	swear.ok(true);
});

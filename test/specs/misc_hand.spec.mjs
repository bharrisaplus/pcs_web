/**
 * @import {VerifynLoad, Hand} from '../../source/behavior/_meta/_typedefs.mjs';
 */

import { default as NodeProcess } from 'node:process';
import { default as NodePath } from 'node:path';
import { default as NodeCrypto } from 'node:crypto';
import { test } from 'tape';
import * as td from 'testdouble';
import { renderFile as pugFile } from 'pug';
import { DOMParser as linkedomParser, parseHTML as linkeParse } from 'linkedom';


const
	contentDir = NodeProcess.env.CONTENT_DIR || NodePath.resolve('../../source/contnet'),
	modulePaths = {
		hand: {
			misc: '../../source/behavior/hands/misc.hand.mjs',
			scribe: '../../source/behavior/hands/scribe.hand.mjs',
		},
		shuttle: {
			host: '../../source/behavior/shuttles/host.shuttle.mjs'
		}
	},

	getImport = async (mockMarkup) => {
		const
			{document: _mockDoc, window: _mockWindow} = linkeParse(mockMarkup),
			_mockScribe = td.object(['devlog', 'issuelog']),
			mockConsole = td.replace(globalThis, 'console', td.object()),
			mockWindow = td.replace(globalThis, 'window', _mockWindow),
			mockDoc = td.replace(globalThis, 'document', _mockDoc),
			mockDomParser = td.replace(globalThis, 'DOMParser', linkedomParser),
			mockHostSh = td.object(['grabFile']);


		await td.replaceEsm(modulePaths.hand.scribe, null, _mockScribe);
		await td.replaceEsm(modulePaths.shuttle.host, null, () => mockHostSh);


		return {
			/** @type {Hand.Misc} */
			freshModule: (await import(`${modulePaths.hand.misc}?v=${NodeCrypto.randomUUID()}`)).default,
			moduleConsole: mockConsole,
			moduleWindow: mockWindow,
			moduleDoc: mockDoc,
			moduleDomParser: mockDomParser,
			moduleLogger: _mockScribe,
			moduleAPI: mockHostSh,
		};
	};


test("pcs:hand:misc:warmUp should run without issue", async (swear) => {
	let bonafiedResult, bonafiedExplntns = [];
	const
		swearLoadingIndicator = pugFile(
			NodePath.resolve(contentDir, './document/partials/loading-indicator.pug'), {}
		),
		swearGrabUrl = 'https://somesite.prod/someasset.svg',
		swearGrabSelectorV = 'somethingsomething',
		swearGrab = `<link id="${swearGrabSelectorV}" href="${swearGrabUrl}" />`,
		swearCheckSelectorV = "some-asset",
		swearCheck = `<svg id="${swearCheckSelectorV}" xmlns="http://www.w3.org/2000/svg">`,
		swearDumpSelectorV = 'inline-svg-assets-here',
		swearDump = `<div id="${swearDumpSelectorV}"></div>`,
		swearHTML = `
			<!doctype html><html lang="en">
				<body>${swearGrab}${swearLoadingIndicator}${swearDump}</body>
			</html>
		`.trim(),
		/** @type {VerifynLoad} */
		swearAssets = new Map([[`#${swearGrabSelectorV}`, `#${swearCheckSelectorV}`]]),
		swearBlob = new Blob([swearCheck], {type: 'image/svg+xml;charset=utf-8'}),

		impMeta = await getImport(swearHTML);


	td.when(impMeta.moduleAPI.grabFile(swearGrabUrl)).thenResolve(swearBlob);

	bonafiedResult = await impMeta.freshModule.warmUp(swearAssets, `#${swearDumpSelectorV}`);

	bonafiedExplntns.push(td.explain(impMeta.moduleLogger.devlog));
	bonafiedExplntns.push(td.explain(impMeta.moduleLogger.issuelog));
	bonafiedExplntns.push(td.explain(impMeta.moduleAPI.grabFile));
	td.reset();


	swear.plan(6);
	swear.ok(bonafiedResult, "Should run successfully");
	swear.isEqual(bonafiedExplntns[0].callCount, 1, "Should make dev log");
	swear.isEqual(bonafiedExplntns[0].calls[0].cloneArgs[0], 'Loading asset',
		"Should have dev log for loading success"
	);
	swear.isEqual(bonafiedExplntns[1].callCount, 0, "Should have no issues to log");
	swear.isEqual(bonafiedExplntns[2].callCount, swearAssets.size, "Should attempt to fetch each asset file");
	swear.isEqual(impMeta.moduleDoc.querySelectorAll(`#${swearCheckSelectorV}`).length, 1,
		"Should placed asset in the DOM"
	);
});


test('pcs:hand:misc:warmUp should have issues', (swear) => {
	swear.plan(1);
	swear.ok(true, "stub");
});


test('pcs:hand:misc:startAfter should run without issue', (swear) => {
	swear.plan(1);
	swear.ok(true, "stub");
});


test('pcs:hand:misc:startAfter should have issues', (swear) => {
	swear.plan(1);
	swear.ok(true, "stub");
});

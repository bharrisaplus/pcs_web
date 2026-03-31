/**
 * @import {VerifynLoad, Hand} from '../../source/behavior/_meta/_typedefs.mjs';
 */

import { default as NodeProcess } from 'node:process';
import { default as NodePath } from 'node:path';
import { default as NodeCrypto } from 'node:crypto';
import { default as test } from 'tape';
import { renderFile as pugFile } from 'pug';
import { DOMParser as linkedomParser, parseHTML as linkeParse } from 'linkedom';
import {
	object as tdObj,
	replace as tdSwap,
	replaceEsm as tdSwapEsm,
	when as tdStub,
	explain as tdExpln,
	reset as tdClr
} from 'testdouble';


const
	contentDir = NodeProcess.env.CONTENT_DIR || NodePath.resolve('../../source/contnet'),
	spinnySelector = '.loading-spinny',
	loadingIndicator = pugFile(
		NodePath.resolve(contentDir, './document/partials/loading-indicator.pug'), {}
	),
	modulePaths = {
		hand: {
			misc: '../../source/behavior/hands/misc.hand.mjs',
			scribe: '../../source/behavior/hands/scribe.hand.mjs',
		},
		shuttle: {
			host: '../../source/behavior/shuttles/host.shuttle.mjs'
		}
	},

	getImport = async (mockMarkup = `<!doctype html><html></html>`) => {
		const
			{
				document: _mockDoc,
				Event: mockEvent,
				CustomEvent: _mockCustomEvent,
				window: _mockWindow
			} = linkeParse(mockMarkup),
			_mockScribe = tdObj(['devlog', 'issuelog']),

			mockConsole = tdSwap(globalThis, 'console', tdObj()),
			mockWindow = tdSwap(globalThis, 'window', _mockWindow),
			mockDoc = tdSwap(globalThis, 'document', _mockDoc),
			mockDomParser = tdSwap(globalThis, 'DOMParser', linkedomParser),
			mockCustomEvt = tdSwap(globalThis, 'CustomEvent', _mockCustomEvent),
			mockHostSh = tdObj(['grabFile']);


		// Keep this around until linkedom has a TransitionEvent
		class TransitionEvent extends mockEvent {
			constructor(type = "transitionend", eventInitDict = {}) {
				super(type, eventInitDict);
				this.propertyName = "opacity";
			}
		}


		tdSwap(globalThis, 'TransitionEvent', TransitionEvent);
		await tdSwapEsm(modulePaths.hand.scribe, null, _mockScribe);
		await tdSwapEsm(modulePaths.shuttle.host, null, () => mockHostSh);


		return {
			/** @type {Hand.Misc} */
			freshModule: (await import(`${modulePaths.hand.misc}?v=${NodeCrypto.randomUUID()}`)).default,
			moduleConsole: mockConsole,
			moduleWindow: mockWindow,
			moduleEvent: mockEvent,
			moduleCustomEvent: mockCustomEvt,
			moduleTransitionEvent: TransitionEvent,
			moduleDoc: mockDoc,
			moduleDomParser: mockDomParser,
			moduleLogger: _mockScribe,
			moduleAPI: mockHostSh
		};
	};


test("pcs:hand:misc:warmUp should run without issue", async (swear) => {
	let bonafiedResult, bonafiedExplntns = [];
	const
		swearGrabUrl = 'https://somesite.prod/someasset.svg',
		swearGrabSelectorV = 'somethingsomething',
		swearGrab = `<link id="${swearGrabSelectorV}" href="${swearGrabUrl}" />`,
		swearCheckSelectorV = "some-asset",
		swearCheck = `<svg id="${swearCheckSelectorV}" xmlns="http://www.w3.org/2000/svg">`,
		swearDumpSelectorV = 'inline-svg-assets-here',
		swearDump = `<div id="${swearDumpSelectorV}"></div>`,
		swearHTML = `
			<!doctype html><html lang="en">
				<body>${swearGrab}${swearDump}</body>
			</html>
		`.trim(),
		/** @type {VerifynLoad} */
		swearAssets = new Map([[`#${swearGrabSelectorV}`, `#${swearCheckSelectorV}`]]),
		swearBlob = new Blob([swearCheck], {type: 'image/svg+xml;charset=utf-8'}),

		impMeta = await getImport(swearHTML);


	tdStub(impMeta.moduleAPI.grabFile(swearGrabUrl)).thenResolve(swearBlob);

	bonafiedResult = await impMeta.freshModule.warmUp(swearAssets, `#${swearDumpSelectorV}`);

	bonafiedExplntns.push(tdExpln(impMeta.moduleLogger.devlog));
	bonafiedExplntns.push(tdExpln(impMeta.moduleLogger.issuelog));
	bonafiedExplntns.push(tdExpln(impMeta.moduleAPI.grabFile));
	tdClr();
	impMeta.freshModule = null;


	swear.plan(6);
	swear.ok(bonafiedResult, "Should run successfully");
	swear.isEqual(bonafiedExplntns[0].callCount, 1, "Should make dev log");
	swear.isEqual(bonafiedExplntns[0].calls[0].args[0], 'Loading asset',
		"Should have dev log for loading success"
	);
	swear.isEqual(bonafiedExplntns[1].callCount, 0, "No log issue");
	swear.isEqual(bonafiedExplntns[2].callCount, swearAssets.size, "grab file(s)");
	swear.isEqual(impMeta.moduleDoc.querySelectorAll(`#${swearCheckSelectorV}`).length, 1,
		"Should placed asset in the DOM"
	);
});


test('pcs:hand:misc:warmUp should have issues', async (swear) => {
	let bonafiedResult = [], bonafiedExplntns = [];
	const
		swearGrabUrl = 'https://prod.com/someasset.svg',
		swearGrabSelectorV = 'source-of-truth',
		swearGrab = `<link id="${swearGrabSelectorV}" href="${swearGrabUrl}" />`,
		swearCheckSelectorV = "already-here-asset",
		swearCheck = `<svg id="${swearCheckSelectorV}" xmlns="http://www.w3.org/2000/svg">`,
		swearDumpSelectorV = 'inline-svg-assets-here',
		swearDump = `<div id="${swearDumpSelectorV}">${swearCheck}</div>`,
		swearHTML = `
			<!doctype html><html lang="en">
				<body>${swearGrab}${swearDump}</body>
			</html>
		`.trim(),
		/** @type {VerifynLoad} */
		swearAssets = new Map([[`#${swearGrabSelectorV}`, `#${swearCheckSelectorV}`]]),

		impMeta = await getImport(swearHTML);


	bonafiedResult.push(await impMeta.freshModule.warmUp(new Map(), `#${swearDumpSelectorV}`));
	bonafiedResult.push(await impMeta.freshModule.warmUp(swearAssets, ''));
	bonafiedResult.push(await impMeta.freshModule.warmUp(swearAssets, `#${swearDumpSelectorV}`));

	impMeta.moduleDoc.querySelector(`#${swearGrabSelectorV}`).setAttribute('href', '');
	impMeta.moduleDoc.querySelector(`#${swearCheckSelectorV}`).remove();
	bonafiedResult.push(await impMeta.freshModule.warmUp(swearAssets, `#${swearDumpSelectorV}`));

	bonafiedExplntns.push(tdExpln(impMeta.moduleLogger.devlog));
	bonafiedExplntns.push(tdExpln(impMeta.moduleLogger.issuelog));
	bonafiedExplntns.push(tdExpln(impMeta.moduleAPI.grabFile));

	tdClr();
	impMeta.freshModule = null;


	swear.plan(10);
	swear.notOk(bonafiedResult[0], "false-y return");
	swear.notOk(bonafiedResult[1], "false-y return");
	swear.ok(bonafiedResult[2], "false-y return");
	swear.isEqual(bonafiedExplntns[0].callCount, 2, "log dev");
	swear.isEqual(bonafiedExplntns[1].callCount, 2, "log issues");
	swear.isEqual(bonafiedExplntns[2].callCount, 0, "No grab file");
	swear.isEqual(bonafiedExplntns[0].calls[0].args[0], "Nothing to retrieve", "Correct args for devlog");
	swear.isEqual(
		bonafiedExplntns[0].calls[1].args[0], `Found #${swearCheckSelectorV} asset inlined already`,
		"Correct args for devlog"
	);
	swear.isEqual(bonafiedExplntns[1].calls[0].args[0], "Nowhere to place asset",
		"Correct args for issuelog"
	);
	swear.isEqual(bonafiedExplntns[1].calls[1].args[0], `Missing url for asset`,
		"Correct args for issuelog"
	);
});


test("pcs:hand:misc:warmUp should have issues cont'd", async (swear) => {
	let bonafiedResult, bonafiedExplntns = [];
	const
		swearGrabUrl = 'https://production.site/someassett',
		swearGrabSelectorV = 'source-of-truth',
		swearGrab = `<link id="${swearGrabSelectorV}" href="${swearGrabUrl}" />`,
		swearCheckSelectorV = "already-here-asset",
		swearCheck = `<svg id="${swearCheckSelectorV}" xmlns="http://www.w3.org/2000/svg">`,
		swearDumpSelectorV = 'inline-svg-assets-here',
		swearDump = `<div id="${swearDumpSelectorV}"></div>`,
		swearHTML = `
			<!doctype html><html lang="en">
				<body>${swearGrab}${swearDump}</body>
			</html>
		`.trim(),
		/** @type {VerifynLoad} */
		swearAssets = new Map([[`#${swearGrabSelectorV}`, `#${swearCheckSelectorV}`]]),
		swearBlob = new Blob([swearCheck], {type: 'image/svg+xml;charset=utf-8'}),

		impMeta = await getImport(swearHTML);


	tdStub(impMeta.moduleAPI.grabFile(swearGrabUrl)).thenReturn(null);
	bonafiedResult = await impMeta.freshModule.warmUp(swearAssets, `#${swearDumpSelectorV}`);
	tdStub(impMeta.moduleAPI.grabFile(swearGrabUrl)).thenReturn(new Blob());
	bonafiedResult = await impMeta.freshModule.warmUp(swearAssets, `#${swearDumpSelectorV}`);
	tdStub(impMeta.moduleAPI.grabFile(swearGrabUrl)).thenReturn(swearBlob);
	bonafiedResult = await impMeta.freshModule.warmUp(swearAssets, `#${swearDumpSelectorV}`);


	bonafiedExplntns.push(tdExpln(impMeta.moduleLogger.devlog));
	bonafiedExplntns.push(tdExpln(impMeta.moduleLogger.issuelog));
	bonafiedExplntns.push(tdExpln(impMeta.moduleAPI.grabFile));

	tdClr();
	impMeta.freshModule = null;


	swear.plan(7);
	swear.notOk(bonafiedResult, "false-y return");
	swear.isEqual(bonafiedExplntns[0].callCount, 1, "log dev");
	swear.isEqual(bonafiedExplntns[1].callCount, 2, "log issue");
	swear.isEqual(bonafiedExplntns[2].callCount, 3, "grab file");
	swear.isEqual(bonafiedExplntns[0].calls[0].args[0], `Unknown asset type from ${swearGrabUrl}`,
		"correct args for log dev"
	);
	swear.isEqual(bonafiedExplntns[1].calls[0].args[0], `Missing asset from ${swearGrabUrl}`,
		"correct args for log issue"
	);
	swear.isEqual(bonafiedExplntns[1].calls[1].args[0], `Empty asset from ${swearGrabUrl}`,
		"correct args for log issue"
	);
});


test('pcs:hand:misc:startAfter should run without issue', async (swear) => {
	let bonafiedResult = [], bonafiedExplntns = [];
	const
  		swearIterationEvent = 'animationiteration',
		swearCurtainSelectorV = 'pageload-curtain',
		swearCurtain = `<div id="${swearCurtainSelectorV}">${loadingIndicator}</div>`,
		swearHTML = `<!doctype html><html lang="en"><body>${swearCurtain}</body></html>`,

		impMeta = await getImport(swearHTML);


	impMeta.freshModule.startAfter(`#${swearCurtainSelectorV}`, spinnySelector);
	impMeta.moduleDoc.querySelector(spinnySelector).dispatchEvent(
		new impMeta.moduleEvent(swearIterationEvent)
	);
	impMeta.moduleDoc.querySelector(spinnySelector).dispatchEvent(
		new impMeta.moduleEvent(swearIterationEvent)
	);
	impMeta.moduleDoc.querySelector(spinnySelector).dispatchEvent(
		new impMeta.moduleEvent(swearIterationEvent)
	);
	bonafiedResult.push(
		impMeta.moduleDoc.querySelector(`#${swearCurtainSelectorV}`).classList.contains('loading-done')
	);

	impMeta.moduleWindow.addEventListener('kick', () => bonafiedResult.push(true));
	impMeta.moduleDoc.querySelector(`#${swearCurtainSelectorV}`).dispatchEvent(
		new impMeta.moduleTransitionEvent()
	);
	bonafiedResult.push(impMeta.moduleDoc.querySelectorAll(`#${swearCurtainSelectorV}`).length == 0);

	bonafiedExplntns.push(tdExpln(impMeta.moduleLogger.devlog));
	tdClr();
	impMeta.freshModule = null;


	swear.plan(6);
	swear.ok(bonafiedResult[0], "appends class when animation finished");
	swear.ok(bonafiedResult[1], "fires kick event");
	swear.ok(bonafiedResult[2], "removes element once transition finished");
	swear.isEqual(bonafiedExplntns[0].callCount, 2, "calls dev log");
	swear.isEqual(bonafiedExplntns[0].calls[0].args[0], "Stopping indicator", "Correct args for devlog");
	swear.isEqual(bonafiedExplntns[0].calls[1].args[0], "Removing indicator", "Correct args for devlog");
});


test("pcs:hand:misc:startAfter should run without issue (cont'd)", async (swear) => {
	let bonafiedResult = [], bonafiedExplntns = [];
	const
		swearCurtainSelectorV = 'pageload-curtain',
		swearCurtain = `<div id="${swearCurtainSelectorV}"></div>`,
		swearHTML = `<!doctype html><html lang="en"><body>${swearCurtain}</body></html>`,

		impMeta = await getImport(swearHTML);


	impMeta.moduleWindow.addEventListener('kick', () => bonafiedResult.push(true));
	impMeta.freshModule.startAfter(`#${swearCurtainSelectorV}`, spinnySelector);
	bonafiedResult.push(impMeta.moduleDoc.querySelectorAll(`#${swearCurtainSelectorV}`).length == 1);
	impMeta.moduleDoc.querySelector(`#${swearCurtainSelectorV}`).remove();
	impMeta.freshModule.startAfter(`#${swearCurtainSelectorV}`, spinnySelector);
	bonafiedExplntns.push(tdExpln(impMeta.moduleLogger.devlog));
	tdClr();
	impMeta.freshModule = null;


	swear.plan(4);
	swear.ok(bonafiedResult[0], "fires kick event");
	swear.ok(bonafiedResult[1], "ignores element");
	swear.ok(bonafiedResult[2], "fires kick event");
	swear.isEqual(bonafiedExplntns[0].callCount, 0, "no dev log");
});

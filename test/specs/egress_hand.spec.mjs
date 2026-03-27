/**
 * @import {Hand} from '../../source/behavior/_meta/_typedefs.mjs';
 */

import { default as NodeCrypto } from 'node:crypto';
import { test } from 'tape';
import * as td from 'testdouble';
import { parseHTML as linkeParse } from 'linkedom';


const
	defaultSpecHTML = `<!doctype html><html lang="en"><body></body></html>`,
	modulePaths = {
		scribeHand: '../../source/behavior/hands/scribe.hand.mjs',
		egressHand: '../../source/behavior/hands/egress.hand.mjs'
	},

	// This function modifies globals so always call 'td.reset()' when done (read: before assertions).
	getImport = async (mockMarkup) => {
		const
			{ Image: _mockImg, document: _mockDoc, window: _mockWindow } = linkeParse(mockMarkup),
			_mockScribe = td.object(),
			_mockCanvas = td.constructor(_mockDoc.HTMLCanvasElement),

			mockConsole = td.replace(globalThis, 'console', td.object()),
			mockWindow = td.replace(globalThis, 'window', _mockWindow),
			mockDoc = td.replace(globalThis, 'document', _mockDoc),
			mockXMLS = td.replace(globalThis, 'XMLSerializer', td.constructor(['serializeToString'])),
			mockClip = td.replace(navigator, 'clipboard', td.object(['writeText'])),
			mockImgElm = td.replace(globalThis, 'Image', _mockImg),
			mockCanvas = td.replace(globalThis, 'OffscreenCanvas', _mockCanvas),
			mockCanvasInst = td.instance(_mockCanvas);


		await td.replaceEsm(modulePaths.scribeHand, null, _mockScribe);

		return {
			/** @type {Hand.Egress} */
			freshModule: (await import(`${modulePaths.egressHand}?v=${NodeCrypto.randomUUID()}`)).default,
			moduleConsole: mockConsole,
			moduleWindow: mockWindow,
			moduleDoc: mockDoc,
			moduleXMLS: mockXMLS,
			moduleClipboard: mockClip,
			moduleImg: mockImgElm,
			moduleCanvas: mockCanvas,
			moduleCanvasInst: mockCanvasInst,
			moduleLogger: _mockScribe
		};
	};


test('pcs:hand:egress:exportTest should run without issue', async (swear) => {
	let bonafiedResult, bonafiedExplntns = [];
	const
		imagineArgument = "Cards:\n====\nThis is for the clipboards",

		/** @type {Hand.Egress} */
		impMeta = await getImport(defaultSpecHTML);


	td.when(impMeta.moduleClipboard.writeText(imagineArgument)).thenResolve(undefined);

	bonafiedResult = await impMeta.freshModule.exportText("This is for the clipboards");

	bonafiedExplntns.push(td.explain(impMeta.moduleClipboard.writeText));
	bonafiedExplntns.push(td.explain(impMeta.moduleLogger.issuelog));

	td.reset();


	swear.plan(4);
	swear.ok(bonafiedResult, "Should return true");
	swear.isEqual(bonafiedExplntns[0].callCount, 1, "Should access clipboard");
	swear.isEqual(bonafiedExplntns[0].calls[0].args[0], imagineArgument,
		"Should copy formatted text to clipboard"
	);
	swear.isEqual(bonafiedExplntns[1].callCount, 0, "Should have no issue");
});


test('pcs:hand:egress:exportTest should have issues', async (swear) => {
	let
		bonafiedResults = [],
		bonafiedExplntns = [];
	const
		imagineArgs = [
			"Cards:\n====\nThis is also for the clipboards",
			"Cards:\n====\nThis is for the clipboards by the clipboards"
		],

		impMeta = await getImport(defaultSpecHTML);


	td.when(impMeta.moduleClipboard.writeText(imagineArgs[0])).thenThrow(
		new DOMException("eep", "NotAllowedError")
	);

	td.when(impMeta.moduleClipboard.writeText(imagineArgs[1])).thenThrow(new Error("oops"));

	bonafiedResults.push((await impMeta.freshModule.exportText(imagineArgs[0].split("Cards:\n====\n")[1])));
	bonafiedResults.push((await impMeta.freshModule.exportText(imagineArgs[1].split("Cards:\n====\n")[1])));

	bonafiedExplntns.push(td.explain(impMeta.moduleClipboard.writeText));
	bonafiedExplntns.push(td.explain(impMeta.moduleLogger.issuelog));

	td.reset();


	swear.plan(8);
	swear.notOk(bonafiedResults[0], "Should return false");
	swear.notOk(bonafiedResults[1], "Should return false");
	swear.isEqual(bonafiedExplntns[0].callCount, 2, "Should attempt to access clipboard");
	swear.isEqual(bonafiedExplntns[1].callCount, 2, "Should have issue");
	swear.isEqual(bonafiedExplntns[1].calls[0].cloneArgs.length, 4,
		"Should log issue in expected manner"
	);
	swear.isEqual(bonafiedExplntns[1].calls[0].cloneArgs[0], "Clipboard permission needed",
		"Should have expected issue"
	);
	swear.isEqual(bonafiedExplntns[1].calls[1].cloneArgs.length, 3,
		"Should log issue in expected manner"
	);
	swear.isEqual(bonafiedExplntns[1].calls[1].cloneArgs[0], "Issue occured copying to clipboard",
		"Should have expected issue"
	);
});


test("pcs:hand:egress:generateImage should run without issue", async (swear) => {
	let bonafiedExplntns = [];
	const
		swearSpriteList = Array.from({length: 52}, (_, _idx) => { return `#${_idx}`; }),
		swearSVGSelector = 'test-vector',
		swearSVG = `<svg id="${swearSVGSelector}"><defs><symbol><rect></rect></symbol></defs></svg>`,
		swearHTML = `<!doctype html><html lang="en"><body>${swearSVG}</body></html>`,

		impMeta = await getImport(swearHTML);


	impMeta.moduleImg.prototype.decode = td.func();
	impMeta.moduleCanvasInst.getContext = td.func();
	impMeta.moduleCanvasInst.toDataURL = td.func();
	td.when(impMeta.moduleCanvas(0, 0)).thenReturn(impMeta.moduleCanvasInst);
	td.when(impMeta.moduleCanvasInst.getContext('2d')).thenReturn(td.object(['drawImage']));
	td.when(impMeta.moduleXMLS(td.matchers.anything())).thenReturn(swearSVG.toWellFormed());
	td.when(impMeta.moduleImg.prototype.decode()).thenResolve(undefined);
	td.when(impMeta.moduleCanvasInst.toDataURL()).thenReturn("12d34");

	await impMeta.freshModule.generateImage("#333", swearSpriteList, `#${swearSVGSelector}`);

	bonafiedExplntns.push(td.explain(impMeta.moduleLogger.issuelog));
	bonafiedExplntns.push(td.explain(impMeta.moduleCanvasInst.toDataURL));

	td.reset();


	swear.plan(4);
	swear.isEqual(bonafiedExplntns[0].callCount, 0, "Should have no issues");
	swear.isEqual(bonafiedExplntns[1].callCount, 1, "Should generate image via data url");
	swear.isEqual(impMeta.moduleCanvasInst.width, 1000, "Should create canvas and set width");
	swear.isEqual(impMeta.moduleCanvasInst.height, 400, "Should create canvas and set height");
});


test("pcs:hand:egress:generateImage should have issues", async (swear) => {
	let bonafiedResults = [], bonafiedExplntns = [];
	const
		swearSpriteLists = [
			Array.from({length: 51}, (_, _idx) => { return `#${_idx}`; }),
			Array.from({length: 52}, (_, _idx) => { return `#${_idx}`; }),
		],
		swearSVGSelectors = [
			'test-vector',
			'test-vectol'
		],
		swearSVG = `<svg id="${swearSVGSelectors[0]}"><defs><symbol><rect></rect></symbol></defs></svg>`,
		swearHTML = `<!doctype html><html lang="en"><body>${swearSVG}</body></html>`,

		/** @type {Hand.Egress} */
		impMeta = await getImport(swearHTML);


	impMeta.moduleImg.prototype.decode = td.func();
	impMeta.moduleCanvasInst.getContext = td.func();
	impMeta.moduleCanvasInst.toDataURL = td.func();
	td.when(impMeta.moduleCanvas(0, 0)).thenReturn(impMeta.moduleCanvasInst);
	td.when(impMeta.moduleCanvasInst.getContext('2d')).thenReturn(td.object(['drawImage']));

	bonafiedResults.push(
		await impMeta.freshModule.generateImage("#333", swearSpriteLists[0], `#${swearSVGSelectors[0]}`)
	);

	bonafiedResults.push(
		await impMeta.freshModule.generateImage("#333", swearSpriteLists[1], `#${swearSVGSelectors[1]}`)
	);

	bonafiedExplntns.push(td.explain(impMeta.moduleLogger.issuelog));
	bonafiedExplntns.push(td.explain(impMeta.moduleCanvasInst.toDataURL));

	td.reset();


	swear.plan(5);
	swear.isEqual(bonafiedExplntns[0].callCount, 2, "Should have issues");
	swear.isEqual(bonafiedExplntns[1].callCount, 0, "Should generate no image");
	swear.isEqual(bonafiedResults.join(""), "", "Should generate no image");
	swear.isEqual(bonafiedExplntns[0].calls[0].cloneArgs[0], "Missing components for image download",
		"Should log expected issue"
	);
	swear.isEqual(bonafiedExplntns[0].calls[1].cloneArgs[0], "Missing components for image download",
		"Should log expected issue"
	);
});


test("pcs:hand:egress:generateImage should have issues (cont)", async (swear) => {
	let bonafiedResults = [], bonafiedExplntns = [];
	const
		swearSpriteList = Array.from({length: 52}, (_, _idx) => { return `#${_idx}`; }),
		swearSVGSelector = 'test-vector',
		swearSVG = `<svg id="${swearSVGSelector}"><defs><symbol><rect></rect></symbol></defs></svg>`,
		swearHTML = `<!doctype html><html lang="en"><body>${swearSVG}</body></html>`,

		impMeta = await getImport(swearHTML);


	impMeta.moduleImg.prototype.decode = td.func();
	impMeta.moduleCanvasInst.getContext = td.func();
	impMeta.moduleCanvasInst.toDataURL = td.func();
	td.when(impMeta.moduleCanvas(0, 0)).thenReturn(impMeta.moduleCanvasInst);
	td.when(impMeta.moduleCanvasInst.getContext('2d')).thenReturn(td.object(['drawImage']));
	td.when(impMeta.moduleXMLS(td.matchers.anything())).thenReturn(swearSVG.toWellFormed());

	td.when(impMeta.moduleCanvasInst.toDataURL()).thenThrow(new DOMException('darn', 'SecurityError'));
	bonafiedResults.push(
		await impMeta.freshModule.generateImage("#333", swearSpriteList, `#${swearSVGSelector}`)
	);

	td.when(impMeta.moduleImg.prototype.decode()).thenThrow(new DOMException('oops', 'EncodingError'));
	bonafiedResults.push(
		await impMeta.freshModule.generateImage("#333", swearSpriteList, `#${swearSVGSelector}`)
	);


	bonafiedExplntns.push(td.explain(impMeta.moduleLogger.issuelog));
	bonafiedExplntns.push(td.explain(impMeta.moduleCanvasInst.toDataURL));

	td.reset();


	swear.plan(5);
	swear.isEqual(bonafiedExplntns[0].callCount, 2, "Should have issues");
	swear.isEqual(bonafiedExplntns[1].callCount, 1, "Should attempt to generate image once");
	swear.isEqual(bonafiedResults.join(""), "", "Should generate no image");
	swear.isEqual(bonafiedExplntns[0].calls[0].cloneArgs[0], "Issue with canvas", "Should log expected issue");
	swear.isEqual(bonafiedExplntns[0].calls[1].cloneArgs[0], "Issue with image decode",
		"Should log expected issue"
	);
});

test("pcs:hand:egress:generateImage should have issues (cont'd)", async (swear) => {
	let bonafiedResult, bonafiedExplntns = [];
	const
		swearSpriteList = Array.from({length: 52}, (_, _idx) => { return `#${_idx}`; }),
		swearSVGSelector = 'test-vector',
		swearSVG = `<svg id="${swearSVGSelector}"><defs><symbol><rect></rect></symbol></defs></svg>`,
		swearHTML = `<!doctype html><html lang="en"><body>${swearSVG}</body></html>`,
		swear2DCTX = { drawImage: () => { throw new DOMException('welp', 'BadThing') } },

		impMeta = await getImport(swearHTML);


	impMeta.moduleImg.prototype.decode = td.func();
	impMeta.moduleCanvasInst.toDataURL = td.func();
	impMeta.moduleCanvasInst.getContext = () => { return swear2DCTX; };
	td.when(impMeta.moduleCanvas(0, 0)).thenReturn(impMeta.moduleCanvasInst);
	td.when(impMeta.moduleCanvasInst.getContext('2d')).thenReturn(swear2DCTX);
	td.when(impMeta.moduleXMLS(td.matchers.anything())).thenReturn(swearSVG.toWellFormed());

	bonafiedResult = await impMeta.freshModule.generateImage("#333", swearSpriteList, `#${swearSVGSelector}`);

	bonafiedExplntns.push(td.explain(impMeta.moduleLogger.issuelog));
	bonafiedExplntns.push(td.explain(impMeta.moduleCanvasInst.toDataURL));

	td.reset();


	swear.plan(4);
	swear.isEqual(bonafiedExplntns[0].callCount, 1, "Should have issue");
	swear.isEqual(bonafiedExplntns[1].callCount, 0, "Should generate no image");
	swear.isEqual(bonafiedResult, "", "Should generate no image");
	swear.isEqual(bonafiedExplntns[0].calls[0].cloneArgs[0], "Issue with web API",
		"Should log expected issue"
	);
});

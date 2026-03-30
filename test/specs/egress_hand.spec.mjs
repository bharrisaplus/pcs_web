/**
 * @import {Hand} from '../../source/behavior/_meta/_typedefs.mjs';
 */

import { default as NodeCrypto } from 'node:crypto';
import { default as test } from 'tape';
import { parseHTML as linkeParse } from 'linkedom';
import {
	object as tdObj,
	constructor as tdCnstrct,
	replace as tdSwap,
	instance as tdInst,
	replaceEsm as tdSwapEsm,
	explain as tdExpln,
	reset as tdClr,
	when as tdStub,
	func as tdFunc,
	matchers as tdMatches
} from 'testdouble';


const
	defaultSpecHTML = `<!doctype html><html lang="en"><body></body></html>`,
	modulePaths = {
		scribeHand: '../../source/behavior/hands/scribe.hand.mjs',
		egressHand: '../../source/behavior/hands/egress.hand.mjs'
	},

	getImport = async (mockMarkup = defaultSpecHTML) => {
		const
			{ Image: _mockImg, document: _mockDoc, window: _mockWindow } = linkeParse(mockMarkup),
			_mockScribe = tdObj(['issuelog']),
			_mockCanvas = tdCnstrct(_mockWindow.HTMLCanvasElement),
			_mockXMLS = tdCnstrct(['serializeToString']),

			mockConsole = tdSwap(globalThis, 'console', tdObj({})),
			mockWindow = tdSwap(globalThis, 'window', _mockWindow),
			mockDoc = tdSwap(globalThis, 'document', _mockDoc),
			mockXMLS = tdSwap(globalThis, 'XMLSerializer', _mockXMLS),
			mockXMLSInst = tdInst(_mockXMLS),
			mockClip = tdSwap(navigator, 'clipboard', tdObj(['writeText'])),
			mockImgElm = tdSwap(globalThis, 'Image', _mockImg),
			mockCanvas = tdSwap(globalThis, 'OffscreenCanvas', _mockCanvas),
			mockCanvasInst = tdInst(_mockCanvas);


		await tdSwapEsm(modulePaths.scribeHand, null, _mockScribe);

		return {
			/** @type {Hand.Egress} */
			freshModule: (await import(`${modulePaths.egressHand}?v=${NodeCrypto.randomUUID()}`)).default,
			moduleConsole: mockConsole,
			moduleWindow: mockWindow,
			moduleDoc: mockDoc,
			moduleXMLS: mockXMLS,
			moduleXMLSInst: mockXMLSInst,
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

		impMeta = await getImport();


	tdStub(impMeta.moduleClipboard.writeText(imagineArgument)).thenResolve(undefined);

	bonafiedResult = await impMeta.freshModule.exportText("This is for the clipboards");

	bonafiedExplntns.push(tdExpln(impMeta.moduleClipboard.writeText));
	bonafiedExplntns.push(tdExpln(impMeta.moduleLogger.issuelog));

	tdClr();
	delete impMeta.freshModule;


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

		impMeta = await getImport();


	tdStub(impMeta.moduleClipboard.writeText(imagineArgs[0])).thenThrow(
		new DOMException("eep", "NotAllowedError")
	);

	tdStub(impMeta.moduleClipboard.writeText(imagineArgs[1])).thenThrow(new Error("oops"));

	bonafiedResults.push((await impMeta.freshModule.exportText(imagineArgs[0].split("Cards:\n====\n")[1])));
	bonafiedResults.push((await impMeta.freshModule.exportText(imagineArgs[1].split("Cards:\n====\n")[1])));

	bonafiedExplntns.push(tdExpln(impMeta.moduleClipboard.writeText));
	bonafiedExplntns.push(tdExpln(impMeta.moduleLogger.issuelog));

	tdClr();
	delete impMeta.freshModule;


	swear.plan(8);
	swear.notOk(bonafiedResults[0], "Should return false");
	swear.notOk(bonafiedResults[1], "Should return false");
	swear.isEqual(bonafiedExplntns[0].callCount, 2, "Should attempt to access clipboard");
	swear.isEqual(bonafiedExplntns[1].callCount, 2, "Should have issue");
	swear.isEqual(bonafiedExplntns[1].calls[0].args.length, 4,
		"Should log issue in expected manner"
	);
	swear.isEqual(bonafiedExplntns[1].calls[0].args[0], "Clipboard permission needed",
		"Should have expected issue"
	);
	swear.isEqual(bonafiedExplntns[1].calls[1].args.length, 3,
		"Should log issue in expected manner"
	);
	swear.isEqual(bonafiedExplntns[1].calls[1].args[0], "Issue occured copying to clipboard",
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


	impMeta.moduleImg.prototype.decode = tdFunc();
	tdStub(new impMeta.moduleCanvas(0, 0)).thenReturn(impMeta.moduleCanvasInst);
	tdStub(impMeta.moduleCanvasInst.getContext('2d')).thenReturn(tdObj(['drawImage']));
	tdStub(impMeta.moduleXMLSInst.serializeToString(tdMatches.anything())).thenReturn(swearSVG.toWellFormed());
	tdStub(impMeta.moduleImg.prototype.decode()).thenResolve(undefined);
	tdStub(impMeta.moduleCanvasInst.toDataURL()).thenReturn("12d34");

	await impMeta.freshModule.generateImage("#333", swearSpriteList, `#${swearSVGSelector}`);

	bonafiedExplntns.push(tdExpln(impMeta.moduleLogger.issuelog));
	bonafiedExplntns.push(tdExpln(impMeta.moduleCanvasInst.toDataURL));

	tdClr();
	delete impMeta.freshModule;


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

		impMeta = await getImport(swearHTML);


	impMeta.moduleImg.prototype.decode = tdFunc();
	tdStub(new impMeta.moduleCanvas(0, 0)).thenReturn(impMeta.moduleCanvasInst);
	tdStub(impMeta.moduleCanvasInst.getContext('2d')).thenReturn(tdObj(['drawImage']));

	bonafiedResults.push(
		await impMeta.freshModule.generateImage("#333", swearSpriteLists[0], `#${swearSVGSelectors[0]}`)
	);

	bonafiedResults.push(
		await impMeta.freshModule.generateImage("#333", swearSpriteLists[1], `#${swearSVGSelectors[1]}`)
	);

	bonafiedExplntns.push(tdExpln(impMeta.moduleLogger.issuelog));
	bonafiedExplntns.push(tdExpln(impMeta.moduleCanvasInst.toDataURL));

	tdClr();
	delete impMeta.freshModule;


	swear.plan(5);
	swear.isEqual(bonafiedExplntns[0].callCount, 2, "Should have issues");
	swear.isEqual(bonafiedExplntns[1].callCount, 0, "Should generate no image");
	swear.isEqual(bonafiedResults.join(""), "", "Should generate no image");
	swear.isEqual(bonafiedExplntns[0].calls[0].args[0], "Missing components for image download",
		"Should log expected issue"
	);
	swear.isEqual(bonafiedExplntns[0].calls[1].args[0], "Missing components for image download",
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


	impMeta.moduleImg.prototype.decode = tdFunc();
	tdStub(new impMeta.moduleCanvas(0, 0)).thenReturn(impMeta.moduleCanvasInst);
	tdStub(impMeta.moduleCanvasInst.getContext('2d')).thenReturn(tdObj(['drawImage']));
	tdStub(impMeta.moduleXMLSInst.serializeToString(tdMatches.anything())).thenReturn(swearSVG.toWellFormed());

	tdStub(impMeta.moduleCanvasInst.toDataURL()).thenThrow(new DOMException('darn', 'SecurityError'));
	bonafiedResults.push(
		await impMeta.freshModule.generateImage("#333", swearSpriteList, `#${swearSVGSelector}`)
	);

	tdStub(impMeta.moduleImg.prototype.decode()).thenThrow(new DOMException('oops', 'EncodingError'));
	bonafiedResults.push(
		await impMeta.freshModule.generateImage("#333", swearSpriteList, `#${swearSVGSelector}`)
	);


	bonafiedExplntns.push(tdExpln(impMeta.moduleLogger.issuelog));
	bonafiedExplntns.push(tdExpln(impMeta.moduleCanvasInst.toDataURL));

	tdClr();
	delete impMeta.freshModule;


	swear.plan(5);
	swear.isEqual(bonafiedExplntns[0].callCount, 2, "Should have issues");
	swear.isEqual(bonafiedExplntns[1].callCount, 1, "Should attempt to generate image once");
	swear.isEqual(bonafiedResults.join(""), "", "Should generate no image");
	swear.isEqual(bonafiedExplntns[0].calls[0].args[0], "Issue with canvas", "Should log expected issue");
	swear.isEqual(bonafiedExplntns[0].calls[1].args[0], "Issue with image decode",
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


	impMeta.moduleImg.prototype.decode = tdFunc();

	tdStub(new impMeta.moduleCanvas(0, 0)).thenReturn(impMeta.moduleCanvasInst);
	tdStub(impMeta.moduleCanvasInst.getContext('2d')).thenReturn(swear2DCTX);
	tdStub(impMeta.moduleXMLSInst.serializeToString(tdMatches.anything())).thenReturn(swearSVG.toWellFormed());

	bonafiedResult = await impMeta.freshModule.generateImage("#333", swearSpriteList, `#${swearSVGSelector}`);

	bonafiedExplntns.push(tdExpln(impMeta.moduleLogger.issuelog));
	bonafiedExplntns.push(tdExpln(impMeta.moduleCanvasInst.toDataURL));

	tdClr();
	delete impMeta.freshModule;


	swear.plan(4);
	swear.isEqual(bonafiedExplntns[0].callCount, 1, "Should have issue");
	swear.isEqual(bonafiedExplntns[1].callCount, 0, "Should generate no image");
	swear.isEqual(bonafiedResult, "", "Should generate no image");
	swear.isEqual(bonafiedExplntns[0].calls[0].args[0], "Issue with web API",
		"Should log expected issue"
	);
});

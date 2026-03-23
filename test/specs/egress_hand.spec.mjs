/**
 * @import {Hand} from '../../source/behavior/_meta/_typedefs.mjs';
 */

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
	getImport = async (mockScribe, mockWindow, mockDoc, mockXMLS, mockClip, mockImg, mockCanvas) => {
		td.replace(globalThis, 'console', td.object(['error', 'debug', 'warn']));
		td.replace(globalThis, 'document', mockDoc);
		td.replace(globalThis, 'window', mockWindow);
		td.replace(globalThis, 'XMLSerializer', mockXMLS);
		td.replace(navigator, 'clipboard', mockClip);
		td.replace(globalThis, 'Image', mockImg);
		td.replace(globalThis, 'OffscreenCanvas', mockCanvas);
		td.replaceEsm(modulePaths.scribeHand, null, mockScribe);

		return (await import(modulePaths.egressHand)).default;
	};


test('pcs:hand:egress:exportTest should run without issue', async (swear) => {
	let bonafiedResult, bonafiedExplntns = [];
	const
		swearScribe = td.object(['issuelog']),
		swearXMLSerializer = td.constructor(['serializeToString']),
		swearClipboard = td.object(['writeText']),
		{
			Image: swearImg,
			document: swearDoc,
			window: swearWindow
		} = linkeParse(defaultSpecHTML),

		imagineArgument = "Cards:\n====\nThis is for the clipboards",

		/** @type {Hand.Egress} */
		egressHand = await getImport(
			swearScribe, swearWindow, swearDoc, swearXMLSerializer, swearClipboard, swearImg
		);


	td.when(swearClipboard.writeText(imagineArgument)).thenResolve(undefined);

	bonafiedResult = await egressHand.exportText("This is for the clipboards");

	bonafiedExplntns.push(td.explain(swearClipboard.writeText));
	bonafiedExplntns.push(td.explain(swearScribe.issuelog));

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
		swearScribe = td.object(['issuelog']),
		swearXMLSerializer = td.constructor(['serializeToString']),
		swearClipboard = td.object(['writeText']),
		{
			Image: swearImg,
			document: swearDoc,
			window: swearWindow
		} = linkeParse(defaultSpecHTML),

		imagineArgs = [
			"Cards:\n====\nThis is also for the clipboards",
			"Cards:\n====\nThis is for the clipboards by the clipboards"
		],

		/** @type {Hand.Egress} */
		egressHand = await getImport(
			swearScribe, swearWindow, swearDoc, swearXMLSerializer, swearClipboard, swearImg
		);


	td.when(swearClipboard.writeText(imagineArgs[0])).thenThrow(new DOMException("eep", "NotAllowedError"));

	td.when(swearClipboard.writeText(imagineArgs[1])).thenThrow(new Error("oops"));

	bonafiedResults.push((await egressHand.exportText(imagineArgs[0].split("Cards:\n====\n")[1])));
	bonafiedResults.push((await egressHand.exportText(imagineArgs[1].split("Cards:\n====\n")[1])));

	bonafiedExplntns.push(td.explain(swearClipboard.writeText));
	bonafiedExplntns.push(td.explain(swearScribe.issuelog));

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
		swearScribe = td.object(['issuelog']),
		swearXMLSerializer = td.constructor(['serializeToString']),
		swearClipboard = td.object(),
		swearSpriteList = Array.from({length: 52}, (_, _idx) => { return `#${_idx}`; }),
		swearSVGSelector = 'test-vector',
		swearSVG = `<svg id="${swearSVGSelector}"><defs><symbol><rect></rect></symbol></defs></svg>`,
		swearHTML = `<!doctype html><html lang="en"><body>${swearSVG}</body></html>`,
		{
			Image: linkeImg,
			document: swearDoc,
			window: swearWindow
		} = linkeParse(swearHTML),
		swearImg = td.constructor(linkeImg),
		swearCanvas = td.constructor(swearDoc.HTMLCanvasElement),
		swearCanvasInst = td.instance(swearCanvas),

		/** @type {Hand.Egress} */
		egressHand = await getImport(
			swearScribe, swearWindow, swearDoc, swearXMLSerializer, swearClipboard, swearImg, swearCanvas
		);


	swearImg.prototype.decode = td.func();
	swearCanvasInst.getContext = td.func();
	swearCanvasInst.toDataURL = td.func();
	td.when(swearCanvas(0, 0)).thenReturn(swearCanvasInst);
	td.when(swearCanvasInst.getContext('2d')).thenReturn(td.object(['drawImage']));
	td.when(swearXMLSerializer(td.matchers.anything())).thenReturn(swearSVG.toWellFormed());
	td.when(swearImg.prototype.decode()).thenResolve(undefined);
	td.when(swearCanvasInst.toDataURL()).thenReturn("12d34");

	await egressHand.generateImage("#333", swearSpriteList, `#${swearSVGSelector}`);
	
	bonafiedExplntns.push(td.explain(swearScribe.issuelog));
	bonafiedExplntns.push(td.explain(swearCanvasInst.toDataURL));

	td.reset();


	swear.plan(4);
	swear.isEqual(bonafiedExplntns[0].callCount, 0, "Should have no issues");
	swear.isEqual(bonafiedExplntns[1].callCount, 1, "Should generate image via data url");
	swear.isEqual(swearCanvasInst.width, 1000, "Should create canvas and set width");
	swear.isEqual(swearCanvasInst.height, 400, "Should create canvas and set height");
});


test("pcs:hand:egress:generateImage should have issues", async (swear) => {
	let bonafiedResults = [], bonafiedExplntns = [];
	const
		swearScribe = td.object(['issuelog']),
		swearXMLSerializer = td.constructor(['serializeToString']),
		swearClipboard = td.object(),
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
		{
			Image: linkeImg,
			document: swearDoc,
			window: swearWindow
		} = linkeParse(swearHTML),
		swearImg = td.constructor(linkeImg),
		swearCanvas = td.constructor(swearDoc.HTMLCanvasElement),
		swearCanvasInst = td.instance(swearCanvas),

		/** @type {Hand.Egress} */
		egressHand = await getImport(
			swearScribe, swearWindow, swearDoc, swearXMLSerializer, swearClipboard, swearImg, swearCanvas
		);


	swearImg.prototype.decode = td.func();
	swearCanvasInst.getContext = td.func();
	swearCanvasInst.toDataURL = td.func();
	td.when(swearCanvas(0, 0)).thenReturn(swearCanvasInst);
	td.when(swearCanvasInst.getContext('2d')).thenReturn(td.object(['drawImage']));

	bonafiedResults.push(
		await egressHand.generateImage("#333", swearSpriteLists[0], `#${swearSVGSelectors[0]}`)
	);

	bonafiedResults.push(
		await egressHand.generateImage("#333", swearSpriteLists[1], `#${swearSVGSelectors[1]}`)
	);

	bonafiedExplntns.push(td.explain(swearScribe.issuelog));
	bonafiedExplntns.push(td.explain(swearCanvasInst.toDataURL));

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
		swearScribe = td.object(['issuelog']),
		swearXMLSerializer = td.constructor(['serializeToString']),
		swearClipboard = td.object(),
		swearSpriteList = Array.from({length: 52}, (_, _idx) => { return `#${_idx}`; }),
		swearSVGSelector = 'test-vector',
		swearSVG = `<svg id="${swearSVGSelector}"><defs><symbol><rect></rect></symbol></defs></svg>`,
		swearHTML = `<!doctype html><html lang="en"><body>${swearSVG}</body></html>`,
		{
			Image: linkeImg,
			document: swearDoc,
			window: swearWindow
		} = linkeParse(swearHTML),
		swearImg = td.constructor(linkeImg),
		swearCanvas = td.constructor(swearDoc.HTMLCanvasElement),
		swearCanvasInst = td.instance(swearCanvas),

		/** @type {Hand.Egress} */
		egressHand = await getImport(
			swearScribe, swearWindow, swearDoc, swearXMLSerializer, swearClipboard, swearImg, swearCanvas
		);


	swearImg.prototype.decode = td.func();
	swearCanvasInst.getContext = td.func();
	swearCanvasInst.toDataURL = td.func();
	td.when(swearCanvas(0, 0)).thenReturn(swearCanvasInst);
	td.when(swearCanvasInst.getContext('2d')).thenReturn(td.object(['drawImage']));
	td.when(swearXMLSerializer(td.matchers.anything())).thenReturn(swearSVG.toWellFormed());

	td.when(swearCanvasInst.toDataURL()).thenThrow(new DOMException('darn', 'SecurityError'));
	bonafiedResults.push(
		await egressHand.generateImage("#333", swearSpriteList, `#${swearSVGSelector}`)
	);

	td.when(swearImg.prototype.decode()).thenThrow(new DOMException('oops', 'EncodingError'));
	bonafiedResults.push(
		await egressHand.generateImage("#333", swearSpriteList, `#${swearSVGSelector}`)
	);


	bonafiedExplntns.push(td.explain(swearScribe.issuelog));
	bonafiedExplntns.push(td.explain(swearCanvasInst.toDataURL));

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
		swearScribe = td.object(['issuelog']),
		swearXMLSerializer = td.constructor(['serializeToString']),
		swearClipboard = td.object(),
		swearSpriteList = Array.from({length: 52}, (_, _idx) => { return `#${_idx}`; }),
		swearSVGSelector = 'test-vector',
		swearSVG = `<svg id="${swearSVGSelector}"><defs><symbol><rect></rect></symbol></defs></svg>`,
		swearHTML = `<!doctype html><html lang="en"><body>${swearSVG}</body></html>`,
		{
			Image: linkeImg,
			document: swearDoc,
			window: swearWindow
		} = linkeParse(swearHTML),
		swearImg = td.constructor(linkeImg),
		swearCanvas = td.constructor(swearDoc.HTMLCanvasElement),
		swearCanvasInst = td.instance(swearCanvas),
		swear2DCTX = { drawImage: () => { throw new DOMException('welp', 'BadThing') } },

		/** @type {Hand.Egress} */
		egressHand = await getImport(
			swearScribe, swearWindow, swearDoc, swearXMLSerializer, swearClipboard, swearImg, swearCanvas
		);


	swearImg.prototype.decode = td.func();
	swearCanvasInst.toDataURL = td.func();
	swearCanvasInst.getContext = () => { return swear2DCTX; };
	td.when(swearCanvas(0, 0)).thenReturn(swearCanvasInst);
	td.when(swearCanvasInst.getContext('2d')).thenReturn(swear2DCTX);
	td.when(swearXMLSerializer(td.matchers.anything())).thenReturn(swearSVG.toWellFormed());

	bonafiedResult = await egressHand.generateImage("#333", swearSpriteList, `#${swearSVGSelector}`);
	
	bonafiedExplntns.push(td.explain(swearScribe.issuelog));
	bonafiedExplntns.push(td.explain(swearCanvasInst.toDataURL));

	td.reset();


	swear.plan(4);
	swear.isEqual(bonafiedExplntns[0].callCount, 1, "Should have issue");
	swear.isEqual(bonafiedExplntns[1].callCount, 0, "Should generate no image");
	swear.isEqual(bonafiedResult, "", "Should generate no image");
	swear.isEqual(bonafiedExplntns[0].calls[0].cloneArgs[0], "Issue with web API",
		"Should log expected issue"
	);
});

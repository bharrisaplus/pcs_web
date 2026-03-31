/**
 * @import {Shuttle} from '../../source/behavior/_meta/_typedefs.mjs';
 */

import { default as NodeCrypto } from 'node:crypto';
import { default as test } from 'tape';
import { parseHTML as linkeParse } from 'linkedom';
import {
	object as tdObj,
	replace as tdSwap,
	replaceEsm as tdSwapEsm,
	func as tdFunc,
	when as tdStub,
	explain as tdExpln,
	reset as tdClr
} from 'testdouble';


const
	modulePaths = {
		hands: {
			scribe: '../../source/behavior/hands/scribe.hand.mjs'
		},
		shuttles: {
			host: '../../source/behavior/shuttles/host.shuttle.mjs'
		}
	},

	getImport = async () => {
		const
			_mockHTML = `<!doctype html><html><body></body></html>`,
			_mockScribe = tdObj(['issuelog']),
			{ document: _mockDoc, window: _mockWindow } = linkeParse(_mockHTML),

			mockConsole = tdSwap(globalThis, 'console', tdObj()),
			mockWindow = tdSwap(globalThis, 'window', _mockWindow),
			mockDoc = tdSwap(globalThis, 'document', _mockDoc),
			mockFetch = tdSwap(globalThis, 'fetch', tdFunc());

		await tdSwapEsm(modulePaths.hands.scribe, null, _mockScribe);

		return {
			freshModule: (await import(`${modulePaths.shuttles.host}?v=${NodeCrypto.randomUUID()}`)).default,
			moduleConsole: mockConsole,
			moduleWindow: mockWindow,
			moduleDoc: mockDoc,
			moduleLogger: _mockScribe,
			moduleFetch: mockFetch
		};
	};


test("pcs:shuttle:host:grabFile should run without issue", async (swear) => {
	let bonafiedResult, bonafiedExplntn,
		/** @type {Shuttle.Host} */
		hostShuttle;
	const
		swearLink = "https://ssomesite.com",
		swearBody = new Blob(),
		impMeta = await getImport();


	hostShuttle = impMeta.freshModule();

	tdStub(impMeta.moduleFetch(swearLink)).thenResolve(new Response(swearBody))

	bonafiedResult = await hostShuttle.grabFile(swearLink);
	bonafiedExplntn = tdExpln(impMeta.moduleLogger.issuelog);

	tdClr();
	impMeta.freshModule = null;
	hostShuttle = null;


	swear.plan(2);
	swear.ok(bonafiedResult instanceof Blob, "return good value");
	swear.equals(bonafiedExplntn.callCount, 0, "no issue log");
});


test("pcs:shuttle:host:grabFile should have issues", async (swear) => {
	let bonafiedResults = [], bonafiedExplntns = [],
		/** @type {Shuttle.Host} */
		hostShuttle;
	const
		swearLinks = [
			"https://ssomesite.com",
			"https://ssomesite.xyz",
			"https://ssomesite.net",
			"https://ssomesitee.com",
			"https://ssomesitee.xyz",
			"https://ssomesitee.net",
		],
		swearResponses = [
			{ ok: true, status: 200, blob: tdFunc() },
			{ ok: true, status: 200, blob: tdFunc() }

		],
		impMeta = await getImport();


	hostShuttle = impMeta.freshModule();

	tdStub(impMeta.moduleFetch(swearLinks[0])).thenResolve(new Response(null, {status: 404}));
	bonafiedResults.push(await hostShuttle.grabFile(swearLinks[0]));

	tdStub(impMeta.moduleFetch(swearLinks[1])).thenReject(new DOMException('oopsie', 'AbortError'));
	bonafiedResults.push(await hostShuttle.grabFile(swearLinks[1]));

	tdStub(impMeta.moduleFetch(swearLinks[2])).thenReject(new DOMException('darn', 'NotAllowedError'));
	bonafiedResults.push(await hostShuttle.grabFile(swearLinks[2]));

	tdStub(impMeta.moduleFetch(swearLinks[3])).thenReject(new TypeError('welp'));
	bonafiedResults.push(await hostShuttle.grabFile(swearLinks[3]));

	tdStub(swearResponses[0].blob()).thenReject(new DOMException('not again', 'AbortError'));
	tdStub(impMeta.moduleFetch(swearLinks[4])).thenResolve(swearResponses[0]);
	bonafiedResults.push(await hostShuttle.grabFile(swearLinks[4]));

	tdStub(swearResponses[1].blob()).thenReject(new TypeError('whoops'));
	tdStub(impMeta.moduleFetch(swearLinks[5])).thenResolve(swearResponses[1]);
	bonafiedResults.push(await hostShuttle.grabFile(swearLinks[5]));

	bonafiedExplntns.push(tdExpln(impMeta.moduleLogger.issuelog));
	tdClr();
	impMeta.freshModule = null;
	hostShuttle = null;


	swear.plan(8);
	swear.ok(bonafiedResults.every((_bR) => !_bR), "return false-y value");
	swear.equals(bonafiedExplntns[0].callCount, 6, "log issue");
	swear.ok(bonafiedExplntns[0].calls[0].args[0].startsWith("Network"), "correct args for log issue");
	swear.ok(bonafiedExplntns[0].calls[1].args[0].startsWith("Aborted"), "correct args for log issue");
	swear.ok(bonafiedExplntns[0].calls[2].args[0].startsWith("Permission"), "correct args for log issue");
	swear.ok(bonafiedExplntns[0].calls[3].args[0].startsWith("Type m"), "correct args for log issue");
	swear.ok(bonafiedExplntns[0].calls[4].args[0].startsWith("Aborted"), "correct args for log issue");
	swear.ok(bonafiedExplntns[0].calls[5].args[0].startsWith("Could n"), "correct args for log issue");
});

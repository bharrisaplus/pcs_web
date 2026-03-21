/**
 * @import {Hand} from '../../source/behavior/_meta/_typedefs.mjs';
 */

import { test } from 'tape';
import * as td from 'testdouble';
import { parseHTML as linkeParse } from 'linkedom';


const
	modulePaths = {
		scribeHand: '../../source/behavior/hands/scribe.hand.mjs',
		dealerHand: '../../source/behavior/hands/dealer.hand.mjs'
	},

	// This function modifies globals so always call 'td.reset()' when done (read: before assertions).
	getImport = async (mockScribe) => {
		const
			mockHTML = `<!doctype html><html lang="en"><body></body></html>`,
			{ document: mockDoc, window: mockWindow } = linkeParse(mockHTML);

		td.replace(globalThis, 'console', td.object(['error', 'debug', 'warn']));
		td.replace(globalThis, 'document', mockDoc);
		td.replace(globalThis, 'window', mockWindow);
		td.replaceEsm(modulePaths.scribeHand, null, mockScribe);

		return await import(modulePaths.dealerHand);
	};


test('pcs:hand:dealer:getCard should return good intri', async (swear) => {
	let bonafiedResult = [], bonafiedExpln;
	const
		swearScribe = td.object(),
		swearPos = [
			[0, 0], [13, 13], [38, 38], [51, 51],
			[12,10], [40, 49], [25, 1], [13, 39]
		],
		imagineCardIntris = [
			{oglo:0,spot:0, title:'Number 1: Ace of Spade', desc:'Card in position 1', symbolRef:'#s00'},
			{oglo:13,spot:13, title:'Number 14: Ace of Diamond', desc:'Card in position 14', symbolRef:'#d13'},
			{oglo:38,spot:38, title:'Number 39: Ace of Club', desc:'Card in position 39', symbolRef:'#c38'},
			{oglo:51,spot:51, title:'Number 52: Ace of Heart', desc:'Card in position 52', symbolRef:'#h51'},
			{oglo:10,spot:12, title:'Number 13: Jack of Spade', desc:'Card in position 13', symbolRef:'#s10'},
			{oglo:49,spot:40, title:'Number 41: Three of Heart', desc:'Card in position 41', symbolRef:'#h49'},
			{oglo:1,spot:25, title:'Number 26: Two of Spade', desc:'Card in position 26', symbolRef:'#s01'},
			{oglo:39,spot:13, title:'Number 14: King of Heart', desc:'Card in position 14', symbolRef:'#h39'}
		],
		dealerHandFactory = await getImport(swearScribe),
		/** @type {Hand.Dealer} */
		dealerHand = dealerHandFactory.default();


	for (const posPair of swearPos) {
		bonafiedResult.push(dealerHand.getCard(posPair[0], posPair[1]));
	}

	bonafiedExpln = td.explain(swearScribe.issuelog);

	td.reset();


	swear.plan(9);
	swear.deepEqual(bonafiedExpln.callCount, 0, 'Should have no issue to log');
	swear.deepEqual(bonafiedResult[0], imagineCardIntris[0], 'Should match ace intri');
	swear.deepEqual(bonafiedResult[1], imagineCardIntris[1], 'Should match ace intri');
	swear.deepEqual(bonafiedResult[2], imagineCardIntris[2], 'Should match ace intri');
	swear.deepEqual(bonafiedResult[3], imagineCardIntris[3], 'Should match ace intri');
	swear.deepEqual(bonafiedResult[4], imagineCardIntris[4], 'Should match random intri');
	swear.deepEqual(bonafiedResult[5], imagineCardIntris[5], 'Should match random intri');
	swear.deepEqual(bonafiedResult[6], imagineCardIntris[6], 'Should match random intri');
	swear.deepEqual(bonafiedResult[7], imagineCardIntris[7], 'Should match random intri');
});

test('pcs:hand:dealer:getCard should return bad intri', async (swear) => {
	let bonafiedResult = [], bonafiedExpln;
	const
		swearScribe = td.object(['issuelog']),
		swearPos = [[0, -1], [5, 52], [13, 90], [-1, 0], [52, 3], [90, 25]],
		imagineCardIntris = [
			{oglo:-1,spot:0, title:'Number 1: A Card', desc:'Card in position 1', symbolRef:'#'},
			{oglo:52,spot:5, title:'Number 6: A Card', desc:'Card in position 6', symbolRef:'#'},
			{oglo:90,spot:13, title:'Number 14: A Card', desc:'Card in position 14', symbolRef:'#'},
			{oglo:0,spot:-1, title:'Number 0: A Card', desc:'Card in position 0', symbolRef:'#'},
			{oglo:3,spot:52, title:'Number 53: A Card', desc:'Card in position 53', symbolRef:'#'},
			{oglo:25,spot:90, title:'Number 91: A Card', desc:'Card in position 91', symbolRef:'#'}
		],
		dealerHandFactory = await getImport(swearScribe),
		/** @type {Hand.Dealer} */
		dealerHand = dealerHandFactory.default();


	for (const posPair of swearPos) {
		bonafiedResult.push(dealerHand.getCard(posPair[0], posPair[1]));
	}

	bonafiedExpln = td.explain(swearScribe.issuelog);

	td.reset();


	swear.plan(7);
	swear.equal(bonafiedExpln.callCount, 6, "Should log issues");
	swear.deepEqual(bonafiedResult[0], imagineCardIntris[0], 'Should match bad intri');
	swear.deepEqual(bonafiedResult[1], imagineCardIntris[1], 'Should match bad intri');
	swear.deepEqual(bonafiedResult[2], imagineCardIntris[2], 'Should match bad intri');
	swear.deepEqual(bonafiedResult[3], imagineCardIntris[3], 'Should match bad intri');
	swear.deepEqual(bonafiedResult[4], imagineCardIntris[4], 'Should match bad intri');
	swear.deepEqual(bonafiedResult[5], imagineCardIntris[5], 'Should match bad intri');
});

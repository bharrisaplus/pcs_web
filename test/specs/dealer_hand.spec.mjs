/**
 * @import {Hand} from '../../source/behavior/_meta/_typedefs.mjs';
 */

import { default as NodeCrypto } from 'node:crypto';
import { default as test } from 'tape';
import * as td from 'testdouble';
import { parseHTML as linkeParse } from 'linkedom';


const
	modulePaths = {
		hands: {
			scribe: '../../source/behavior/hands/scribe.hand.mjs',
			dealer: '../../source/behavior/hands/dealer.hand.mjs'
		}
	},

	getImport = async () => {
		const
			_mockHTML = `<!doctype html><html lang="en"><body></body></html>`,
			_mockScribe = td.object(['issuelog']),
			_mockChance = td.object(),
			{ document: _mockDoc, window: _mockWindow } = linkeParse(_mockHTML),

			mockConsole = td.replace(globalThis, 'console', td.object()),
			mockWindow = td.replace(globalThis, 'window', _mockWindow),
			mockDoc = td.replace(globalThis, 'document', _mockDoc),
			mockChance = td.replace(globalThis, 'chance', _mockChance);


		await td.replaceEsm(modulePaths.hands.scribe, null, _mockScribe);

		return {
			freshModule: (await import(`${modulePaths.hands.dealer}?v=${NodeCrypto.randomUUID()}`)).default,
			moduleConsole: mockConsole,
			moduleWindow: mockWindow,
			moduleDoc: mockDoc,
			moduleLogger: _mockScribe,
			moduleChanceJS: mockChance
		}
	};


test('pcs:hand:dealer:getCard should return good intri', async (swear) => {
	let bonafiedResult = [], bonafiedExpln;
	const
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

		impMeta = await getImport(),
		/** @type {Hand.Dealer} */
		dealerHand = impMeta.freshModule();


	for (const posPair of swearPos) {
		bonafiedResult.push(dealerHand.getCard(posPair[0], posPair[1]));
	}

	bonafiedExpln = td.explain(impMeta.moduleLogger.issuelog);

	td.reset();
	delete impMeta.freshModule;


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
		swearPos = [[0, -1], [5, 52], [13, 90], [-1, 0], [52, 3], [90, 25]],
		imagineCardIntris = [
			{oglo:-1,spot:0, title:'', desc:'', symbolRef:''},
			{oglo:52,spot:5, title:'', desc:'', symbolRef:''},
			{oglo:90,spot:13, title:'', desc:'', symbolRef:''},
			{oglo:0,spot:-1, title:'', desc:'', symbolRef:''},
			{oglo:3,spot:52, title:'', desc:'', symbolRef:''},
			{oglo:25,spot:90, title:'', desc:'', symbolRef:''}
		],

		impMeta = await getImport(),
		/** @type {Hand.Dealer} */
		dealerHand = impMeta.freshModule();


	for (const posPair of swearPos) {
		bonafiedResult.push(dealerHand.getCard(posPair[0], posPair[1]));
	}

	bonafiedExpln = td.explain(impMeta.moduleLogger.issuelog);

	td.reset();
	delete impMeta.freshModule;


	swear.plan(7);
	swear.isEqual(bonafiedExpln.callCount, 6, "Should log issues");
	swear.deepEqual(bonafiedResult[0], imagineCardIntris[0], 'Should match bad intri');
	swear.deepEqual(bonafiedResult[1], imagineCardIntris[1], 'Should match bad intri');
	swear.deepEqual(bonafiedResult[2], imagineCardIntris[2], 'Should match bad intri');
	swear.deepEqual(bonafiedResult[3], imagineCardIntris[3], 'Should match bad intri');
	swear.deepEqual(bonafiedResult[4], imagineCardIntris[4], 'Should match bad intri');
	swear.deepEqual(bonafiedResult[5], imagineCardIntris[5], 'Should match bad intri');
});


test('pcs:hand:dealer:getCard should return shuffled', async (swear) => {
	let bonafiedResult = [], bonafiedExpln;
	const
		swearCardLists = [
			Uint8Array.from([1,2,3,4,5,6,7,8]),
			Uint8Array.from([0,3,5,67,45,100,11,12,90,74,33,21,84]),
			Uint8Array.from([
				49,26,23,4,9,46,29,24,44,47,32,34,7,48,17,22,5,39,42,20,18,31,50,16,43,51,12,10,3,38,27,21,33,
				14,8,1,37,11,41,45,15,0,36,35,2,30,25,40,28,6,19,13
			])
		],
		swearPosLists = [
			Uint8Array.from([0,1,2,3,4,5,6,7]),
			Uint8Array.from([0,1,2,3,4,5,6,7,8,9,10,11,12]),
			Uint8Array.from([
				0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,
				35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51
			])
		],

		impMeta = await getImport(),
		/** @type {Hand.Dealer} */
		dealerHand = impMeta.freshModule();


	for (let chkIdx = 0; chkIdx < swearCardLists.length; chkIdx++) {
		td.when(
			impMeta.moduleChanceJS.pickset(swearCardLists[chkIdx], swearCardLists[chkIdx].length)
		).thenReturn(Array.from(swearCardLists[chkIdx]));
		td.when(
			impMeta.moduleChanceJS.pickset(swearPosLists[chkIdx], swearPosLists[chkIdx].length)
		).thenReturn(Array.from(swearPosLists[chkIdx]));
		
		bonafiedResult.push(
			dealerHand.mixUp(swearCardLists[chkIdx], swearPosLists[chkIdx])
		);
	}

	bonafiedExpln = td.explain(impMeta.moduleLogger.issuelog);

	td.reset();
	delete impMeta.freshModule;


	swear.plan(5);
	swear.isEqual(bonafiedExpln.callCount, 0, 'Should have no issue to log');
	swear.isEqual((bonafiedResult.flat()).length, (swearCardLists.flat()).length, 'Should keep all elements');
	swear.notEqual(bonafiedResult[0].toString(), swearCardLists[0].toString(),
		"Should not match starting list after shuffle"
	);
	swear.notEqual(bonafiedResult[1].toString(), swearCardLists[1].toString(),
		"Should not match starting list after shuffle"
	);
	swear.notEqual(bonafiedResult[2].toString(), swearCardLists[2].toString(),
		"Should not match starting list after shuffle"
	);
});


test('pcs:hand:dealer:getCard should return non-shuffled', async (swear) => {
	let bonafiedResult = [], bonafiedExpln;
	const
		swearCardLists = [
			Uint8Array.from([]),
			Uint8Array.from([0,3,5,67,45,100,11,12,90,74,33,21,84]),
			Uint8Array.from([
				49,26,23,4,9,46,29,24,44,47,32,34,7,48,17,22,52,39,42,20,18,31,50,16,43,51,
				12,10,3,38,27,21,33,14,8,1,37,11,41,45,15,0,36,35,2,30,25,40,28,6,19,13,5
			])
		],
		swearPosLists = [
			Uint8Array.from([]),
			Uint8Array.from([0,1,2,3,4,5,6,7,8,9,10,11]),
			Uint8Array.from([
				0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,
				35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,52
			])
		],

		impMeta = await getImport(),
		/** @type {Hand.Dealer} */
		dealerHand = impMeta.freshModule();


	for (let chkIdx = 0; chkIdx < swearCardLists.length; chkIdx++) {
		td.when(
			impMeta.moduleChanceJS.pickset(swearCardLists[chkIdx], swearCardLists[chkIdx].length)
		).thenReturn(Array.from(swearCardLists[chkIdx]));
		td.when(
			impMeta.moduleChanceJS.pickset(swearPosLists[chkIdx], swearPosLists[chkIdx].length)
		).thenReturn(Array.from(swearPosLists[chkIdx]));
		
		bonafiedResult.push(
			dealerHand.mixUp(swearCardLists[chkIdx], swearPosLists[chkIdx])
		);
	}

	bonafiedExpln = td.explain(impMeta.moduleLogger.issuelog);

	td.reset();
	delete impMeta.freshModule;


	swear.plan(7);
	swear.isEqual(bonafiedExpln.callCount, 3, 'Should log issues');
	swear.isEqual((bonafiedResult.flat()).length, (swearCardLists.flat()).length, 'Should keep all elements');
	swear.isEqual(bonafiedResult[0].length, 0,
		"Should be blank"
	);
	swear.isEqual(`${bonafiedResult[1][0]}${bonafiedResult[1][1]}`, '00',
		"Should be blank"
	);
	swear.isEqual(`${bonafiedResult[1][0]}${bonafiedResult[1][bonafiedResult.length-1]}`, '00',
		"Should be blank"
	);
	swear.isEqual(`${bonafiedResult[2][0]}${bonafiedResult[2][1]}`, '00',
		"Should be blank"
	);
	swear.isEqual(`${bonafiedResult[2][0]}${bonafiedResult[2][bonafiedResult.length-1]}`, '00',
		"Should be blank"
	);
});
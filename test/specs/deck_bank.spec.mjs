/**
 * @import {Bank} from '../../source/behavior/_meta/_typedefs.mjs';
 */

import { default as NodeCrypto } from 'node:crypto';
import { test } from 'tape';
import * as td from 'testdouble';


const
	modulePaths = {
		banks: {
			deck: '../../source/behavior/banks/deck.bank.mjs'
		}
	},

	getImport = async () => {
		const mockLocalStorage = td.replace(
			globalThis, 'localStorage', td.object('setItem', 'removeItem', 'getItem', 'clear')
		);

		return {
			/** @type {Bank.Deck} [description] */
			freshModule: (await import(`${modulePaths.banks.deck}?v=${NodeCrypto.randomUUID()}`)).default,
			moduleLocalStorage: mockLocalStorage
		};
	};


test("pcs:bank:deck dummy", async (swear) => {
	let bonafiedResult;
	const impMeta = await getImport();


	bonafiedResult = typeof impMeta.freshModule.updateCards;

	td.reset();
	delete impMeta.freshModule;


	swear.plan(1);
	swear.ok(1, "stub");
});

/**
 * @import {ExampleModule} from '../../source/behavior/trythis.example.mjs'
 */

import { default as NodeCrypto } from 'node:crypto';
import { default as test } from 'tape';
import { parseHTML as linkeParse } from 'linkedom';
import {
	object as tdObject,
	replace as tdReplace,
	replaceEsm as tdReplaceEsm,
	explain as tdExplain,
	reset as tdReset
} from 'testdouble';


const
	defaultSpecHTML = `<!doctype html><html><body></body></html>`,
	modulePaths = {
		scribeHand: '../../source/behavior/hands/scribe.hand.mjs',
		trythisExample: '../../source/behavior/trythis.example.mjs'
	},

	getImport = async (mockMarkup) => {
		// This modifies globals so always call 'reset' with testdouble when done with import
		const
			{ document: _mockDoc, window: _mockWindow } = linkeParse(mockMarkup),
			_mockScribe = tdObject(['devlog', 'issuelog']),

			mockConsole = tdReplace(globalThis, 'console', tdObject(['log'])),
			mockDoc = tdReplace(globalThis, 'document', _mockDoc),
			mockWindow = tdReplace(globalThis, 'window', _mockWindow);


		await tdReplaceEsm(modulePaths.scribeHand, null, _mockScribe);

		return {
			/** @type {ExampleModule?} */
			freshModule: (await import(`${modulePaths.trythisExample}?v=${NodeCrypto.randomUUID()}`)).default,
			moduleConsole: mockConsole,
			moduleWindow: mockWindow,
			moduleDoc: mockDoc,
			moduleLogger: _mockScribe
		};
	};


test('trythis_example:funcHere', async function (swear) {
	let bonafiedExplntn;
	const metaImp = await getImport(defaultSpecHTML);


	metaImp.freshModule?.funcHere();

	bonafiedExplntn = tdExplain(metaImp.moduleConsole.log);

	tdReset();
	// Overkill but helping ensuring module is removed from Node's cache before next import
	metaImp.freshModule = null;


	swear.plan(2);
	swear.equal(bonafiedExplntn.callCount, 1, "should call console.log");
	swear.equal(bonafiedExplntn.calls[0].args[0], "Thanks for trying",
		"should call devlog with expected args"
	);
});


test('trythis_example:orFuncHere', async function (swear) {
	let bonafiedExplntn;
	const
		swearSelector = 'myClass',
		swearHTML = `<!doctype html><html lang="en"><body><div class="${swearSelector}"></div></body></html>`,

		metaImp = await getImport(swearHTML);


	metaImp.freshModule?.orFuncHere(`.${swearSelector}`);
	metaImp.moduleDoc?.querySelector(`.${swearSelector}`)?.dispatchEvent(new metaImp.moduleWindow.Event('click'));

	bonafiedExplntn = tdExplain(metaImp.moduleConsole.log);

	tdReset();
	metaImp.freshModule = null;


	swear.plan(2);
	swear.equal(bonafiedExplntn.callCount, 1, "should call console.log once");
	swear.equal(bonafiedExplntn.calls[0].args[0], "Called event", "Should call with expected args");
});


test('trythis_example:evenFuncHere', async function (swear) {
	let bonafiedExplntn;
	const
		swearSelector = 'myOtherClass',
		swearHTML = `<!doctype html><html lang="en"><body><div class="${swearSelector}"></div></body></html>`,

		metaImp = await getImport(swearHTML);


	metaImp.freshModule?.evenFuncHere(`.${swearSelector}`);
	metaImp.moduleDoc.querySelector(`.${swearSelector}`).dispatchEvent(new metaImp.moduleWindow.Event('click'));

	bonafiedExplntn = tdExplain(metaImp.moduleLogger.devlog);

	tdReset();
	metaImp.freshModule = null;


	swear.plan(2);
	swear.equal(bonafiedExplntn.callCount, 1, "should call devlog once");
	swear.equal(bonafiedExplntn.calls[0].args[0], "Will dev log",
		"Should call console.log with expected args"
	);
});

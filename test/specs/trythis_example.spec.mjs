import { test } from 'tape';
import * as td from 'testdouble';
import { parseHTML as linkeParse } from 'linkedom';


const
	modulePaths = {
		scribeHand: '../../source/behavior/hands/scribe.hand.mjs',
		trythisExample: '../../source/behavior/trythis.example.mjs'
	},

	defaultSpecHTML = `<!doctype html><html lang="en"><body><div class="myClass"></div></body></html>`,

	getSpecFixtures = (htmlStr = defaultSpecHTML) => {
		return Object.freeze({
			_webapi: linkeParse(htmlStr)
		});
	},

	// This function modifies globals so always call 'td.reset()' when done (read: before assertions).
	getImport = async (mockConsole, mockDoc, mockWindow, mockScribe) => {
		td.replace(globalThis, 'console', mockConsole);
		td.replace(globalThis, 'document', mockDoc);
		td.replace(globalThis, 'window', mockWindow);
		td.replaceEsm(modulePaths.scribeHand, null, mockScribe);

		return (await import(modulePaths.trythisExample)).default;
	};


test('trythis_example:funcHere', async function (swear) {
	let swearResult;
	const
		_fixtures = getSpecFixtures(),
		swearConsole = td.object(['log']),

		_tryThis = await getImport(swearConsole, _fixtures._webapi.document, _fixtures._webapi.window, {});


	_tryThis.funcHere();

	swearResult = td.explain(console.log);

	td.reset();


	swear.plan(2);
	swear.equal(swearResult.callCount, 1, "should call console.log once");
	swear.equal(swearResult.calls[0].args[0], "Thanks for trying",
		"should call console.log with expected args"
	);
});


test('trythis_example:orFuncHere', async function (swear) {
	let swearResult;
	const
		_fixtures = getSpecFixtures(),
		swearSelector = '.myClass',
		swearElement = _fixtures._webapi.document.querySelector(swearSelector),
		swearConsole = td.object(['log']),

		_tryThis = await getImport(swearConsole, _fixtures._webapi.document, _fixtures._webapi.window, {})


	_tryThis.orFuncHere(swearSelector);
	swearElement.click();

	swearResult = td.explain(swearConsole.log);

	td.reset();


	swear.plan(2);
	swear.equal(swearResult.callCount, 1, "should call console.log once");
	swear.equal(swearResult.calls[0].args[0], "Called event",
		"Should call console.log with expected args"
	);
});


test('trythis_example:evenFuncHere', async function (swear) {
	let swearResult;
	const
		_fixtures = getSpecFixtures(),
		swearSelector = '.myClass',
		swearElement = _fixtures._webapi.document.querySelector(swearSelector),
		swearScribe = td.object(['devlog']),

		_tryThis = await getImport({}, _fixtures._webapi.document, _fixtures._webapi.window, swearScribe);


	_tryThis.evenFuncHere(swearSelector);
	swearElement.click();

	swearResult = td.explain(swearScribe.devlog);

	td.reset();


	swear.plan(2);
	swear.equal(swearResult.callCount, 1, "should call devlog once");
	swear.equal(swearResult.calls[0].args[0], "Will dev log",
		"Should call console.log with expected args"
	);
});

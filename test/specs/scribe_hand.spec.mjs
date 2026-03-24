/**
 * @import {Hand} from '../../source/behavior/_meta/_typedefs.mjs';
 */

import { default as NodeProcess } from 'node:process';
import { default as NodePath } from 'node:path';
import { default as NodeCrypto } from 'node:crypto';
import { renderFile as pugFile } from 'pug';
import { test } from 'tape';
import * as td from 'testdouble';
import { parseHTML as linkeParse } from 'linkedom';


const
	contentDir = NodeProcess.env.CONTENT_DIR || NodePath.resolve('../../source/contnet'),
	defaultSpecHTML = `<!doctype html><html lang="en"><body></body></html>`,
	modulePath = '../../source/behavior/hands/scribe.hand.mjs',

	// This function modifies globals so always call 'td.reset()' when done (read: before assertions).
	getImport = async (mockWindow, mockDoc) => {
		const
			consoleMock = td.replace(globalThis, 'console', td.object(['warn', 'debug', 'error', 'info'])),
			docMock = td.replace(globalThis, 'document', mockDoc),
			windowMock = td.replace(globalThis, 'window', mockWindow),

			moduleImport = await import(`${modulePath}?v=${NodeCrypto.randomUUID()}`);


		return {
			/** @type {Hand.Scribe} */
			freshModule: moduleImport.default,
			moduleConsole: consoleMock,
			moduleDocument: docMock,
			moduleWindow: windowMock
		};
	};


test("pcs:hand:scribe:devlog should use console use based on url", async (swear) => {
	const
		swearLoc = {href: "http://localhost:54321/my.spec.mjs"},
		swearDOM = linkeParse(defaultSpecHTML, {location: swearLoc}),

		impMeta = await getImport(swearDOM.window, swearDOM.document);


	td.reset();
	delete impMeta.freshModule;


	swear.plan(1);
	swear.isEqual(typeof impMeta.moduleWindow.devToast, "function", "Should add debug function to window");
});


test("pcs:hand:scribe:devlog should use console use based on url", async (swear) => {
	const
		swearLoc = {href: "https://localhost:54321/my.spec.mjs"},
		swearDOM = linkeParse(defaultSpecHTML, {location: swearLoc}),

		impMeta = await getImport(swearDOM.window, swearDOM.document);


	td.reset();
	delete impMeta.freshModule;


	swear.plan(1);
	swear.isEqual(typeof impMeta.moduleWindow.devToast, "function", "Should add debug function to window");
});


test("pcs:hand:scribe:devlog should use console use based on url", async (swear) => {
	const
		swearLoc = {href: "file://my.spec.mjs"},
		swearDOM = linkeParse(defaultSpecHTML, {location: swearLoc}),

		impMeta = await getImport(swearDOM.window, swearDOM.document);


	td.reset();
	delete impMeta.freshModule;


	swear.plan(1);
	swear.isEqual(typeof impMeta.moduleWindow.devToast, "function", "Should add debug function to window");
});


test("pcs:hand:scribe:devlog should not use console use based on url", async (swear) => {
	const
		swearLoc = {href: "http://prodsite.io/my.spec.mjs"},
		swearDOM = linkeParse(defaultSpecHTML, {location: swearLoc}),

		impMeta = await getImport(swearDOM.window, swearDOM.document);

	td.reset();
	delete impMeta.freshModule;


	swear.plan(1);
	swear.isEqual(typeof impMeta.moduleWindow.devToast, "undefined", "Should not add debug function");
});


test("pcs:hand:scribe:devlog should not use console use based on url", async (swear) => {
	const
		swearLoc = {href: "https://prodsite.com/my.spec.mjs"},
		swearDOM = linkeParse(defaultSpecHTML, {location: swearLoc}),

		impMeta = await getImport(swearDOM.window, swearDOM.document);

	td.reset();
	delete impMeta.freshModule;


	swear.plan(1);
	swear.isEqual(typeof impMeta.moduleWindow.devToast, "undefined", "Should not add debug function");
});


test("pcs:hand:scribe:devlog should log dev message", async (swear) => {
	let bonafiedExplntns = [];
	const
		swearLoc = {href: "http://localhost:28133/check.spec.mjs"},
		swearDOM = linkeParse(defaultSpecHTML, {location: swearLoc}),
		imagineMsgs = [
			"A message for the log",
			"A message with a thing for the log"
		],
		imagineThingy = {stuff: '123'},

		impMeta = await getImport(swearDOM.window, swearDOM.document);


	impMeta.freshModule.devlog(imagineMsgs[0]);
	impMeta.freshModule.devlog(imagineMsgs[1], imagineThingy);

	bonafiedExplntns.push(td.explain(impMeta.moduleConsole.debug));
	bonafiedExplntns.push(td.explain(impMeta.moduleConsole.error));
	bonafiedExplntns.push(td.explain(impMeta.moduleConsole.warn));

	td.reset();
	delete impMeta.freshModule;


	swear.plan(6);
	swear.isEqual(bonafiedExplntns[0].callCount, 3, "Should use console.debug");
	swear.isEqual(bonafiedExplntns[1].callCount, 0, "Should not use console.error");
	swear.isEqual(bonafiedExplntns[2].callCount, 0, "Should use console.warn");
	swear.isEqual(bonafiedExplntns[0].calls[0].cloneArgs[0], imagineMsgs[0],
		"Should use console.debug with expected arg"
	);
	swear.isEqual(bonafiedExplntns[0].calls[1].cloneArgs[0], imagineMsgs[1],
		"Should use console.debug with expected arg"
	);
	swear.deepEqual(bonafiedExplntns[0].calls[2].cloneArgs[0], imagineThingy,
		"Should use console.debug with expected arg"
	);
});


test("pcs:hand:scribe:devlog should log issue message", async (swear) => {
	let bonafiedExplntns = [];
	const
		swearLoc = {href: "http://localhost:28133/check.spec.mjs"},
		swearDOM = linkeParse(defaultSpecHTML, {location: swearLoc}),
		imagineError = new Error('whoops'),
		imagineThingyz = [{stuff: 456}, {stuff: 789}, {stuff: 321}],
		imagineMsgs = [
			"Another blocking message for the log",
			"Another blocking message with a thing for the log",
			"Another blocking message with a thing and an error for the log",
			"Another message for the log",
			"Another message with a thing for the log",
		],

		impMeta = await getImport(swearDOM.window, swearDOM.document);


	impMeta.freshModule.issuelog(imagineMsgs[0]);
	impMeta.freshModule.issuelog(imagineMsgs[1], imagineThingyz[0]);
	impMeta.freshModule.issuelog(imagineMsgs[2], imagineThingyz[1], imagineError);

	impMeta.freshModule.issuelog(imagineMsgs[3], false, false, false);
	impMeta.freshModule.issuelog(imagineMsgs[4], imagineThingyz[2], false, false);

	bonafiedExplntns.push(td.explain(impMeta.moduleConsole.error));
	bonafiedExplntns.push(td.explain(impMeta.moduleConsole.debug));
	bonafiedExplntns.push(td.explain(impMeta.moduleConsole.warn));

	td.reset();
	delete impMeta.freshModule;


	swear.plan(12);
	swear.isEqual(bonafiedExplntns[0].callCount, 4, "Should use console.error");
	swear.isEqual(bonafiedExplntns[1].callCount, 3, "Should not use console.debug");
	swear.isEqual(bonafiedExplntns[2].callCount, 2, "Should use console.warn");
	swear.isEqual(bonafiedExplntns[0].calls[0].cloneArgs[0], imagineMsgs[0],
		"Should use console.error with expected arg"
	);
	swear.isEqual(bonafiedExplntns[0].calls[1].cloneArgs[0], imagineMsgs[1],
		"Should use console.error with expected arg"
	);
	swear.isEqual(bonafiedExplntns[0].calls[2].cloneArgs[0], imagineMsgs[2],
		"Should use console.error with expected arg"
	);
	swear.deepEqual(bonafiedExplntns[0].calls[3].cloneArgs[0], imagineError,
		"Should use console.error with expected arg"
	);
	swear.deepEqual(bonafiedExplntns[1].calls[0].cloneArgs[0], imagineThingyz[0],
		"Should use console.error with expected arg"
	);
	swear.deepEqual(bonafiedExplntns[1].calls[1].cloneArgs[0], imagineThingyz[1],
		"Should use console.error with expected arg"
	);
	swear.deepEqual(bonafiedExplntns[1].calls[2].cloneArgs[0], imagineThingyz[2],
		"Should use console.error with expected arg"
	);
	swear.deepEqual(bonafiedExplntns[2].calls[0].cloneArgs[0], imagineMsgs[3],
		"Should use console.error with expected arg"
	);
	swear.deepEqual(bonafiedExplntns[2].calls[1].cloneArgs[0], imagineMsgs[4],
		"Should use console.error with expected arg"
	);
});


test("pcs:hand:scribe:devlog should log noti message", async (swear) => {
	let bonafiedResults = [], bonafiedExplntns = [];
	const
		swearToastTempl = pugFile(NodePath.resolve(contentDir, './document/partials/template_toast.pug'), {}),
		swearToasterMrkp = `<div id="notifications" popover="manual"></div>`,
		swearHTML = `<!doctype html><html lang="en"><body>${swearToasterMrkp}${swearToastTempl}</body></html>`,
		swearLoc = {href: "http://localhost:28133/check.spec.mjs"},
		swearDOM = linkeParse(swearHTML, {location: swearLoc}),
		imagineMsg = "A notification message for the log",

		impMeta = await getImport(swearDOM.window, swearDOM.document);


	swearDOM.HTMLElement.prototype.showPopover = td.func();
	swearDOM.HTMLElement.prototype.hidePopover = td.func();

	bonafiedResults.push(impMeta.moduleDocument.querySelectorAll('button.toast-close').length);
	impMeta.freshModule.notilog(imagineMsg);
	bonafiedResults.push(impMeta.moduleDocument.querySelectorAll('button.toast-close').length);
	impMeta.moduleDocument.querySelector('button.toast-close').click();
	bonafiedResults.push(impMeta.moduleDocument.querySelectorAll('button.toast-close').length);
	bonafiedExplntns.push(td.explain(impMeta.moduleConsole.info));
	bonafiedExplntns.push(td.explain(swearDOM.HTMLElement.prototype.showPopover));
	bonafiedExplntns.push(td.explain(swearDOM.HTMLElement.prototype.hidePopover));

	td.reset();
	delete impMeta.freshModule;


	swear.plan(4);
	swear.isEqual(bonafiedResults.join(''), '010', "Should add then remove notification toast");
	swear.isEqual(bonafiedExplntns[0].callCount, 1, "Should use console.info");
	swear.isEqual(bonafiedExplntns[1].callCount, 1, "Should show popover");
	swear.isEqual(bonafiedExplntns[2].callCount, 1, "Should hide popover");
});


test("pcs:hand:scribe:devlog should not log noti message", async (swear) => {
	let bonafiedResults = [], bonafiedExplntns = [];
	const
		swearToastTempl = pugFile(NodePath.resolve(contentDir, './document/partials/template_toast.pug'), {}),
		swearToasterMrkp = `<div id="notifications" popover="manual"></div>`,
		swearHTML = `<!doctype html><html lang="en"><body>${swearToasterMrkp}${swearToastTempl}</body></html>`,
		swearLoc = {href: "http://prodsite.xyz/checka.spec.mjs"},
		swearDOM = linkeParse(swearHTML, {location: swearLoc}),
		imagineMsg = "A notification message for the log",

		impMeta = await getImport(swearDOM.window, swearDOM.document);


	swearDOM.HTMLElement.prototype.showPopover = td.func();
	swearDOM.HTMLElement.prototype.hidePopover = td.func();

	bonafiedResults.push(impMeta.moduleDocument.querySelectorAll('button.toast-close').length);
	impMeta.freshModule.notilog(imagineMsg);
	bonafiedResults.push(impMeta.moduleDocument.querySelectorAll('button.toast-close').length);
	impMeta.moduleDocument.querySelector('button.toast-close').click();
	bonafiedResults.push(impMeta.moduleDocument.querySelectorAll('button.toast-close').length);
	bonafiedExplntns.push(td.explain(impMeta.moduleConsole.info));
	bonafiedExplntns.push(td.explain(swearDOM.HTMLElement.prototype.showPopover));
	bonafiedExplntns.push(td.explain(swearDOM.HTMLElement.prototype.hidePopover));

	td.reset();
	delete impMeta.freshModule;


	swear.plan(4);
	swear.isEqual(bonafiedResults.join(''), '010', "Should add then remove notification toast");
	swear.isEqual(bonafiedExplntns[0].callCount, 0, "Should not use console.info");
	swear.isEqual(bonafiedExplntns[1].callCount, 1, "Should show popover");
	swear.isEqual(bonafiedExplntns[2].callCount, 1, "Should hide popover");
});


test("pcs:hand:scribe:devlog should handle multiple noti messages", async (swear) => {
	let bonafiedResults = [], bonafiedExplntns = [];
	const
		swearToastTempl = pugFile(NodePath.resolve(contentDir, './document/partials/template_toast.pug'), {}),
		swearToasterMrkp = `<div id="notifications" popover="manual"></div>`,
		swearHTML = `<!doctype html><html lang="en"><body>${swearToasterMrkp}${swearToastTempl}</body></html>`,
		swearLoc = {href: "http://localhost:28133/check.spec.mjs"},
		swearDOM = linkeParse(swearHTML, {location: swearLoc}),
		imagineMsgs = [
			"A notification message for the log",
			"A 2nd notification message for the log",
			"A 3rd notification message for the log",
			"A 4th notification message for the log",
		],

		impMeta = await getImport(swearDOM.window, swearDOM.document);


	swearDOM.HTMLElement.prototype.showPopover = td.func();
	swearDOM.HTMLElement.prototype.hidePopover = td.func();

	bonafiedResults.push(impMeta.moduleDocument.querySelectorAll('button.toast-close').length);
	impMeta.freshModule.notilog(imagineMsgs[0]);
	bonafiedResults.push(impMeta.moduleDocument.querySelectorAll('button.toast-close').length);
	impMeta.freshModule.notilog(imagineMsgs[1]);
	bonafiedResults.push(impMeta.moduleDocument.querySelectorAll('button.toast-close').length);
	impMeta.freshModule.notilog(imagineMsgs[2]);
	bonafiedResults.push(impMeta.moduleDocument.querySelectorAll('button.toast-close').length);
	impMeta.freshModule.notilog(imagineMsgs[3]);
	bonafiedResults.push(impMeta.moduleDocument.querySelectorAll('button.toast-close').length);
	impMeta.moduleDocument.querySelector('button.toast-close').click();
	bonafiedResults.push(impMeta.moduleDocument.querySelectorAll('button.toast-close').length);
	impMeta.moduleDocument.querySelector('button.toast-close').click();
	bonafiedResults.push(impMeta.moduleDocument.querySelectorAll('button.toast-close').length);
	impMeta.moduleDocument.querySelector('button.toast-close').click();
	bonafiedResults.push(impMeta.moduleDocument.querySelectorAll('button.toast-close').length);
	bonafiedExplntns.push(td.explain(impMeta.moduleConsole.info));
	bonafiedExplntns.push(td.explain(swearDOM.HTMLElement.prototype.showPopover));
	bonafiedExplntns.push(td.explain(swearDOM.HTMLElement.prototype.hidePopover));

	td.reset();
	delete impMeta.freshModule;


	swear.plan(4);
	swear.isEqual(bonafiedResults.join(''), '01233210', "Should add then remove notification toast");
	swear.isEqual(bonafiedExplntns[0].callCount, 4, "Should use console.info");
	swear.isEqual(bonafiedExplntns[1].callCount, 4, "Should show popover");
	swear.isEqual(bonafiedExplntns[2].callCount, 1, "Should hide popover");
});


test("pcs:hand:scribe:devlog should remove dangling noti message", async (swear) => {
	let bonafiedResults = [], bonafiedExplntns = [];
	const
		swearToastTempl = pugFile(NodePath.resolve(contentDir, './document/partials/template_toast.pug'), {}),
		swearToasterMrkp = `<div id="notifications" popover="manual"></div>`,
		swearHTML = `<!doctype html><html lang="en"><body>${swearToasterMrkp}${swearToastTempl}</body></html>`,
		swearLoc = {href: "http://localhost:28133/check.spec.mjs"},
		swearDOM = linkeParse(swearHTML, {location: swearLoc}),
		imagineMsg = "A notification message for the log",

		impMeta = await getImport(swearDOM.window, swearDOM.document);


	swearDOM.HTMLElement.prototype.showPopover = td.func();
	swearDOM.HTMLElement.prototype.hidePopover = td.func();

	bonafiedResults.push(impMeta.moduleDocument.querySelectorAll('button.toast-close').length);
	impMeta.freshModule.notilog(imagineMsg);
	bonafiedResults.push(impMeta.moduleDocument.querySelectorAll('button.toast-close').length);
	Array.prototype.indexOf = () => { return -1; };
	impMeta.moduleDocument.querySelector('button.toast-close').click();
	bonafiedResults.push(impMeta.moduleDocument.querySelectorAll('button.toast-close').length);
	bonafiedExplntns.push(td.explain(impMeta.moduleConsole.info));
	bonafiedExplntns.push(td.explain(swearDOM.HTMLElement.prototype.showPopover));
	bonafiedExplntns.push(td.explain(swearDOM.HTMLElement.prototype.hidePopover));

	td.reset();
	delete impMeta.freshModule;


	swear.plan(4);
	swear.isEqual(bonafiedResults.join(''), '010', "Should add then remove notification toast");
	swear.isEqual(bonafiedExplntns[0].callCount, 1, "Should use console.info");
	swear.isEqual(bonafiedExplntns[1].callCount, 1, "Should show popover");
	swear.isEqual(bonafiedExplntns[2].callCount, 1, "Should hide popover");
});


test("pcs:hand:scribe:devlog should not show repeat noti message", async (swear) => {
	let bonafiedResults = [], bonafiedExplntns = [];
	const
		swearToastTempl = pugFile(NodePath.resolve(contentDir, './document/partials/template_toast.pug'), {}),
		swearToasterMrkp = `<div id="notifications" popover="manual"></div>`,
		swearHTML = `<!doctype html><html lang="en"><body>${swearToasterMrkp}${swearToastTempl}</body></html>`,
		swearLoc = {href: "http://localhost:28133/check.spec.mjs"},
		swearDOM = linkeParse(swearHTML, {location: swearLoc}),
		imagineMsg = "A notification message for the log",

		impMeta = await getImport(swearDOM.window, swearDOM.document);


	swearDOM.HTMLElement.prototype.showPopover = td.func();
	swearDOM.HTMLElement.prototype.hidePopover = td.func();

	bonafiedResults.push(impMeta.moduleDocument.querySelectorAll('button.toast-close').length);
	impMeta.freshModule.notilog(imagineMsg);
	bonafiedResults.push(impMeta.moduleDocument.querySelectorAll('button.toast-close').length);
	impMeta.freshModule.notilog(imagineMsg);
	bonafiedResults.push(impMeta.moduleDocument.querySelectorAll('button.toast-close').length);
	impMeta.moduleDocument.querySelector('button.toast-close').click();
	bonafiedResults.push(impMeta.moduleDocument.querySelectorAll('button.toast-close').length);
	bonafiedExplntns.push(td.explain(impMeta.moduleConsole.info));
	bonafiedExplntns.push(td.explain(swearDOM.HTMLElement.prototype.showPopover));
	bonafiedExplntns.push(td.explain(swearDOM.HTMLElement.prototype.hidePopover));

	td.reset();
	delete impMeta.freshModule;


	swear.plan(4);
	swear.isEqual(bonafiedResults.join(''), '0110', "Should add then remove notification toast");
	swear.isEqual(bonafiedExplntns[0].callCount, 2, "Should use console.info");
	swear.isEqual(bonafiedExplntns[1].callCount, 1, "Should show popover");
	swear.isEqual(bonafiedExplntns[2].callCount, 1, "Should hide popover");
});

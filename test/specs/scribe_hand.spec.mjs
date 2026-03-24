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
	specToastTempl = pugFile(NodePath.resolve(contentDir, './document/partials/template_toast.pug'), {}),
	specToaster = `<div id"notifications" popover="manual"></div>`,
	defaultSpecHTML = `<!doctype html><html lang="en"><body>${specToaster}${specToastTempl}</body></html>`,
	modulePath = '../../source/behavior/hands/scribe.hand.mjs',

	// This function modifies globals so always call 'td.reset()' when done (read: before assertions).
	getImport = async (mockWindow, mockDoc) => {
		const
			consoleMock = td.replace(globalThis, 'console', td.object(['warn', 'debug', 'error'])),
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

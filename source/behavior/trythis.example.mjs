/** Only used for test purposes. See test/specs/trythis_example.spec.mjs */

/** @globals console, document */

/**
 * @import {CSSelector} from './_meta/_typedefs.mjs';
 */

import { default as tryLogger } from './hands/scribe.hand.mjs';


const someFunc = () => {
	console.log("Thanks for trying");
};


const otherFunc = (aSelector) => {
	document.querySelector(aSelector).addEventListener('click', () => {
		console.log("Called event");
	});
};


const anotherFunc = (elSelector) => {
	document.querySelector(elSelector).addEventListener('click', () => {
		tryLogger.devlog("Will dev log");
	});
}


/**
 * @typedef {Object} ExampleModule
 * @property {function() :void} funcHere
 * @property {function(CSSelector) :void} orFuncHere
 * @property {function(CSSelector) :void} evenFuncHere
 */


/** @type {ExampleModule} */
const theModule = Object.freeze({
	funcHere: someFunc,
	orFuncHere: otherFunc,
	evenFuncHere: anotherFunc
});

export default theModule;

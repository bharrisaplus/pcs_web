import miscHands from './hands/misc.hand.mjs';


const
	loadingIndicatorSelector = 'main > .loading-indicator-container',
	loadingIndicatorSpinnySelector = '#pcs-card',
	startEventName = 'pcsStart';

document.addEventListener('DOMContentLoaded', () => {
	window.addEventListener(startEventName, () => {
		console.log("pcs started");
	});

	miscHands.startAfter(loadingIndicatorSelector, loadingIndicatorSpinnySelector, startEventName);
});

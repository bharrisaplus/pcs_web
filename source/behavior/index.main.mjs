import miscHands from './hands/misc.hand.mjs';


const
	loadingContainerSelector = '#pageload-curtain',
	loadingSpinnySelector = '#pcs-card',
	tableauSelector = '#tableau',
	startEventName = 'pcsStart';

document.addEventListener('DOMContentLoaded', () => {
	window.addEventListener(startEventName, () => {
		const $tableau = document.querySelector(tableauSelector);

		$tableau.setAttribute('style', '');
		$tableau.classList.remove('hide-before-load');

		console.log("pcs started");
	});

	miscHands.startAfter(loadingContainerSelector, loadingSpinnySelector, startEventName);
});

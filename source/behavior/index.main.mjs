import miscHands from './hands/misc.hand.mjs';


const
	startOverlay = '#pageload-curtain',
	startOverlayImage = '.loading-spinny',
	tableauSelector = '#tableau',
	startEventName = 'pcsStart';

document.addEventListener('DOMContentLoaded', () => {
	window.addEventListener(startEventName, () => {
		const $tableau = document.querySelector(tableauSelector);

		$tableau.setAttribute('style', '');
		$tableau.classList.remove('hide-before-load');

		console.log("pcs started");
	});

	miscHands.startAfter(startOverlay, startOverlayImage, startEventName);
});

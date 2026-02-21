import miscHands from './hands/misc.hand.mjs';


const
	bootOverlay = '#pageload-curtain',
	bootOverlaySpinner = '.loading-spinny',
	centerPiece = '#tableau',
	kickOffEventName = 'pcsStart';

document.addEventListener('DOMContentLoaded', () => {
	miscHands.afterStart(centerPiece, kickOffEventName)
	miscHands.startAfter(bootOverlay, bootOverlaySpinner, kickOffEventName);
});

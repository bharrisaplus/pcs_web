import appCustodian from './hands/misc.hand.mjs';


const
	bootOverlay = '#pageload-curtain',
	bootOverlaySpinner = '.loading-spinny',
	centerPiece = '#tableau',
	kickOffEventName = 'pcsStart';

document.addEventListener('DOMContentLoaded', () => {
	appCustodian.afterStart(centerPiece, kickOffEventName)
	appCustodian.startAfter(bootOverlay, bootOverlaySpinner, kickOffEventName);
});

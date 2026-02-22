import appCustodian from './hands/misc.hand.mjs';
import buildAppScreen from './lattices/pcs.lattice.mjs';

const
	bootOverlay = '#pageload-curtain',
	bootOverlaySpinner = '.loading-spinny',
	cardView = '#tableau',
	cardOverlay = '#turntable',
	kickOffEventName = 'pcsStart';

document.addEventListener('DOMContentLoaded', () => {
	const appScreen = buildAppScreen(cardOverlay);

	if (appCustodian.yapFriendly) {
		console.log('Dev-ish environment');
		console.debug(appScreen);
	}

	appCustodian.afterStart(cardView, kickOffEventName);
	appCustodian.startAfter(bootOverlay, bootOverlaySpinner, kickOffEventName);
});

/* Handles various tasks for the app */
const MiscHands = () => {
	let cycleCount = 0;

	const
		/**
		 * Looking at some container with animated child for a cue. Once the child is done with
		 * 	it's animation the container will be removed from view then the event will trigger.
		 * 	Intended as a oneoff at pageload so the indicator will be removed from the DOM as well.
		 *
		 * 		<indicator> <- this will transition out of view
		 * 			<tick/> <- this is animating and we'll let it run a bit
		 * 	  	</indicator>
		 * 
		 * @param  {string} indicatorSelector For container element of tick
		 * @param  {string} tickSelector      Thr animating element relative to the container
		 * @param  {string} startEvtName      The event to fire
		 */
		finish_loading_then_start = (indicatorSelector, tickSelector, startEvtName) => {
			const $indicator = document.querySelector(indicatorSelector);

			// Once loading is done, disconnect loading indicator from DOM
			$indicator.addEventListener('transitionend', () => {
				console.log("Loaded, removing indicator");
				$indicator.remove();
				window.dispatchEvent(new CustomEvent(startEvtName));
			}, { once: true });

			// Let the loading animation show off a bit before starting
			$indicator.querySelector(tickSelector).addEventListener('animationiteration', () => {
			    cycleCount++;

			    if (cycleCount >= 3) {
			        $indicator.classList.add('loading-done');
			    }
			}, { passive: true });
		};

	return Object.freeze({
		startAfter: finish_loading_then_start
	});
};

const singleMiscHands = MiscHands();

export default singleMiscHands;

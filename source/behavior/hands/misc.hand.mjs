
/**
 * @import {MiscHand} from "../_meta/_typedefs.mjs"
 */

/**
 * @returns {MiscHand}
 */
const makeMiscHand = () => {
	let cycleCount = 0;
  const currentLoc = window.location.href;


  /**
   * Looking at some container with animated child for a cue. Once the child is done with
   * 	it's animation the container will be removed from view then the event will trigger.
   * 	Intended as a oneoff at pageload so the indicator will be removed from the DOM as well.
   *
   * 		<indicator> <- this will transition out of view
   * 			<tick/> <- this is animating and we'll let it run a bit
   * 	  </indicator>
   *
   * @param  {string} finishSelector For container element of tick - {@link CSSStyleRule.selectorText}
   * @param  {string} finishInnerSelector The animating element relative to the container - {@link CSSStyleRule.selectorText}
   * @param  {string} finishEventName The event to fire when done - {@link CustomEvent.type}
   */
	const finish_loading_then = (finishSelector, finishInnerSelector, finishEventName) => {
    const $finish = document.querySelector(finishSelector);

    // Once loading is done, disconnect loading indicator from DOM
    $finish.addEventListener('transitionend', (transEvt) => {
      if (transEvt.propertyName == 'opacity') {
        console.log("Loaded, removing indicator");
        $finish.remove();
        window.dispatchEvent(new CustomEvent(finishEventName));
      }
    }, { once: true });

    // Let the loading animation show off a bit before starting
    $finish.querySelector(finishInnerSelector).addEventListener('animationiteration', () => {
        cycleCount++;

        if (cycleCount >= 3) {
          $finish.classList.add('loading-done');
        }
    }, { passive: true });
  };


  /**
   * Putting things in place for the app to begin
   * @param  {string} startSelector  Element to reveal - {@link CSSStyleRule.selectorText}
   * @param  {string} startEventName Event to wait for - {@link CustomEvent.type}
   */
	const start_setup = (startSelector, startEventName) => {
    window.addEventListener(startEventName, () => {
      const $start = document.querySelector(startSelector);

      $start.setAttribute('style', '');
      $start.classList.remove('hide-before-load');

      console.log("pcs started");
    });
  };


	return Object.freeze({
		startAfter: finish_loading_then,
		afterStart: start_setup,
    // Computed-s
    get yapFriendly () {
      return currentLoc.startsWith('http://localhost:') || currentLoc.startsWith('file://')
    }
	});
};

const singleMiscHand = makeMiscHand();

export default singleMiscHand;
export const debugName = "pcs:hand:mischand";

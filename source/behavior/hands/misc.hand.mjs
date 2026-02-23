
/**
 * @import {MiscHand, VerifynLoad} from "../_meta/_typedefs.mjs"
 */


/**
 * @returns {MiscHand}
 */
const makeMiscHand = () => {
  let cycleCount = 0;
  const console_free = (
    window.location.href.startsWith('http://localhost:') ||
    window.location.href.startsWith('https://localhost:') ||
    window.location.href.startsWith('file:') // || whatever you like
  );


  /**
   * Grab svg assets and inline them.
   *
   *   <html>
   *     <head>
   *       <prefetchLink /> <- element with an id that has an href to fetch
   *     </head>
   *     <body>
   *       <footer>
   *         <dump> <- element for appending to
   *           <someAsset /> <- element may already be there
   *         </dump>
   *       </footer>
   *     </body>
   *   </html>
   *
   * @param  {VerifynLoad} assetMap - {@link CSSStyleRule.selectorText}
   * @param  {string} assetDump - {@link CSSStyleRule.selectorText}
   */
  const load_assets = (assetMap, assetDump) => {
    const assetParser = new DOMParser();

    assetMap.forEach(async (assetCheck, assetGrab) => {
      if (document.querySelectorAll(assetCheck).length < 1) {
        let assetUrl = document.querySelector(assetGrab)?.getAttribute('href');

        if (assetUrl) {
          let
            assetResponse = await fetch(assetUrl),
            assetInnards = await assetResponse.text();

          if (assetInnards.length > 0) {
            if (console_free) {
              console.log(`Loading asset ${assetUrl}`);
              console.log(`Placing within ${assetDump}`);
            }

            document.querySelector(assetMap.get("dump"))?.appendChild(
              assetParser.parseFromString(assetInnards, 'image/svg+xml')
            )
          } else if (console_free) {
            console.warn(`Failed loading asset ${assetUrl}`);
          }
        }
      } else if (console_free) {
        console.log(`Found ${assetCheck} asset inlined already`);
      }
    });
  };


  /**
   * Looking at some container with animated child for a cue. Once the child is done with
   *  it's animation the container will be removed from view then the event will trigger.
   *
   *    <indicator> <- this will transition out of view
   *      <tick/> <- this is animating and we'll let it run a bit
   *    </indicator>
   *
   * @param  {string} indicatorSelector For container element of tick - {@link CSSStyleRule.selectorText}
   * @param  {string} tickSelector The animating element relative to the container - {@link CSSStyleRule.selectorText}
   * @param  {string} evtName The event to fire when done - {@link CustomEvent.type}
   */
  const watch_for_indicator_tick = (indicatorSelector, tickSelector, evtName) => {
    const
      $indicator = document.querySelector(indicatorSelector),
      $tick = $indicator?.querySelector(tickSelector);

    if (!$indicator || !$tick) window.dispatchEvent(new CustomEvent(evtName));

    // Once loading is done, disconnect loading indicator from DOM
    $indicator?.addEventListener('transitionend', (transEvt) => {
      if (transEvt.propertyName == 'opacity') {
        if (console_free) console.log("Loaded, removing indicator");

        $indicator.remove();
        window.dispatchEvent(new CustomEvent(evtName));
      }
    }, { once: true });

    // Let the loading animation show off a bit before starting
    $tick?.addEventListener('animationiteration', () => {
        cycleCount++;

        if (cycleCount >= 3) {
          $indicator.classList.add('loading-done');
        }
    }, { passive: true });
  };


  /**
   * Putting things in place for the app to begin
   * @param  {string} centerpieceSelector Element to reveal - {@link CSSStyleRule.selectorText}
   * @param  {string} revealEventName Event to wait for - {@link CustomEvent.type}
   */
  const setup_reveal = (centerpieceSelector, revealEventName) => {
    window.addEventListener(revealEventName, () => {
      const $start = document.querySelector(centerpieceSelector);

      $start.setAttribute('style', '');
      $start.classList.remove('hide-before-load');

      console.info("pcs started");
    });
  };


  return Object.freeze({
    warmUp: load_assets,
    startAfter: watch_for_indicator_tick,
    afterStart: setup_reveal,
    yapFriendly: console_free,
    // Convenience shortcut
    startRoutine: (a,b,c,d,e,f) => {
      load_assets(a, b);
      setup_reveal(c, d);
      watch_for_indicator_tick(e, f, d);
    }
  });
};

const singleMiscHand = makeMiscHand();

export default singleMiscHand;
export const debugName = "pcs:hand:mischand";

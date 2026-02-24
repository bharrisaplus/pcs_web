
/**
 * @import {Hand, VerifynLoad} from "../_meta/_typedefs.mjs"
 */

import { default as _g } from '../_meta/_glods.mjs';


/**
 * @returns {Readonly<Hand.Misc>} a helper - {@link Hand.Misc}
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
   * @param  {VerifynLoad} assetMap - {@link CSSStyleRule.selectorText}
   * @param  {string} assetDump - {@link CSSStyleRule.selectorText}
   */
  const load_assets = (assetMap, assetDump) => {
    const $assetDump = document.querySelector(assetDump);

    if (!$assetDump || assetMap.size == 0) return;

    const assetParser = new DOMParser();

    assetMap.forEach(async (assetCheck, assetGrab) => {
      if (document.querySelectorAll(assetCheck).length > 0) {
        if (console_free) console.log(`Found ${assetCheck} asset inlined already`);
        return;
      }

      let assetUrl = document.querySelector(assetGrab)?.getAttribute('href');

      if (!assetUrl) {
        if (console_free) console.log(`No url to fetch for ${assetGrab}`);
        return;
      }

      let
        assetResponse = await fetch(assetUrl),
        assetInnards = await assetResponse.text();

      if (!assetInnards) {
        if (console_free) console.log(`Empty response from ${assetUrl}`);
        return;
      }

      if (console_free) console.log(`Loading asset ${assetUrl}\nPlacing within ${assetDump}`);

      $assetDump.appendChild(assetParser.parseFromString(assetInnards, 'image/svg+xml'));
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
   */
  const watch_for_indicator_tick = (indicatorSelector, tickSelector) => {
    const
      $indicator = document.querySelector(indicatorSelector),
      $tick = $indicator?.querySelector(tickSelector);

    if (!$indicator || !$tick) window.dispatchEvent(new CustomEvent(_g.notices.kick));

    // Once loading is done, disconnect loading indicator from DOM
    $indicator?.addEventListener('transitionend', (transEvt) => {
      if (transEvt.propertyName == 'opacity') {
        if (console_free) console.log("Loaded, removing indicator");

        $indicator.remove();
        window.dispatchEvent(new CustomEvent(_g.notices.kick));
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


  return Object.freeze({
    warmUp: load_assets,
    startAfter: watch_for_indicator_tick,
    yapFriendly: console_free,
    // Convenience shortcut
    startRoutine: (a,b,c,d) => {
      load_assets(a, b);
      watch_for_indicator_tick(c, d);
    }
  });
};

const singleMiscHand = makeMiscHand();

export default singleMiscHand;
export const debugName = "pcs:hand:mischand";

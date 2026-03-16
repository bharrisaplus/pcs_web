
/**
 * @import {CSSelector, VerifynLoad, Hand} from "../_meta/_typedefs.mjs"
 */

import { default as _g } from '../_meta/_glods.mjs';
import { default as appLogger } from '../hands/scribe.hand.mjs';
import { default as getHostShuttle } from '../shuttles/host.shuttle.mjs';


const assetFetcher = getHostShuttle();

/** @returns {Readonly<Hand.Misc>} a helper - {@link Hand.Misc} */
const makeMiscHand = () => {
  let cycleCount = 0;


  /**
   * Grab svg assets and inline them.
   *
   * @param  {VerifynLoad} assetMap - {@link CSSStyleRule.selectorText}
   * @param  {CSSelector} assetDump - {@link CSSStyleRule.selectorText}
   */
  const load_assets = (assetMap, assetDump) => {
    let loadCount = 0;
    const
      $assetDump = document.querySelector(assetDump),
      assetParser = new DOMParser();

    if (!$assetDump || assetMap.size === 0) return;

    assetMap.forEach(async (assetCheck, assetGrab) => {
      let
        assetUrl,
        assetBlob,
        assetInnards;

      if (document.querySelectorAll(assetCheck).length > 0) {
        appLogger.devlog(`Found ${assetCheck} asset inlined already`);
        loadCount++;
        return;
      }

      assetUrl = document.querySelector(assetGrab)?.getAttribute('href');

      if (!assetUrl) {
        appLogger.issuelog(`Missing url for ${assetGrab}`, {assetMap}, false);
        return;
      }

      assetBlob = await assetFetcher.grabFile(assetUrl);

      if (!assetBlob) {
        appLogger.issuelog(`Empty response from ${assetUrl}`, {assetBlob}, false);
        return;
      }

      assetInnards = await assetBlob.text();

      if (!assetInnards) {
        appLogger.issuelog(`Empty asset from ${assetUrl}`, {assetBlob, assetInnards}, false);
      }

      if (assetUrl.endsWith('.svg') || assetUrl.endsWith('.html') || assetUrl.endsWith('.xml')) {
        appLogger.devlog('Loading asset', {assetUrl, assetDump});
        $assetDump.appendChild(
          assetParser.parseFromString(assetInnards, assetBlob.type.split(';')[0]).firstChild
        );
        loadCount++;
      } else {
        appLogger.devlog(`Unknown asset type from ${assetUrl}`, {assetBlob});
      }
    });

    return loadCount === assetMap.size;
  };


  /**
   * Looking at some container with animated child for a cue. Once the child is done with
   *  it's animation the container will be removed from view then the event will trigger.
   *
   *    <indicator> <- this will transition out of view
   *      <tick/> <- this is animating and we'll let it run a bit
   *    </indicator>
   *
   * @param  {CSSelector} indicatorSelector - {@link CSSStyleRule.selectorText}
   * @param  {CSSelector} tickSelector - {@link CSSStyleRule.selectorText}
   */
  const watch_for_indicator_tick = (indicatorSelector, tickSelector) => {
    const
      $indicator = document.querySelector(indicatorSelector),
      $tick = $indicator?.querySelector(tickSelector);

    if (!$indicator || !$tick) window.dispatchEvent(new CustomEvent(_g.notices.kick));

    // Once loading is done, disconnect loading indicator from DOM
    $indicator?.addEventListener('transitionend', (transEvt) => {
      if (transEvt.propertyName === 'opacity') {
        appLogger.devlog("Loaded, removing indicator");
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

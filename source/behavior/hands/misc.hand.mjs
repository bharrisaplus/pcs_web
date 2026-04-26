/** @globals document, DOMParser, window, CustomEvent */

/**
 * @import {CSSelector, VerifynLoad, Hand} from "../_meta/_typedefs.mjs"
 */

import { default as _g } from '../_meta/_glods.mjs';
import { default as appLogger } from '../hands/scribe.hand.mjs';
import { default as getHostShuttle } from '../shuttles/host.shuttle.mjs';


const assetFetcher = getHostShuttle();

/** @returns {Hand.Misc} a helper - {@link Hand.Misc} */
const makeMiscHand = () => {
  let cycleCount = 0;


  /**
   * Grab svg assets and inline them.
   *
   * @param  {VerifynLoad} assetMap
   * @param  {CSSelector} assetDump
   *
   * @return {Promise<boolean>}
   * @see Hand.Misc#warmUp
   */
  const load_assets = async (assetMap, assetDump) => {
    let loadCount = 0;
    const
      $assetDump = document.querySelector(assetDump),
      assetParser = new DOMParser();

    if (assetMap.size === 0) {
      appLogger.devlog('Nothing to retrieve', {assetMap, assetDump});
      return false;
    }

    if (!$assetDump) {
      appLogger.issuelog('Nowhere to place asset', {assetMap, assetDump}, null);
      return false;
    };

    for (const [assetGrab, assetCheck] of assetMap) {
      let
        assetUrl,
        assetBlob,
        assetInnards,
        assetDoc;

      if ($assetDump.querySelectorAll(assetCheck).length > 0) {
        appLogger.devlog(`Found ${assetCheck} asset inlined already`);
        loadCount++;
        continue;
      }

      assetUrl = document.querySelector(assetGrab)?.getAttribute('href');

      if (!assetUrl) {
        appLogger.issuelog(`Missing url for asset`, {assetGrab, assetCheck}, null);
        continue;
      }

      assetBlob = await assetFetcher.grabFile(assetUrl);

      if (!assetBlob) {
        appLogger.issuelog(`Missing asset from ${assetUrl}`, {assetGrab, assetCheck}, null);
        continue;
      }

      assetInnards = await assetBlob.text();

      if (!assetInnards) {
        appLogger.issuelog(
          `Empty asset from ${assetUrl}`, {assetGrab, assetCheck, assetBlob, assetInnards}, null
        );
        continue;
      }

      if (assetUrl.endsWith('.svg') || assetUrl.endsWith('.html') || assetUrl.endsWith('.xml')) {
        try {
          assetDoc = assetParser.parseFromString(assetInnards, assetBlob.type.split(';')[0]).documentElement;
        } catch (pErr) {
          assetDoc = null;
          appLogger.issuelog('Issue loading asset', {assetGrab, assetCheck, assetBlob}, pErr, true);
        }

        if (assetDoc) {
          if (assetDoc.matches(assetCheck)) {
            $assetDump.appendChild(assetDoc);
            loadCount++;
            appLogger.devlog('Loading asset', {assetUrl, assetDump});
          } else {
            appLogger.devlog(`Asset not found within fetched document:`, {assetGrab, assetCheck, assetBlob});
          }
        }
      } else {
        appLogger.devlog(`Unknown asset type from ${assetUrl}`, {assetGrab, assetCheck, assetBlob});
      }
    }

    return (loadCount > 0 && loadCount === assetMap.size);
  };


  /**
   * Looking at some container with animated child for a cue. Once the child is done with
   *  it's animation the container will be removed from view then the event will trigger.
   *
   *    <indicator> <- this will transition out of view
   *      <tick/> <- this is animating and we'll let it run a bit
   *    </indicator>
   *
   * @param  {CSSelector} indicatorSelector
   * @param  {CSSelector} tickSelector
   * @see Hand.Misc#startAfter
   */
  const watch_for_indicator_tick = (indicatorSelector, tickSelector) => {
    const
      $indicator = document.querySelector(indicatorSelector),
      $tick = $indicator?.querySelector(tickSelector);

    if (!$indicator || !$tick) { window.dispatchEvent(new CustomEvent(_g.notices.kick)); return; }

    // Once loading is done, disconnect loading indicator from DOM
    $indicator?.addEventListener('transitionend', (transEvt) => {
      if (transEvt instanceof TransitionEvent && transEvt.propertyName === 'opacity') {
        appLogger.devlog("Removing indicator");
        $indicator.remove();
        window.dispatchEvent(new CustomEvent(_g.notices.kick));
      }
    }, { once: true });

    // Let the loading animation show off a bit before starting
    $tick.addEventListener('animationiteration', () => {
        cycleCount++;

        if (cycleCount >= 3) {
          appLogger.devlog("Stopping indicator");
          $indicator.classList.add('loading-done');
        }
    }, { passive: true });
  };


  return Object.freeze({
    warmUp: load_assets,
    startAfter: watch_for_indicator_tick,
    // Convenience shortcut
    startRoutine: async (a,b,c,d) => {
      const loadResult = await load_assets(a, b);

      if (loadResult) {
        watch_for_indicator_tick(c, d);
      }

      return loadResult;
    }
  });
};


const singleMiscHand = makeMiscHand();

export default singleMiscHand;
export const debugName = "pcs:hand:mischand";

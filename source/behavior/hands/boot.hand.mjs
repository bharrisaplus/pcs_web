/** @globals document, DOMParser, window, CustomEvent */

/**
 * @import {CSSelector, VerifynLoad, Hand} from "../_meta/_typedefs.mjs"
 */

import { default as _g } from '../_meta/_glods.mjs';
import { default as appLogger } from '../hands/scribe.hand.mjs';
import { default as getHostShuttle } from '../shuttles/host.shuttle.mjs';


const assetFetcher = getHostShuttle();

/** @returns {Hand.Boot} a helper - {@link Hand.Boot} */
const makeBootHand = () => {
  let cycleCount = 0;


  /**
   * Grab and inline.
   * @type {Hand.Boot["warmUp"]}
   */
  const load_assets = async (assetMap, dumpSelector) => {
    let loadCount = 0;
    const
      $dumpSelector = document.querySelector(dumpSelector),
      assetParser = new DOMParser();

    if (assetMap.size === 0) {
      appLogger.devlog('Nothing to retrieve', {assetMap, dumpSelector});
      return false;
    }

    if (!$dumpSelector) {
      appLogger.issuelog('Nowhere to place asset', {assetMap, dumpSelector}, null);
      return false;
    };

    for (const [assetGrab, assetCheck] of assetMap) {
      let
        assetUrl,
        assetBlob,
        assetInnards,
        assetDoc;

      if ($dumpSelector.querySelectorAll(assetCheck).length > 0) {
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
            $dumpSelector.appendChild(assetDoc);
            loadCount++;
            appLogger.devlog('Loading asset', {assetUrl, dumpSelector});
          } else {
            appLogger.devlog(`Asset not found within fetched document:`, {assetGrab, assetCheck, assetBlob});
          }
        }
      } else {
        appLogger.devlog(`Unknown file type from asset @ ${assetUrl}`, {assetGrab, assetCheck, assetBlob});
      }
    }

    return (loadCount > 0 && loadCount === assetMap.size);
  };


  /**
   * Looking at some container with animated child for a cue.
   * ```
   *    <indicator> <- this will transition out of view
   *      <tick/> <- this is animating and we'll let it run a bit
   *    </indicator>
   *```
   * 
   * @type {Hand.Boot["startAfter"]}
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


const singleBootHand = makeBootHand();

export default singleBootHand;
export const debugName = "pcs:hand:boot";

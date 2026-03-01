
/**
 * @import {PCSEvent, CSSelector, Part} from '../_meta/_typedefs.mjs'
 */

import { default as _g } from '../_meta/_glods.mjs';


/**
 * @param  {CSSelector} containerID - {@link CSSStyleRule.selectorText}
 *
 * @return {Readonly<Part.Tableau>} a surface for cards - {@link Part.Tableau}
 */
const makeTableauPart = (containerID) => {
  const itemSelector = `${containerID} .playing-card`;

  document.querySelectorAll(itemSelector)?.forEach(($item, itemIdx) => {
    $item.addEventListener('click', (_clickEvt) => {
      if ($item != _clickEvt.target && $item != _clickEvt.target?.parentElement) { return; }

      /** @type {PCSEvent} */
      const needleDown = new CustomEvent(_g.notices.needle, { detail: {
        msg: itemIdx.toString(),
        $dispatcher: $item
      }});

      document.querySelector(`#${_g.appID}`)?.dispatchEvent(needleDown);
    });
  });


  return Object.freeze({
    get itemLabels () {
      return Array.from(
        document.querySelectorAll(itemSelector)
      ).map(($item) => {
        return ($item.getAttribute("aria-description")?.split(":")[1]).trim() || "Missing";
      });
    },

    get currentOrder () {
      return Array.from(
        document.querySelectorAll(itemSelector)
      ).filter(
        ($item) => $item.dataset.oid && $item.dataset.oid.length <= 2
      ).map(
        ($item) => Number.parseInt($item.dataset.oid)
      );
    }
  });
};


/** @type {Part.Tableau} */
let singleTableau;

/**
 * @param {string} getTableauContainerID - {@link CSSStyleRule.selectorText}
 *
 * @returns {Readonly<Part.Tableau>} sole Tableau for the page - {@link Part.Turntable}
 */
const getTableau = (getTableauContainerID) => {
  if (!singleTableau) {
    singleTableau = makeTableauPart(getTableauContainerID);
  }

  return singleTableau
};


export default getTableau;

export const debugName = "pcs:part:tableau";

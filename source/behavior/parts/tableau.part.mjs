/** @globals document, AbortController, CustomEvent */

/**
 * @import {PCSEvent, CSSelector, Part, CardIntri} from '../_meta/_typedefs.mjs'
 */

import { default as _g } from '../_meta/_glods.mjs';


/**
 * @param  {CSSelector} containerID - {@link CSSStyleRule.selectorText}
 * @param  {AbortController} eventCancel - {@link AbortController}
 *
 * @return {Readonly<Part.Tableau>} a surface for cards - {@link Part.Tableau}
 */
const makeTableauPart = (containerID, eventCancel) => {
  const itemSelector = `${containerID} .playing-card`;

  /**
   * @param  {HTMLElement} $item
   * @param  {number} itemIdx
   */
  const _setupItem = ($item, itemIdx) => {
    $item.addEventListener('click', (_clickEvt) => {
      if (
        !(_clickEvt.target instanceof window.HTMLElement) ||
        $item !== _clickEvt.target && $item !== _clickEvt.target?.parentElement
      ) { return; }

      /** @type {PCSEvent} */
      const needleDown = new CustomEvent(_g.notices.needle, {
        detail: {
          msg: itemIdx.toString(),
          $dispatcher: $item
        }
      });

      document.querySelector(`#${_g.appID}`)?.dispatchEvent(needleDown);
    }, {signal: eventCancel.signal});
  };


  /**
   * @param  {CardIntri[]} newItems
   * @see Part.Tableau#updateOrder
   */
  const set_items_from = (newItems) => {
    /** @type {HTMLElement[]} [description] */
    const _$tmpItems = Array.from(document.querySelectorAll(itemSelector));

    if (newItems.length < 52) { return; }

    eventCancel.abort();
    eventCancel = new AbortController();

    _$tmpItems.forEach((_$itm, _itmIdx) => {
      _$itm.setAttribute('id', `card-${newItems[_itmIdx].symbolRef}`);
      _$itm.setAttribute('data-oid', `${newItems[_itmIdx].oglo}`);
      _$itm.setAttribute('aria-description', newItems[_itmIdx].title);

      if (_$itm.querySelector('title#playing-card-title')) {
        _$itm.querySelector('title#playing-card-title').textContent = newItems[_itmIdx].title;
      }

      if (_$itm.querySelector('desc#playing-card-description')) {
        _$itm.querySelector('desc#playing-card-description').textContent = newItems[_itmIdx].desc;
      }

      _$itm.querySelector('svg[role="img"] use')?.setAttribute('href', newItems[_itmIdx].symbolRef);
      _setupItem(_$itm, _itmIdx);
    });

    document.querySelector(containerID).replaceChildren(..._$tmpItems);
  };


  document.querySelectorAll(itemSelector)?.forEach(_setupItem);

  return Object.freeze({
    updateOrder: set_items_from,

    get currentOrder () {
      /** @type {HTMLElement[]} */
      const $items = Array.from(document.querySelectorAll(itemSelector));

      return $items.filter(
        ( $item) => $item.dataset.oid && $item.dataset.oid.length <= 2
      ).map(
        ($item) => Number.parseInt($item.dataset.oid)
      );
    }
  });
};


let
  /** @type {Part.Tableau} */
  singleTableau,
  /** @type {AbortController} */
  singleCancel;

/**
 * @param {string} getTableauContainerID - {@link CSSStyleRule.selectorText}
 *
 * @returns {Readonly<Part.Tableau>} sole Tableau for the page - {@link Part.Turntable}
 */
const getTableau = (getTableauContainerID) => {
  if (!singleTableau) {
    singleCancel = new AbortController();
    singleTableau = makeTableauPart(getTableauContainerID, singleCancel);
  }

  return singleTableau
};


export default getTableau;

export const debugName = "pcs:part:tableau";

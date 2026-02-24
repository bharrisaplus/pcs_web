
/**
 * @import {CSSelector, PCSEvent, Lattice, Part, Bank} from "../_meta/_typedefs.mjs"
 */

import { default as _g } from '../_meta/_glods.mjs';
import { default as getTurntable } from '../parts/turntable.part.mjs';
import { default as getDealer } from '../hands/dealer.hand.mjs';


const cardShark = getDealer();

/**
 * @param  {CSSelector} tableauID The dingus element - {@link Part.Tableau}
 * @param  {CSSelector} turntableID The hud element - {@link Part.Turntable}
 * @param  {Bank.Deck} itemVault The card state
 *
 * @return {Readonly<Lattice.Landing>} home screen manager - {@link Lattice.Landing}
 */
const scaffoldLandingLattice = (tableauID, turntableID, itemVault) => {
  let _$tableau = document.querySelector(tableauID);
  const hud = getTurntable(turntableID);

  if (_$tableau) {
    /** @type {number[]} */
    let _landingCards = [];

    document.querySelector(`#${_g.appID}`).addEventListener(_g.notices.needle,
      (/** @type {PCSEvent} */ _pcsevt) => {
        _$tableau.querySelectorAll(`li.playing-card`).forEach(($elm) => {
          _landingCards.push($elm.dataset.oid);
        });

        hud.loadTurntable(cardShark.getCard(
          _pcsevt.detail.msg, _pcsevt.detail.$dispatcher?.dataset.oid
        ));
      }
    );


    _$tableau.querySelectorAll(`li.playing-card`).forEach(($elm, elemIdx) => {
      _landingCards.push($elm.dataset.oid);

      $elm.addEventListener('click', () => {
        console.log(`Value from click event element: ${$elm.dataset.oid}`);
        console.log(`Index of click event element: ${elemIdx}`);
        /** @type {PCSEvent} */
        const needleDown = new CustomEvent(_g.notices.needle, { detail: {
          msg: elemIdx.toString(),
          $dispatcher: $elm
        }});

        document.querySelector(`#${_g.appID}`).dispatchEvent(needleDown);
      });
    });


    document.querySelector(`#${_g.appID}`).addEventListener(_g.notices.scratch,
      (/** @type {PCSEvent} */ _pcsevt) => {
        let
          goBack = false,
          hudBits = [];

        const msgBits = _pcsevt.detail.msg.split("[::|::]").map((itm) => Number.parseInt(itm));

        if (_pcsevt.detail.$dispatcher == document.querySelector(hud.prevBtn)) {
          goBack = true;
          hudBits = hud.cursor.split("[::|::]").map((itm) => {
            return Math.max(Number.parseInt(itm), -1) - 1;
          });
        } else if (_pcsevt.detail.$dispatcher == document.querySelector(hud.nextBtn)) {
          hudBits = hud.cursor.split("[::|::]").map((itm) => {
            return Math.min(Number.parseInt(itm), _g.cardMax) + 1;
          });
        }

        if (hudBits.length > 0 && msgBits[0] == hudBits[0] && msgBits[1] == hudBits[1]) {
          hud.spinTurntable(cardShark.getCard(msgBits[0], msgBits[1]), goBack);
        }

        itemVault.updateCards(_landingCards);
      }
    );
  } else {
    console.error("Could not find the tableau");
  }

  return Object.freeze({
    landingHUD: hud
  });
};


export default scaffoldLandingLattice;
export const debugName = "pcs:lattice:pcs";

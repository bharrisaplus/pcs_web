// jsDoc or (fb:meta)flow

/**
 * @typedef {Object} GlobalDeclarations
 *
 * Constants
 *
 * @property {number} cardMax
 * @property {string[]} suites
 * @property {string[]} cnames
 * @property {string} ctitlePrefix
 * @property {string} cdescPrefix
 * @property {string} pcscardRef
 */

/**
 * @typedef {Map<string, string>} VerifynLoad
 *
 * The ids for elements to possibly fetch if not found in dom
 */

/**
 * @typedef {Object} CardIntri
 *
 * A card
 *
 * @property {number} currentPos
 * @property {string} title
 * @property {string} description
 */

/**
 * @typedef {Object} DeckBank
 *
 * State of the cards
 *
 * @property {Uint8Array} ndoUcards
 * @property {number[]} ndoCards
 * @property {Uint8Array} ucards
 * @property {number[]} cards
 * @property {function(Uint8Array | number[]): void} updateCards
 * @property {function(): void} resetCards
 */

/**
 * @typedef {Object} MiscHand
 *
 * Handles various tasks
 * @property {boolean} yapFriendly
 * @property {function (string, string) :void} afterStart
 * @property {function (string, string, string) :void} startAfter
 * @property {function (VerifynLoad, string) :void} warmUp
 * @property {function (VerifynLoad, string, string, string, string, string) :void} startRoutine
 */

/**
 * @typedef {Object} DealerHand
 *
 * Handles cards
 *
 * @property {function(number, DeckBank) :CardIntri} getCard
 */

/**
 * @typedef {Object} Turntable
 *
 * Component for card turntable/lazy-suzan/carousel
 *
 *    <turntable>
 *      <off /> <- close btn
 *      <pickup /> <- main view
 *      <cueLever> <- controls
 *        <cuePrevious /> <- back one
 *        <cueNext /> <- forward one
 *      </cueLever>
 *    </turntable>
 *
 * @property {boolean} isOpen
 * @property {string} nextBtn
 * @property {string} prevBtn
 * @property {function(CardIntri)} loadTurntable
 * @property {function(boolean, CardIntri)} spinTurntable
 */

/**
 * @typedef {Object} Tableau
 *
 * Component for cards
 *
 *    <tableau>
 *      <card />
 *      .
 *      . <- (1-52)
 *      .
 *    </tableau>
 *
 * @property {[number]} currentOrder
 */

/**
 * @typedef {Object} Ribbon
 *
 * Component for controls
 *    <ribbon>
 *      <claw /> <- grab cards for image or text download
 *      <brush /> <- changing background color
 *    </ribbon>
 *
 * @property {string} lastPaste
 * @property {string} lastRender
 */

/**
 * @typedef {Object} PCSLattice
 *
 * Landing page layout
 *
 *    <lattice>
 *      <ribbon /> <- panel for controls - {@link Ribbon}
 *      <tableau /> <- dingus for cards - {@link Tableau}
 *      <turntable /> <- hud for card closeup {@link Turntable}
 *    </lattice>
 *
 * @property {Turntable} landingHUD
 */


export const debugName = "pcs:part:types";

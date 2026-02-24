// tsDoc, jsDoc or (fb:meta)flow


/**
 * @typedef { 'kick' | 'needle' | 'scratch' | 'mix' | 'chop' } PCSEventTypes - {@link CustomEvent.type}
 */

/**
 * @typedef {CustomEvent<string>} PCSEvent
 * Use like:
 * 	`new CustomEvent(<PCSEventType>, {detail: "DATA_FOR_RECIPIENT"});`
 */

/**
 * @typedef {Object} GlobalDeclarations
 * Constants
 *
 * @property {number} cardMax
 * @property {string[]} suites
 * @property {string[]} cnames
 * @property {string} ctitlePrefix
 * @property {string} cdescPrefix
 * @property {string} pcscardRef
 * @property {Readonly<PCSEventTypes} notices
 */

/**
 * @typedef {Map<string, string>} VerifynLoad
 *
 * Elements ids for assets to possibly fetch - {@link CSSStyleRule.selectorText}
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
 */

/**
 * @typedef {Object} CardIntri
 * A card
 *
 * @property {number} spot
 * @property {string} title
 * @property {string} description
 * @property {string} symbolRef - {@link CSSStyleRule.selectorText}
 */


/**
 * @namespace Bank
 * Where and How data is stored; Vaults/Stores
 */

/**
 * @typedef {Object} Bank.Deck
 * State of the cards
 *
 * @property {Uint8Array} ndoUcards
 * @property {number[]} ndoCards
 * @property {Uint8Array} ucards
 * @property {number[]} cards
 * @property {function(Uint8Array | number[]): void} updateCards
 * @property {function(): void} resetCards
 * @memberof Bank
 */


/**
 * @namespace Hand
 * Domain methods and implementations for various things; Tools/Utilities
 */

/**
 * @typedef {Object} Hand.Misc
 * Handles various tasks
 *
 * @property {boolean} yapFriendly
 * @property {function (string, string) :void} startAfter
 * @property {function (VerifynLoad, string) :void} warmUp
 * @property {function (VerifynLoad, string, string, string) :void} startRoutine
 * @memberof Hand
 */

/**
 * @typedef {Object} Hand.Dealer
 * Card tricks
 *
 * @property {function(number, Bank.Deck) :Readonly<CardIntri>} getCard
 * @memberof Hand
 */


/**
 * @namespace Part
 * The building blocks; Components/Widgets
 */

/**
 * @typedef {Object} Part.Turntable
 * Component for lazy-suzan/carousel
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
 * @property {number} cursor
 * @property {string} nextBtn
 * @property {string} prevBtn
 * @property {function(CardIntri)} loadTurntable
 * @property {function(CardIntri, boolean)} spinTurntable
 * @memberof Part
 */

/**
 * @typedef {Object} Part.Tableau
 * Viewing all the cards
 *
 *    <tableau>
 *      <card />
 *      .
 *      . <- (1-52)
 *      .
 *    </tableau>
 *
 * @property {[number]} currentOrder
 * @memberof Part
 */

/**
 * @typedef {Object} Part.Ribbon
 * Controls for the card view
 *
 *    <ribbon>
 *      <claw /> <- grab cards for image or text download
 *      <brush /> <- changing background color
 *    </ribbon>
 *
 * @property {string} lastPaste
 * @property {string} lastRender
 * @memberof Part
 */


/**
 * @namespace Lattice
 * Where multiple parts come together; Junctions/Managers/Orchestrators
 */

/**
 * @typedef {Object} Lattice.Landing
 * Home page orchestration
 *
 *    <lattice>
 *      <ribbon /> <- panel for controls - {@link Part.Ribbon}
 *      <tableau /> <- dingus for cards - {@link Part.Tableau}
 *      <turntable /> <- hud for card closeup - {@link Part.Turntable}
 *    </lattice>
 *
 * @property {Readonly<Turntable>} landingHUD
 * @memberof Lattice
 */


export const debugName = "pcs:part:types";

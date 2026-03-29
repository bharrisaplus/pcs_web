// tsDoc, jsDoc or (fb:meta)flow


/**
 * @typedef {string} CSSelector - {@link CSSStyleRule.selectorText}
 * - {@link document.querySelector}
 */


/**
 * @typedef {'kick' | 'needle' | 'scratch' | 'blend' | 'chop' | 'trace' | 'splash' | 'fresh'} PCSEventType
 *
 * @typedef {Object} PCSEventTypes - {@link CustomEvent.type}
 * @property {'kick'} kick Start app
 * @property {'needle'} needle Open Popover
 * @property {'scratch'} scratch Update Popover
 * @property {'blend'} mix Shuffle
 * @property {'chop'} chop Copy and Paste
 * @property {'trace'} trace Generate Image
 * @property {'splash'} splash Change Background Color
 * @property {'fresh'} fresh Reset
 * @see CustomEvent.type
 */

/**
 * @typedef {Object} PCSEventInit
 * {@link CustomEvent} - {@link PCSEventType} - {@link PCSEvent}
 * `new CustomEvent(<PCSEventType>,<PCSEventInit>)`
 * @property {{msg :string, $dispatcher :Element}} detail
 */

/**
 * @typedef {CustomEvent<PCSEventInit>} PCSEvent
 * {@link CustomEvent} - {@link PCSEventType} - {@link PCSEventInit}
 * `new CustomEvent(<PCSEventType>, PCSEventInit)`
 */


/**
 * @typedef {Object} GlobalDeclarations
 * Constants
 *
 * @property {'pcs-shell'} appID
 * @property {Readonly<PCSEventTypes>} notices
 * @property {['green-dye', 'red-dye', 'blue-dye', 'purple-dye']} dyes
 * @property {'magnified view of card'} pcs_cardTitle
 * @property {'A single card up close and personal'} pcs_cardDesc
 * @property {'#pcs-card'} pcs_cardRef
 * @property {'Cards:\n====\n'} pcs_clippre
 * @property {52} c_Max
 * @property {"Number"} c_TitlePrefix
 * @property {'Card in position'} c_DescPrefix
 * @property {['Spade', 'Diamond', 'Club', 'Heart']} c_SuiteList
 * @property {['Ace', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Jack', 'Queen', 'King']} c_NameList
 */


/**
 * @typedef {Map<CSSelector, CSSelector>} VerifynLoad
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
 * @property {number} oglo
 * @property {number} spot
 * @property {string} title
 * @property {string} desc
 * @property {CSSelector} symbolRef
 */


/**
 * @namespace Bank
 * Where and How data is stored; Vaults/Stores
 */

/**
 * @typedef {Object} Bank.Deck
 * State of the cards
 *
 * @property {Uint8Array} ndoUCards
 * @property {number[]} ndoCards
 * @property {Uint8Array} ucards
 * @property {number[]} cards
 * @property {number[]} choice
 * @property {number} backDrop
 * @property {function(Uint8Array | number[]) :void} updateCards
 * @property {function(number) :void} updateChoice
 * @property {function(number) :void} updateBackDrop
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
 * @property {function (string, string) :Promise<boolean>} startAfter
 * @property {function (VerifynLoad, string) :void} warmUp
 * @property {function (VerifynLoad, string, string, string) :Promise<boolean>} startRoutine
 * @memberof Hand
 */

/**
 * @typedef {Object} Hand.Dealer
 * Card tricks
 *
 * @property {function(number, number) :Readonly<CardIntri>} getCard
 * @property {function(Uint8Array, Uint8Array) :Uint8Array} mixUp
 * @memberof Hand
 */

/**
 * @typedef {Object} Hand.Egress
 * Exports
 *
 * @property {function(string) :Promise<Boolean>} exportText
 * @property {function(string, string[], CSSelector) :Promise<string>} generateImage
 * @memberof Hand
 */

/**
 * @typedef {Object} Hand.Scribe
 * Logging
 *
 * @property {function(string, Object) :void} devlog
 * @property {function(string, Object, Exception, boolean) :void} issuelog
 * @property {function(string) :void} notilog
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
 * @property {Boolean} isOpen
 * @property {number[]} cursor
 * @property {string} nextBtn - {@link CSSStyleRule.selectorText}
 * @property {string} prevBtn - {@link CSSStyleRule.selectorText}
 * @property {function(CardIntri)} loadTurntable
 * @property {function(CardIntri)} spinTurntable
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
 * @property {number[]} currentOrder
 * @property {CardIntri[]} updateOrder
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
 * @property {Boolean} isBusy
 * @property {CSSelector} dyeInput
 * @property {function(string[]) :Promise<Boolean>} composeTxt
 * @property {function(string[], CSSelector) :Promise<Boolean>} prepareImg
 * @property {function() :void} resetCtrls
 * @property {CSSelector} copyBtn
 * @property {CSSelector} downloadBtn
 * @property {CSSelector} mingleBtn
 * @property {CSSelector} clearBtn
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
 * @property {function() :void} hookUp
 * @memberof Lattice
 */


/**
 * @namespace Shuttle
 * How data is bus'd around; APIs/Third-Party/Network/Externals
 */

/**
 * @typedef {Object} Shuttle.Host
 * Files to retreive from home
 *
 * @property {function() :Promise<Blob>} grabFile
 * @memberof Shuttle
 */

export const debugName = "pcs:part:types";

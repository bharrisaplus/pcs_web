
/**
 * @import {pcsEvents, GlobalDeclarations} from './_typedefs.mjs'
 */


const
  card_cap = 52,
  card_suites = ["Spade", "Diamond", "Club", "Heart"],
  card_names = ['Ace', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Jack', 'Queen', 'King'],
  card_title_prefix = "Number",
  card_desc_prefix = "Card in position",
  card_pcs_symbol = '#pcs-card',
  card_pcs_title = "magnified view of card",
  card_pcs_desc = "A single card up close and personal",

  evt_prfx = "pcs",
  /** @type {pcsEvents} */
  all_events = Object.freeze({
    kick: evt_prfx + "Kick", // app start
    needle: evt_prfx + "Needle", // popover/hud loading
    scratch: evt_prfx + "Scratch", // popover/hud updating
    mix: evt_prfx + "Mix", // shuffling
    chop: evt_prfx + "Chop" // image render and export
  });

/** @type {GlobalDeclarations} */
const _globals = Object.freeze({
  cardMax: card_cap,
  suites: card_suites,
  cnames: card_names,
  ctitlePrefix: card_title_prefix,
  cdescPrefix: card_desc_prefix,
  pcscardRef: card_pcs_symbol,
  pcsCardTitle: card_pcs_title,
  pcsCardDesc: card_pcs_desc,
  notices: all_events
});

export default _globals;

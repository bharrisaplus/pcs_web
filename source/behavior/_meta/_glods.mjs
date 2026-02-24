
/**
 * @import {PCSEventTypes, GlobalDeclarations} from './_typedefs.mjs'
 */


const
  root_id = "pcs-shell",
  card_cap = 52,
  card_suites = ["Spade", "Diamond", "Club", "Heart"],
  card_names = ['Ace', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Jack', 'Queen', 'King'],
  card_title_prefix = "Number",
  card_desc_prefix = "Card in position",
  card_pcs_symbol = '#pcs-card',
  card_pcs_title = "magnified view of card",
  card_pcs_desc = "A single card up close and personal",

  /** @type {PCSEventTypes} */
  all_events = {
    kick: "kick", // app start
    needle: "needle", // popover/hud loading
    scratch: "scratch", // popover/hud updating
    mix: "mix", // shuffling
    chop: "chop" // image render and export
  };

/** @type {GlobalDeclarations} */
const _globals = {
  appID: root_id,
  cardMax: card_cap,
  suites: card_suites,
  cnames: card_names,
  ctitlePrefix: card_title_prefix,
  cdescPrefix: card_desc_prefix,
  pcscardRef: card_pcs_symbol,
  pcsCardTitle: card_pcs_title,
  pcsCardDesc: card_pcs_desc,
  notices: Object.freeze(all_events)
};

const ro_g = Object.freeze(_globals);

export default ro_g;

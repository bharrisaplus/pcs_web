
/**
 * @import {PCSEventTypes, GlobalDeclarations} from './_typedefs.mjs'
 */


/** @type {PCSEventTypes} */
const all_events = {
  kick: 'kick',
  needle: 'needle',
  scratch: 'scratch',
  mix: "mix",
  chop: "chop",
  trace: "trace",
  splash: "splash"
};

/** @type {GlobalDeclarations} */
const _globals = {
  appID: "pcs-shell",
  cardMax: 52,
  suites: Object.freeze(["Spade", "Diamond", "Club", "Heart"]),
  cnames: Object.freeze(['Ace', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Jack', 'Queen', 'King']),
  ctitlePrefix: 'Number',
  cdescPrefix: "Card in position",
  pcscardRef: '#pcs-card',
  pcsCardTitle: 'Magnified view of card',
  pcsCardDesc: 'A single card up close and personal',
  notices: Object.freeze(all_events)
};

const ro_g = Object.freeze(_globals);

export default ro_g;

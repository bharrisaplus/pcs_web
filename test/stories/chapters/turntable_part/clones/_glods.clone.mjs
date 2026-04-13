/**
 * @import {GlobalDeclarations, PCSEventTypes} from 'pcs:types';
 */


/** @type {PCSEventTypes} */
const all_events = {
  kick: 'kick',
  needle: 'needle',
  scratch: 'scratch',
  blend: "blend",
  chop: "chop",
  trace: "trace",
  splash: "splash",
  fresh: "fresh"
};

/** {@link GlobalDeclarations} */
const _globals = Object.freeze({
  appID: "test-shell",
  notices: Object.freeze(all_events),
  dyes: Object.freeze(['green-dye', 'red-dye', 'blue-dye', 'purple-dye']),
  pcs_cardTitle: 'Magnified view of card',
  pcs_cardDesc: 'A single card up close and personal',
  pcs_cardRef: '#pcs-card',
  pcs_clippre: "Cards:\n====\n",
  c_Max: 14,
  c_TitlePrefix: 'Number',
  c_DescPrefix: "Card in position",
  c_SuiteList: Object.freeze(["Spade", "Diamond", "Club", "Heart"]),
  c_NameList: Object.freeze([
    'Ace', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Jack', 'Queen', 'King'
  ])
});


export default _globals;

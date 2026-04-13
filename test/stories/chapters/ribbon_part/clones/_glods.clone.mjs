/**
 * @import {GlobalDeclarations, PCSEventTypes} from 'pcs:types';
 */


/** {@link PCSEventTypes} */
const all_events = {
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
  c_DescPrefix: "Card in position"
});


export default _globals;

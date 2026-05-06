/**
 * @import {GlobalDeclarations, PCSEventTypes} from 'pcs:types';
 */


/** {@link PCSEventTypes} */
const all_events = {
  scratch: 'scratch'
};

/** {@link GlobalDeclarations} */
const _globals = Object.freeze({
  appID: "test-shell",
  notices: Object.freeze(all_events),
  pcs_cardTitle: 'Magnified view of card',
  pcs_cardDesc: 'A single card up close and personal',
  pcs_cardRef: '#pcs-card',
  c_Max: 14,
  c_TitlePrefix: 'Number',
  c_DescPrefix: "Card in position",
});


export default _globals;

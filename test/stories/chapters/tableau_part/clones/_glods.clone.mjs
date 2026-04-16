/**
 * @import {GlobalDeclarations, PCSEventTypes} from 'pcs:types';
 */


/** {@link PCSEventTypes} */
const all_events = {
  needle: "needle"
};

/** {@link GlobalDeclarations} */
const _globals = Object.freeze({
  appID: "test-shell",
  notices: Object.freeze(all_events),
  c_Max: 52,
  c_TitlePrefix: 'Number',
  c_DescPrefix: "Card in position"
});


export default _globals;

/* clone of source/behavior/_meta/_glods.mjs */


/** @see PCSEventTypes */
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

/** @see GlobalDeclarations */
const _globals = {
  appID: "test-shell",
  notices: all_events,
  dyes: ['green-dye', 'red-dye', 'blue-dye', 'purple-dye'],
  pcs_cardTitle: 'Magnified view of card',
  pcs_cardDesc: 'A single card up close and personal',
  pcs_cardRef: '#test-card',
  pcs_clippre: "Cards:\n====\n",
  c_Max: 14,
  c_TitlePrefix: 'Number',
  c_DescPrefix: "Card in position",
  c_SuiteList: ["Spade", "Diamond", "Club", "Heart"],
  c_NameList: [
    'Ace', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Jack', 'Queen', 'King'
  ]
};


export default _globals;

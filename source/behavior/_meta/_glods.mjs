
/**
 * @import {GlobalDeclarations} from './_typedefs.mjs'
 */

const
  card_cap = 52,
  card_suites = ["Spade", "Diamond", "Club", "Heart"],
  card_names = ['Ace', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Jack', 'Queen', 'King'],
  rev_card_names = card_names.toReversed(),
  card_title_prefix = "Number",
  card_desc_prefix = "Card in position"


/** @type GlobalDeclarations */
export default Object.freeze({
  cardMax: card_cap,
  suites: card_suites,
  cnames: card_names,
  rcnames: rev_card_names,
  ctitlePrefix: card_title_prefix,
  cdescPrefix: card_desc_prefix
});

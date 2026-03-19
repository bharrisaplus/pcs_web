import { test } from 'tape';

test('first taping', function (swear) {
	swear.plan(1);

	swear.equal(2+2, 4, "Math is mathing");
});

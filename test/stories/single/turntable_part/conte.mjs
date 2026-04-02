
let result;
const abc = td.object(['hello']);

td.when(abc.hello()).thenReturn('world');

result = abc.hello();

console.debug(td.explain(abc.hello));
console.info(result);

# useSharedComparator
takes in a comparator function and returns a `compare`
function and an `isException` ref that will be the least common return value of
all of the return values of the `compare` function.

## Usage
```ts
import { useSharedComparator } from "@twitch0125/use-shared-comparator";
const { compare, isException } = useSharedComparator<number>((val) =>
  val === 1
);
const a = ref(1);
const b = ref(2);
compare(a);
console.log(isException.value); // true
compare(b);
console.log(isException.value); // false
b.value = 1;
nextTick(() => console.log(isException.value)); // true
```

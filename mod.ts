/**
 * @module
 *
 * useSharedComparator takes in a comparator function and returns a `compare` function and a `isException` ref that will be the least common return value of all of the return values of the `compare` function.
 */
import {
  type MaybeRefOrGetter,
  onScopeDispose,
  readonly,
  type Ref,
  ref,
  toValue,
  watch,
  watchEffect,
} from "vue";
/**
 * @param comparator - A function that takes in a value and returns a boolean.
 * @example
 *  ```ts
 * import {useSharedComparator} from "@twitch0125/use-shared-comparator"
 * const { compare, isException } = useSharedComparator<number>((val) => val === 1);
 * const a = ref(1)
 * const b = ref(2)
 * compare(a)
 * console.log(isException.value) // true
 * compare(b)
 * console.log(isException.value) // false
 * b.value = 1
 * nextTick(() => console.log(isException.value)) // true
 * ```
 */
export const useSharedComparator = <T>(comparator: (val: T) => boolean): {
  isException: Readonly<Ref<boolean>>;
  /**
   * Registers a watcher to update the shared result with the return value of the comparator, and a watcher to update the shared result to false.
   * Returns a cleanup function to remove the watchers.
   */
  compare: (state: MaybeRefOrGetter<T>) => void;
} => {
  const comparatorResult = ref(false);
  function compare(state: MaybeRefOrGetter<T>): () => void {
    const disposals = [
      watchEffect(() => {
        comparatorResult.value = comparator(toValue(state));
      }),
      watch(comparatorResult, (newComparatorResult) => {
        if (newComparatorResult === false && comparator(toValue(state))) {
          comparatorResult.value = true;
        }
      }),
    ];
    onScopeDispose(() => {
      comparatorResult.value = false;
    });
    return () => {
      disposals.forEach((d) => d());
    };
  }
  return {
    isException: readonly(comparatorResult),
    compare,
  };
};

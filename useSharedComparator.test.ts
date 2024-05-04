import { assertEquals } from "@std/assert";
import { describe, it } from "@std/testing/bdd";
import { effectScope, nextTick, ref } from "vue";
import { useSharedComparator } from "./mod.ts";

describe("useSharedComparator", () => {
  it(
    "return value should be the least common return value of the comparator",
    async () => {
      const { compare, isException } = useSharedComparator<number>((
        val,
      ) => val === 1);
      const a = ref(1);
      const b = ref(1);
      const c = ref(3);
      const scope = effectScope();
      scope.run(() => {
        compare(a);
        compare(b);
        compare(c);
      });
      assertEquals(isException.value, false);
      c.value = 1;
      await nextTick();
      assertEquals(isException.value, true);
      scope.stop();
    },
  );
});

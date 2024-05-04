<script setup lang="tsx" generic="T">
import { type PropType, defineComponent } from "vue";
import { useSharedComparator } from "./mod.ts";
const props = defineProps<{
  comparator: (val: T) => boolean;
}>();
const { isException, compare } = useSharedComparator<T>(props.comparator);
</script>
<template>
  <slot :compare :is-exception />
</template>

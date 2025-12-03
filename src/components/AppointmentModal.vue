<template>
  <div v-if="isOpen">Modal Placeholder</div>
</template>

<script>
// El componente CalendarView necesita que al menos se declare la prop 'isOpen'
export default {
  props: {
    isOpen: Boolean,
  },
}
</script>

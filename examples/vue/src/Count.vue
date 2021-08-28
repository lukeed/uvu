<script setup>
import { ref } from 'vue'

const props = defineProps({
  count: { type: Number, default: 5 }
})

const value = ref(props.count)
</script>

<template>
  <button id="decr" @click="value--">--</button>
  <span>{{ value }}</span>
  <button id="incr" @click="value++">++</button>
</template>

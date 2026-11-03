<script setup>
import { ref } from 'vue'
import { ApSearchField } from '@home/ui'

const q = ref('')
</script>

<template>
  <ApSearchField v-model="q" shortcut class="max-w-md" />
</template>

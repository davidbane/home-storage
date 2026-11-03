<script setup>
import { ref } from 'vue'
import { ApSearchField } from '@home/ui'

const query = ref('')
</script>

<template>
  <ApSearchField v-model="query" shortcut class="max-w-md" />
</template>

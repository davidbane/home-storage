<script setup>
import { ApButton, ApDock } from '@home/ui'
</script>

<!-- In an app the dock is fixed to the bottom on phones and hidden at 960px and up.
     The wrapper here pins it in place. -->
<template>
  <div class="overflow-hidden rounded-lg [&>div]:static! [&>div]:block!">
    <ApDock :mobile-only="false">
      <ApButton class="flex-1">Move</ApButton>
      <ApButton variant="primary" class="flex-2">Add to shopping list</ApButton>
    </ApDock>
  </div>
</template>

<script setup>
import { ApList, ApListRow } from '@home/ui'
</script>

<template>
  <ApList class="max-w-md">
    <ApListRow name="9V batteries" sub="Par 4" status="low" :qty="1" to="/" />
    <ApListRow name="AA batteries" sub="Par 8" status="ok" :qty="12" to="/" selected />
    <ApListRow name="Headlamp" sub="Camping overflow" status="surplus" :qty="2" to="/" />
    <ApListRow name="Tea lights" sub="Box of 50" status="long" :qty="1" to="/" />
  </ApList>
</template>

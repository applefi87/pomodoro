<template lang="pug">
table
  tr
    th 專案
    th 標題
    th 專心
    th 分心
  tr(v-for="it in data.endLists")
    td.project {{ it.project }}
    td.title {{ it.title }}
    td.focus {{ it.totalTime }}
    td.distract {{ it.distractTime }}

</template>

<script setup>
import { useDataStore } from '../stores/data.js'
const data = useDataStore()
</script>

<style lang="sass" scoped>
table
  width: 80%
  margin: auto
  font-size: 30px
  border-collapse: collapse
td,th
  border:1px solid black
  padding:0 10px
.project
  width: 40%

</style>
 

<template lang="pug">
button(@click="clear") 清空
table
  tr
    th 標題
    th 專案
    th 開始時間
    th 專心
    th 分心

  tr(v-for="it in data.endLists")
    td.title {{ it.title }}
    td.project {{ it.project }}
    td.startTime {{ it.startTime }}
    td.totalTime {{ it.totalTime }}
    td.distractTime {{ it.distractTime }}


</template>

<script setup>
import { useDataStore } from '../stores/data.js'
const data = useDataStore()
const clear = () => {
data.endLists=[]
}

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
.title
  width: 40%

</style>
 

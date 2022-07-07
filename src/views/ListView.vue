<template lang="pug">
.content
  button(@click="clear") 清空
  br
  | 專案:
  select(v-model="projectFilter")
    option(:value="false") 全部 
    option(v-for="p in projectList" :value="p") {{ p }}
  |  專心:{{ total.focus }}
  | 分心:{{ total.distract }}
  table
    tr
      th 專案
      th 標題 
      th 專心
      th 分心
      th 時間
    tr(v-for="it in filtedList")
      td.project {{ it.project }}
      td.title {{ it.title }}
      td.focusTime {{ it.focusTime }}
      td.distractTime {{ it.distractTime }}
      td.startTime {{ it.startTime }}
</template>

<script setup>
import { ref, computed } from 'vue'
import { useDataStore } from '../stores/data.js'
const data = useDataStore()
// 清空紀錄
const clear = () => {
  data.endLists = []
}

// 建立專案清單供過過濾
const projectList = computed(() => {
  // 從完成清單取出有專案的專案名稱
  const list = data.endLists.filter(it => it.project).map(it => it.project)
  // 變成不重複名單
  return [...new Set(list)]
})
const projectFilter = ref(false)

// 過濾後顯示的專案內容
const filtedList = computed(() => {
  return projectFilter.value ? data.endLists.filter(it => it.project === projectFilter.value) : data.endLists
})

// 顯示專心與分心時間(過濾後的,以物件表示)
const total = computed(() => {
  // 統計數字後，data.timeFormated 轉成文字00:00
  const focus = data.timeFormated(filtedList.value.map(it => it.focusTime).reduce((sum, n) => sum + n, 0))
  const distract = data.timeFormated(filtedList.value.map(it => it.distractTime).reduce((sum, n) => sum + n, 0))
  return {  focus, distract }
})
</script>

<style lang="sass" scoped>
@import '@/styles/mixin/_mixin'
.content
  padding-left: 3px
  width: 50%
  margin-left: auto
  @include phone
    width: 100%
    padding: 10px 20px
table
  width: 80%
  margin: auto
  font-size: calc(12px + 1vw)
  border-collapse: collapse
  @include phone
  width: 100%
td,th
  border:1px solid black
  padding:0 10px
  @include phone
    border: none
    text-align: center
th
  color: #0a0
  @include phone
    border-bottom: 1px solid black

.title
  width: 40%
  @include phone
    text-align: start
    font-weight: 700

button
  padding:2px 5px
  background: #ff8
  border: 1px solid black
  border-radius: 3px

// 專案過濾用
select
  height: 25px
  border: 1px solid black
  border-radius: 3px
  padding: 0 5px
  font-size: 20px
  line-height: 20px
  @include phone
    width: 120px
    font-size: 18px
</style>
 

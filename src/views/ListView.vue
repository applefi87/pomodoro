<template lang="pug">
button(@click="clear") 清空
| 專案:
select(v-model="projectFilter")
  option(:value="false") 全部
  option(v-for="p in projectList" :value="p") {{ p }}
| 共專心:{{ total.focus }}
| 共分心:{{ total.distract }}
table
  tr
    th 標題
    th 專案
    th 開始時間
    th 專心
    th 分心
  tr(v-for="it in filtedList")
    td.title {{ it.title }}
    td.project {{ it.project }}
    td.startTime {{ it.startTime }}
    td.focusTime {{ it.focusTime }}
    td.distractTime {{ it.distractTime }}
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


button
  padding:5px
  border: 1px solid black
  border-radius: 3px
// 過濾相關
  // 專案過濾用
select
  border: 1px solid black
  border-radius: 3px
  margin-left: 10px
  padding: 0 5px
  font-size: 20px
</style>
 

<template lang="pug">
h1(v-if="playState === '專心中'") 專案:{{ nowItem.project }}  名稱: {{ nowItem.name }}
h1(v-else)  名稱: {{ nowItem.name }}  
hr
h1.text-center
v-row.text-center
  v-col.timer  {{ leftTimeDisplay }}+{{ leftTime }} 
  v-col(cols='12')
    v-btn.mx-3(v-if="!going" icon='mdi-play' @click="start")
    v-btn.mx-3(icon='mdi-pause' @click='stop')
    v-btn.mx-3(icon='mdi-skip-next' @click='earlier')
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useAlarmStore } from '../stores/alarm.js'
import { useDataStore } from '../stores/data.js'
const alarm = useAlarmStore()
const dataList = useDataStore()
const time = parseInt(import.meta.env.VITE_TIME)
const rest = parseInt(import.meta.env.VITE_REST)
const bigRest = parseInt(import.meta.env.VITE_BIG_REST)
const nowItem = reactive(dataList.lists[0])
const leftTime = ref(0)
const leftTimeDisplay = ref('00:00')
const timeFormated = (n) => {
  return Math.floor(n / 60).toString().padStart(2, '0') + ':' + (n % 60).toString().padStart(2, '0')
}

const going = ref(false)
const pauseTime = ref(0)
// '專心中'/'休息中'/'大休息'
const playState = ref('專心中')
let timer = 0

const start = () => {
  going.value = true
  if (playState.value === '專心中') {
    leftTime.value = time
    Object.assign(nowItem, dataList.lists.shift())
  } else if (playState.value === '休息中') {
    leftTime.value = rest
    Object.assign(nowItem, dataList.restLists[0])
    if (dataList.lists.length == 0) {
      Object.assign(nowItem, dataList.restLists[2])
      return false
    }
  } else {
    Object.assign(nowItem, dataList.restLists[1])
  }
  leftTimeDisplay.value = timeFormated(leftTime.value)
  countDown()
}
const countDown = () => {
  timer = setInterval(() => {
    leftTimeDisplay.value = timeFormated(--leftTime.value)
    if (leftTime.value === 0) {
      end(true)
    }
  }, 1000)
}
const end = (b) => {
  clearInterval(timer)
  dataList.endLists.push(nowItem)
  console.log(dataList.endLists.length);
  if (b) (alarm.playAudio())
   update()
}
const update = () => {
  if (playState.value === '休息中') {
    playState.value = '專心中'
  } else {
    playState.value = '休息中'
  }
  start()
}
const stop = () => {
  clearInterval(timer)
  going.value = false
}
const earlier = () => {
  nowItem.totalTime = nowItem.id > 0 ? time - leftTime.value : rest - leftTime.value
  end(false)
}


</script >

<style scoped lang='sass'>
.timer
  font-size: 40px
</style>
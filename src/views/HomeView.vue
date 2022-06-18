<template lang="pug">
h1(v-if="playState === '專心中'") 專案:{{ nowItem.project }}  名稱: {{ nowItem.name }}
h1(v-else)  名稱: {{ nowItem.name }}  
hr
h1.text-center
v-row.text-center
  v-col(cols='8').timer  {{ leftTimeDisplay }} 
  v-col(cols='4' v-if="going && playState === '專心中'").timer 分心:{{ distractTimeDisplay }}
  v-col(cols='8' )
    v-btn.mx-3(v-if="!going" icon='mdi-play' @click="start")
    v-btn.mx-3(v-else icon='mdi-pause' @click='stop')
    v-btn.mx-3(icon='mdi-skip-next' @click='earlier')
  v-col(cols='4' v-if="going && playState === '專心中'")
    v-btn.mx-3(v-if="going && !distracting" icon='mdi-play' @click="distract")
    v-btn.mx-3(v-if="going && distracting" icon='mdi-pause' @click='stopDistract')
    //- v-btn.mx-3(icon='mdi-skip-next' @click='earlier')
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
let leftTime = 0
let distractTime = 0
const leftTimeDisplay = ref('00:00')
const distractTimeDisplay = ref('00:00')
const timeFormated = (n) => {
  return Math.floor(n / 60).toString().padStart(2, '0') + ':' + (n % 60).toString().padStart(2, '0')
}

const going = ref(false)
const distracting = ref(false)
const pauseTime = ref(0)
// '專心中'/'休息中'/'大休息'
const playState = ref('專心中')
let timer = 0
let distractTimer = 0
const start = () => {
  going.value = true
  distractTime = 0
  if (playState.value === '專心中') {
    leftTime = time
    Object.assign(nowItem, dataList.lists.shift())
  } else if (playState.value === '休息中') {
    leftTime = rest
    Object.assign(nowItem, dataList.restLists[0])
    // 清單空了，跳成結束畫面停止執行
    if (dataList.lists.length == 0) {
      Object.assign(nowItem, dataList.restLists[2])
      return false
    }
  } else {
    Object.assign(nowItem, dataList.restLists[1])
  }
  // 先存進去該次的總計時 避免過程改掉抓到新的
  nowItem.totalTime = time
  // 當下立刻更新顯示時間
  leftTimeDisplay.value = timeFormated(leftTime)
  distractTimeDisplay.value = timeFormated(distractTime)
  countDown()
}

const countDown = () => {
  timer = setInterval(() => {
    leftTimeDisplay.value = timeFormated(--leftTime)
    if (leftTime === 0) {
      end(true)
    }
  }, 1000)
}
const end = (b) => {
  // 停止全部的計時
  clearInterval(timer)
  clearInterval(distractTimer)
  // 更新專心時間-分心時間
  nowItem.totalTime = nowItem.totalTime - distractTime
  // 更新分心時間+關閉分心狀態
  nowItem.distractTime = distractTime
  distracting.value = false

  // 當前加到結束去
  dataList.endLists.push(nowItem)
  console.log(dataList.endLists[dataList.endLists.length - 1]);
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
const distract = () => {
  distracting.value = true
  distractTimer = setInterval(() => {
    distractTimeDisplay.value = timeFormated(++distractTime)
  }, 1000)
}

const stopDistract = () => {
  clearInterval(distractTimer)
  distracting.value = false
}

const stop = () => {
  clearInterval(timer)
  going.value = false
}
const earlier = () => {
  nowItem.totalTime = nowItem.id > 0 ? time - leftTime - distractTime : rest - leftTime
  end(false)
}


</script >

<style scoped lang='sass'>
.timer
  font-size: 40px
</style>
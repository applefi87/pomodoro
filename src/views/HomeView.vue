<template lang="pug">
hr
div.input( @keydown.enter="submit")
  p 標題:
  input(type="text" :style="check" placeholder="至少2個字"  v-model="inputTitle" @keydown.esc="cancel('title')")
  p 專案:
  input.project(type="text" placeholder="(選填)" v-model="inputProject" @keydown.esc="cancel('project')")
  button(@click="submit") 送出
  button.cancel(@click="cancel") 取消
hr
div(v-if="data.lists.length == 0 && !going")
  h1.text-center 無任務，請新增於上方
div(v-else)
  h1(v-if="playState === '專心中'") 專案:{{ nowItem.project }}  名稱: {{ nowItem.title }}
  h1(v-else)  名稱: {{ nowItem.title }}  
  hr
  h1.text-center
  v-row.text-center
    v-col(cols='8').timer  {{ leftTimeDisplay }} 
    v-col(cols='4' v-if="going && playState === '專心中'").timer 分心:{{ distractTimeDisplay }}
    v-col(cols='8' )
      v-btn.mx-3(v-if="!going" icon='mdi-play' @click="start")
      div.mx-3(v-else)
        v-btn.mx-3( icon='mdi-pause' @click='stop')
        v-btn.mx-3( icon='mdi-skip-next' @click='earlier')
        v-btn.mx-3( icon='mdi-content-duplicate' @click='duplicate')
    v-col(cols='4' v-if="going && playState === '專心中'")
      v-btn.mx-3(v-if="going && !distracting" icon='mdi-play' @click="distract")
      v-btn.mx-3(v-if="going && distracting" icon='mdi-pause' @click='stopDistract')
hr
listPage
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useAlarmStore } from '../stores/alarm.js'
import { useDataStore } from '../stores/data.js'
import listPage from '../components/listPage.vue'

const alarm = useAlarmStore()
const data = useDataStore()


const time = parseInt(import.meta.env.VITE_TIME)
const rest = parseInt(import.meta.env.VITE_REST)
const bigRest = parseInt(import.meta.env.VITE_BIG_REST)
const nowItem = reactive(data.lists[0])
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
  if (data.lists.length == 0) {
    // 這樣下次使用才不是從休息開始
    playState.value = '專心中'
    return
  }
  going.value = true
  distractTime = 0
  if (playState.value === '專心中') {
    leftTime = time
    Object.assign(nowItem, data.lists.shift())
  } else if (playState.value === '休息中') {
    leftTime = rest
    Object.assign(nowItem, data.restLists[0])
    // 清單空了，跳成結束畫面停止執行
  } else {
    Object.assign(nowItem, data.restLists[1])
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
      end(0)
    }
  }, 1000)
}
const end = (num) => {
  // 恢復按鍵狀態
  going.value = false
  distracting.value = false
  // 停止全部計時
  clearInterval(timer)
  clearInterval(distractTimer)
  if (alarm.notify) {
    new Notification(nowItem.title + '時間到', { body: 'nowItem.title', icon: 'https://github.com/rogeraabbccdd.png' })
  }
  // 更新專心時間-分心時間
  nowItem.totalTime = nowItem.totalTime - distractTime
  // 更新分心時間
  nowItem.distractTime = distractTime
  // 當前加到結束去
  data.endLists.push(nowItem)
  if (num === 0) { alarm.playAudio() }
  else if (num) {
    alarm.playAudio(num)
  }
  update()
}
// 更新狀態文字
const update = () => {
  if (playState.value === '休息中') {
    playState.value = '專心中'
  } else {
    playState.value = '休息中'
  }
  start()
}

// 分心
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
// 
const stop = () => {
  clearInterval(timer)
  going.value = false
}
const earlier = () => {
  nowItem.totalTime = nowItem.id > 0 ? nowItem.totalTime - leftTime - distractTime : rest - leftTime
  end(2)
}
const duplicate = () => {
  data.lists.unshift(JSON.parse(JSON.stringify(nowItem)))
}


// --最上欄功能:
const inputTitle = ref('')
const inputProject = ref('')

const check = computed(() => {
  if (inputTitle.value.length > 1) {
    return { border: '4px solid green' }
  } else if (inputTitle.value.length == 1) {
    return { border: '4px solid red' }
  } else {
    return { border: '3px solid black' }
  }
})

// 送出/取消 (可enter送出)
const submit = () => {
  if (inputTitle.value.length > 1) {
    data.addlist(inputTitle.value, inputProject.value)
    // 這樣當跑完重加任務時/從0新增任務時，會順便把最上面的丟到待辦欄比較好看
    if (data.lists.length == 1) { Object.assign(nowItem, data.lists[0]) }
    inputTitle.value = ''
    inputProject.value = ''
  }

}

// 可區分全部取消/esc單格取消
const cancel = (set) => {
  if (set === 'title') {
    inputTitle.value = ''
  } else if (set === 'project') {
    inputProject.value = ''
  } else {
    inputTitle.value = ''
    inputProject.value = ''
  }

}



</script >

<style scoped lang='sass'>
.input
  height: 50px
  display: flex
  align-items: center
  line-height: 40px
  font-size: 35px
  input
    height: 40px
    width: 400px
    font-size: 30px
    padding: 0 10px
    border: 1px solid black
    border-radius: 5px
    line-height: 40px
  .project
    width: 300px
  p
    margin-left: 10px
    font-weight: 700
  button
    height: 40px
    width: 100px
    margin-left: 20px
    border: 1px solid black
    border-radius: 5px
    font-weight: 700
    color: white
    background: #0a0

.timer
  font-size: 40px
</style>
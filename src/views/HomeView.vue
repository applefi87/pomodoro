<template lang="pug">
div.content
  div.input( @keydown.enter="submit")
    div.input-bar
      div
        p 標題:
        input(type="text" :style="check" placeholder="至少2個字"  v-model="inputTitle" @keydown.esc="cancel('title')")
      div
        p 專案:
        input.project(type="text" placeholder="(選填)" v-model="inputProject" @keydown.esc="cancel('project')")
    div.btn
      button(@click="submit") 送出
      button.cancel(@click="cancel") 取消
  div.timer
    div(v-if="data.lists.length == 0 && !going")
      h1.text-center 無任務，請新增於上方
    div(v-else)
      h1.title(v-if="playState === '專心中'") 名稱: {{ nowItem.title }} <br> 專案:{{ nowItem.project }} 
      h1.title(v-else)  名稱: {{ nowItem.title }}  
      v-row.text-center
        v-col(cols='12' ).timerNum  剩餘: {{ leftTimeDisplay }} 
          div.btns
            v-btn.mx-3(v-if="!going" icon='mdi-play' @click="start")
            div.mx-3(v-else :style="{ display: 'inline-block' }")
              v-btn.mx-3( icon='mdi-pause' @click='stop')
              v-btn.mx-3( icon='mdi-skip-next' @click='earlier')
              v-btn.mx-3( icon='mdi-content-duplicate' @click='nowItem.id > 0 ? data.duplicate(0) : 1' :style="dulplicateStyle")
        v-col(cols='12' v-if="going && playState === '專心中'").timerNum 分心:{{ distractTimeDisplay }}
          div.btns(cols='4' v-if="going && playState === '專心中'")
            v-btn.mx-3(v-if="going && !distracting" icon='mdi-play' @click="distract")
            v-btn.mx-3(v-if="going && distracting" icon='mdi-pause' @click='stopDistract')
  listPage.list
</template>

<script setup>
import { ref, reactive, computed, toRefs } from 'vue'
import { useAlarmStore } from '../stores/alarm.js'
import { useDataStore } from '../stores/data.js'
import listPage from '../components/listPage.vue'

const alarm = useAlarmStore()
const data = useDataStore()
const { going } = toRefs(data)

const time = parseInt(import.meta.env.VITE_TIME)
const rest = parseInt(import.meta.env.VITE_REST)
const bigRest = parseInt(import.meta.env.VITE_BIG_REST)
const nowItem = reactive(data.lists[0] || { id: 0, title: '不會顯示，只是避免F5後沒資料報錯', project: "", focusTime: 0, distractTime: 0, startTime: 0 })
let leftTime = 0
let distractTime = 0
const leftTimeDisplay = ref('00:00')
const distractTimeDisplay = ref('00:00')


going.value = false
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
    // 加上開始時間+丟到執行中
    data.lists[0].startTime = new Date().getHours() + ':' + new Date().getMinutes()
    Object.assign(nowItem, data.lists[0])
  } else if (playState.value === '休息中') {
    leftTime = rest
    Object.assign(nowItem, data.restLists[0])
    // 清單空了，跳成結束畫面停止執行
  } else {
    Object.assign(nowItem, data.restLists[1])
  }
  // 先存進去該次的總計時 避免過程改掉抓到新的
  nowItem.focusTime = time
  // 當下立刻更新顯示時間
  leftTimeDisplay.value = data.timeFormated(leftTime)
  distractTimeDisplay.value = data.timeFormated(distractTime)
  countDown()
}

const countDown = () => {
  timer = setInterval(() => {
    leftTimeDisplay.value = data.timeFormated(--leftTime)
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
    // 不知為何手機開通知會當掉
    new Notification(nowItem.title + '時間到', { body: nowItem.title, icon: 'https://raw.githubusercontent.com/applefi87/pomodoro/master/public/favicon.ico' })
  }
  // 更新專心時間-分心時間
  nowItem.focusTime = nowItem.focusTime - distractTime
  // 更新分心時間
  nowItem.distractTime = distractTime

  // 非休息時，當前任務加到結束去 再刪除第一個項目(如果讀取時就刪>結束再存，更新頁面會導致當前任務遺失)
  if (playState.value === '專心中') {
    data.endLists.push(JSON.parse(JSON.stringify(nowItem)))
    data.lists.shift()
  }


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
    distractTimeDisplay.value = data.timeFormated(++distractTime)
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
  nowItem.focusTime = nowItem.id > 0 ? nowItem.focusTime - leftTime - distractTime : rest - leftTime
  end(2)
}

// 休息不可複製的造型(複製功能在data裡)
const dulplicateStyle = computed(() => {
  return playState.value === '休息中' ? { background: '#933', cursor: 'not-allowed' } : {}
})


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
@import '@/styles/mixin/_mixin'
.content
  padding: 0
  display: flex
  flex-direction: row-reverse
  flex-wrap: wrap
  justify-content: space-between
// 輸入區 
.input
  width: 50%
  display: flex
  flex-direction: column
  align-items: center
  line-height: 40px
  background: rgb(255, 248, 155)
  border-bottom: double 1px rgb(197, 197, 197) 
  @include phone
    width: 100%
  .input-bar
    width: 100%
    display: flex
    flex-wrap: wrap
    flex-direction: column
    justify-content: space-between
    div
      display: flex
      flex-direction: row
      width: 100%
      margin-block: 20px
      p
        margin: 0 5px 0 15px
        font-weight: 700
        font-size: calc(15px + 1vw)
        @include phone
          font-size: 25px
    input
      height: 40px
      line-height: 40px
      width:75%
      padding: 0 10px
      border: 1px solid black
      border-radius: 5px
      font-size: calc(13px + 1vw)
      background: white
  .btn
    width: 300px
    margin-bottom: 20px
    display: flex
    flex-direction: row
    justify-content: space-between
    button
      height: 40px
      width: 100px
      margin-left: 20px
      border: 1px solid black
      border-radius: 5px
      font-weight: 700
      color: white
      background: rgb(255, 139, 139)
      @include phone
        font-size: 1.5rem
// 計時區
.timer
  width: calc(50% - 80px)
  background: rgb(255, 252, 204)
  @include phone
    width: 100%
    position: sticky
    top: 57px
    z-index: 500
    padding: 10px 0 
  &>div
    display: flex
    flex-direction: column
    flex-wrap: wrap
  .title
    font-size: calc(20px + 1vw)
    display: block
    margin-left: 10px
.timerNum
  font-size: calc(30px + 1vw)
  padding: 10px 0 0
.text-center
  margin:0
.btns
  display: flex
  flex-direction: row
  justify-content: center
.list
  width: 50% 
  background: rgb(92, 195, 115)
  @include phone
    width: 100%
</style>
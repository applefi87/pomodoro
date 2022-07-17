<template lang="pug">
div.content
  div.timer
    div(v-if="data.lists.length == 0 && !going")
      h1 無任務，請新增
    div(v-else)
      h1.title(v-if="playState === '專心中'") {{ nowItem.title }} <br> {{ nowItem.project }} 
      h1.title(v-else)  {{ nowItem.title }}  
      v-row
        v-col(v-if="going" cols='12').timerNum  剩餘: {{ leftTimeDisplay }} 
        v-col(v-else cols='12').timerNum
        div.btns
          v-btn(v-if="!going"  @click="start")
            svg.v-btn(xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512")
              path(d="M361 215C375.3 223.8 384 239.3 384 256C384 272.7 375.3 288.2 361 296.1L73.03 472.1C58.21 482 39.66 482.4 24.52 473.9C9.377 465.4 0 449.4 0 432V80C0 62.64 9.377 46.63 24.52 38.13C39.66 29.64 58.21 29.99 73.03 39.04L361 215z")
          divv-bottom-navigation(v-else :style="{ display: 'inline-block' }")
            v-btn( @click='stop')
              svg.v-btn(xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 512')
                path(d='M272 63.1l-32 0c-26.51 0-48 21.49-48 47.1v288c0 26.51 21.49 48 48 48L272 448c26.51 0 48-21.49 48-48v-288C320 85.49 298.5 63.1 272 63.1zM80 63.1l-32 0c-26.51 0-48 21.49-48 48v288C0 426.5 21.49 448 48 448l32 0c26.51 0 48-21.49 48-48v-288C128 85.49 106.5 63.1 80 63.1z')            
            v-btn(@click='earlier')
              svg.v-btn(xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512')
                path(d='M52.51 440.6l171.5-142.9V214.3L52.51 71.41C31.88 54.28 0 68.66 0 96.03v319.9C0 443.3 31.88 457.7 52.51 440.6zM308.5 440.6l192-159.1c15.25-12.87 15.25-36.37 0-49.24l-192-159.1c-20.63-17.12-52.51-2.749-52.51 24.62v319.9C256 443.3 287.9 457.7 308.5 440.6z')            
            v-btn(@click='nowItem.id > 0 ? data.duplicate(0) : 1' :style="dulplicateStyle")
              svg.v-btn(xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512')
                path(d='M384 96L384 0h-112c-26.51 0-48 21.49-48 48v288c0 26.51 21.49 48 48 48H464c26.51 0 48-21.49 48-48V128h-95.1C398.4 128 384 113.6 384 96zM416 0v96h96L416 0zM192 352V128h-144c-26.51 0-48 21.49-48 48v288c0 26.51 21.49 48 48 48h192c26.51 0 48-21.49 48-48L288 416h-32C220.7 416 192 387.3 192 352z')        
        v-col(cols='12' v-if="going && playState === '專心中'").timerNum.distractT 分心:{{ distractTimeDisplay }}
          div.btns(cols='4' v-if="going && playState === '專心中'")
            v-btn(v-if="going && !distracting"  @click="distract")
              svg.v-btn(xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512")
                path(d="M361 215C375.3 223.8 384 239.3 384 256C384 272.7 375.3 288.2 361 296.1L73.03 472.1C58.21 482 39.66 482.4 24.52 473.9C9.377 465.4 0 449.4 0 432V80C0 62.64 9.377 46.63 24.52 38.13C39.66 29.64 58.21 29.99 73.03 39.04L361 215z")
            v-btn(v-if="going && distracting" @click='stopDistract')
              svg.v-btn(xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 512')
                path(d='M272 63.1l-32 0c-26.51 0-48 21.49-48 47.1v288c0 26.51 21.49 48 48 48L272 448c26.51 0 48-21.49 48-48v-288C320 85.49 298.5 63.1 272 63.1zM80 63.1l-32 0c-26.51 0-48 21.49-48 48v288C0 426.5 21.49 448 48 448l32 0c26.51 0 48-21.49 48-48v-288C128 85.49 106.5 63.1 80 63.1z')            
  .right
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
    // 結束的剩餘時間都會規0，暫停不會
    if (leftTime === 0) {
      leftTime = time
    }
    // 加上開始時間+丟到執行中
    data.lists[0].startTime = new Date().getHours() + ':' + new Date().getMinutes()
    Object.assign(nowItem, data.lists[0])
  } else if (playState.value === '休息中') {
    // 結束的剩餘時間都會規0，暫停不會
    if (leftTime === 0) {
      leftTime = rest
    }
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
  // 跟暫停區分(暫停不經過這 點撥放時有剩餘時間)
  leftTime = 0

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
h1
  color: #E96D6D
.content
  padding: 0
  height: 100vh
  display: flex
  flex-wrap: wrap
  justify-content: space-between
  align-content: stretch

// 計時區
.timer
  width: calc(50% - 80px)
  margin-top: 100px
  @include phone
    width: 100%
    position: sticky
    top: 57px
    z-index: 500
    padding: 10px 0
    // 內部垂直排 
  &>div
    text-align: center
    display: flex
    flex-direction: column
    flex-wrap: wrap
    align-items: center
    // 標題/專案文字
  .title
    color: #E96D6D
    font-size: calc(30px + 3vw)
    line-height: calc(40px + 3vw)
    display: block
    margin-left: 10px
// 倒數時間
.timerNum
  color: #707070
  font-size: calc(30px + 3vw)
  margin: 10px 0 20px

//分心的標題 
.distractT
  font-size: calc(30px + 2vw)
  color: #979797
  .v-btn
    margin-top: 5px
    height: 35px

// 按鈕的容器
.btns
  padding: 0px 0 30px
  width: 100%
  display: flex
  flex-direction: row
  justify-content: center

.v-btn
  box-shadow: none
  color: #E96D6D
  fill: #E96D6D
  height: 30px
  margin: 0 5px
.list
  width: 50% 
  background: rgb(92, 195, 115)
  @include phone
    width: 100%
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

</style>
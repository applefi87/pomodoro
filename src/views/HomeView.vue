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
          div(v-else :style="{ display: 'inline-block' }")
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
    .input(v-if="!plusState"  @keydown.enter="submit")
      .input-bar
        .closeInput
          label.closeInput(v-if="!plusState" for="plus")
            v-icon(icon="mdi-window-close")
        div
          p Title:
          input(type="text" :style="check" placeholder="至少2個字"  v-model="inputTitle" @keydown.esc="cancel('title')")
        div
          p Task:
          input.project(type="text" placeholder="(選填)" v-model="inputProject" @keydown.esc="cancel('project')")
      .btn
        button(@click="submit") 送出
        button.cancel(@click="cancel") 取消
    listPage.list
  label.plus(v-if="plusState" for="plus")
    v-icon(icon="mdi-plus")
  input#plus(type="checkbox" v-model="plusState")
</template>

<script setup>
import { ref, reactive, computed, toRefs } from 'vue'
import { useAlarmStore } from '../stores/alarm.js'
import { useDataStore } from '../stores/data.js'
import listPage from '../components/listPage.vue'

const alarm = useAlarmStore()
const data = useDataStore()
const { going } = toRefs(data)

// 當壓"+"時才跳輸入框
const plusState = ref(true)
window.onresize = () => {
  if (window.innerWidth > 576) {
    plusState.value = false
  }
}

// 
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
  if (inputTitle.value.length == 1) {
    return { border: '2px solid #E96D6D' }
  } else {
    return {}
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
   plusState.value = true
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
  justify-content: space-between
  align-content: stretch
  @include phone
    flex-direction: column
    justify-content: flex-start
    align-items: center
// --------------------------計時區
.timer
  width: calc(50% - 80px)
  margin-top: 100px
  @include phone
    margin-top: 10px
    width: 100%
    min-height: 250px
    height: 50vw
    flex-shrink: 0
  &>div
    text-align: center
    display: flex
    flex-direction: column
    flex-wrap: wrap
    align-items: center
    // 標題/專案文字
  .title
    color: #E96D6D
    font-size: calc(20px + 3.5vw)
    line-height: calc(30px + 3.5vw)
    display: block
    margin-left: 10px
// 倒數時間
.timerNum
  color: #707070
  font-size: calc(25px + 3.3vw)
  padding: 10px 0 20px
  @include phone
    margin: 0
    padding: 5px 0 10px
//分心的標題 
.distractT
  font-size: calc(20px + 2.5vw)
  color: #979797
  .v-btn
    margin-top: 5px
    height: 35px
    @include phone
      margin-top: 0px
      height: 25px

// 按鈕的容器
.btns
  padding: 0px 0 30px
  width: 100%
  display: flex
  flex-direction: row
  justify-content: center
  @include phone
    padding: 0px 0 0px
.v-btn
  box-shadow: none
  color: #E96D6D
  fill: #E96D6D
  height: 30px
  margin: 0 5px
  @include phone
    height: 25px
//----------------------------------右側
.right
  width:50% 
  @include phone
    width:95% 
// 輸入區 
.input
  width: 90%
  margin: 20px auto
  border-radius: 10px
  box-shadow: 1px 1px 2px 0px rgba(97, 37, 37, 0.567)
  background: #F8C5C5
  display: flex
  flex-direction: column
  align-items: center
  line-height: 40px
  border-bottom: double 1px rgb(197, 197, 197) 
  @include phone
    width: 95%
    position: absolute
    z-index: 1050
    left: 50%
    top: 30%
    transform: translate(-50%,-50%)
    box-shadow: 0 0 20px 50vh rgba(0,0,0 ,0.4 )
  .input-bar
    color: #707070
    width: 100%
    display: flex
    flex-wrap: wrap
    flex-direction: column
    justify-content: space-between
    div
      display: flex
      flex-direction: row
      width: 100%
      margin: 10px 0
      @include phone
        margin: 0 0 20px
      p
        margin: 0 5px 0 15px
        font-weight: 700
        font-size: calc(15px + 1vw)
        @include phone
          font-size: 25px
    input
      color: #707070
      height: 40px
      line-height: 40px
      width:75%
      border: none
      outline: none
      padding: 0 10px
      border-radius: 5px
      font-size: calc(13px + 1vw)
  .btn
    width: 300px
    margin-bottom: 10px
    display: flex
    flex-direction: row
    justify-content: space-between
    @include phone
      width: 250px
    button
      font-size: calc(15px + 1vw)
      height: 40px
      width: 100px
      margin-left: 20px
      border-radius: 5px
      font-weight: 700
      color: white
      box-shadow: 1px 1px 2px 0px rgba(97, 37, 37, 0.567)
      background: #E96D6D
      @include phone
        font-size: 1.5rem
.list
  width: 90%
  margin: 20px auto
  border-radius: 10px
  box-shadow: 1px 1px 2px 0px rgba(97, 37, 37, 0.567)
  background: #F8C5C5
  @include phone
    width: 100%
.plus
  display: none
  position: fixed
  border-radius: 50%
  bottom: 5px
  right: 5px
  background: #E96D6D
  height: 50px
  width: 50px
  text-align: center
  line-height: 48px
  box-shadow: 2px 2px 3px 1px rgba(97, 37, 37, 0.567)
  // 手機板才顯示
  @include phone
    display: block
  i
    color: white
    font-size: 40px
#plus
  display: none
#app .closeInput
  height: 30px
  display: none 
  text-align: end
  margin: 0
  padding-right: 5px
  // 手機板才顯示
  @include phone
    display: block
</style>
<template lang="pug" >
v-app
  .bar
    v-btn(v-if="!active.home" icon="mdi-home" to="/" @click="changePage('home')")
    v-btn.active(v-else icon="mdi-home" )
    v-btn(v-if="!active.record" icon="mdi-format-list-bulleted-square" to="/list" @click="changePage('record')")
    v-btn.active(v-else icon="mdi-format-list-bulleted-square" )
    v-spacer
    v-btn(v-if="alarm.notify" icon="mdi-bell" @click='alarm.changeNotify')
    v-btn(v-else icon="mdi-bell-off" @click='alarm.changeNotify')
    v-btn(v-if="!active.setting" icon="mdi-dots-vertical" to="/setting" @click="changePage('setting')")
    v-btn.active(v-else icon="mdi-dots-vertical" )
  v-main
    v-container.pa-0(fluid)
      router-view(v-slot="{ Component }")
        keep-alive(include='HomeView')
          component(:is="Component")
</template>



<script setup>
import { reactive } from 'vue'
import { useAlarmStore } from './stores/alarm.js'
const alarm = useAlarmStore()

// 切換頁面時,該頁面欄背景變白色 
const active = reactive({ home: true, record: false, setting: false })
const changePage = page => {
  console.log(page);
  active[page] = true
  for (let p in active) {
    if (page != p) { active[p] = false }
  }
}

</script>

<style lang="sass">
@import '@/styles/mixin/_mixin'
.bar  
  background: #E96D6D
  display: flex
  flex-direction: column
  align-items: center
  padding: 30px 0 5px
  position: fixed
  z-index: 1040
  top: 0
  width: 80px
  bottom: 0
  right: 50% 
  @include phone
    flex-direction: row
    padding: 0 5px 0 5px
    width: 100%
    top: 0
    bottom: auto
    left: 0
  .v-btn
    border-radius: 0
    width: 100%
    background: #E96D6D
    color: white
    box-shadow: none
    margin: 5px 0
    @include phone
      width: 15%
      margin: 0px 3px

#app .active
  background: white
  box-shadow: 1px 2px 2px 0px rgba(97, 37, 37, 0.567)
  color: #E96D6D
  @include phone
    box-shadow: 1px 0px 1px 0px rgba(97, 37, 37, 0.567)

.v-main
  @include phone
    margin-top: 48px
  </style>

<style>
/* #app .active{
    box-shadow: 1px 1px 2px rgba(97, 37, 37, 0.567)
} */
</style>
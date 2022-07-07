<template lang="pug" >
v-app
  v-bar
    v-btn(icon="mdi-home" to="/")
    v-btn(icon="mdi-format-list-bulleted-square" to="/list")
    v-spacer
    v-btn(v-if="alarm.notify" icon="mdi-bell" @click='alarm.changeNotify')
    v-btn(v-else icon="mdi-bell-off" @click='alarm.changeNotify')
    v-btn(icon="mdi-dots-vertical" to="/setting")
  v-main
    v-container(fluid)
      router-view(v-slot="{ Component }")
        keep-alive(include='HomeView')
          component(:is="Component")
</template>

<script setup>
import { useAlarmStore } from './stores/alarm.js'
import { useDataStore } from './stores/data.js'
const alarm = useAlarmStore()
const dataList = useDataStore()
</script>

<style lang="sass">
@import '@/styles/mixin/_mixin'
.v-container
  padding: 0
v-bar  
  display: flex
  flex-direction: column
  align-items: center
  padding: 30px 0 5px
  position: fixed
  background: #0a0
  z-index: 1040
  top: 0
  width: 80px
  bottom: 0
  right: 50% 
  @include phone
    position: sticky
    flex-direction: row
    padding: 0 5px 0 30px
    width: 100%
    top: 0
    bottom: auto
    left: 0
  .v-btn
    margin: 5px 0
    @include phone
      margin: 5px 5px

  

</style>
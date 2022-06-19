<template lang="pug" >
v-app
  v-app-bar(color='teal-darken-4' image='https://picsum.photos/1920/1080?random')
    template(v-slot:image)
    template(v-slot:prepend)
    v-app-bar-title Title
    v-spacer
    v-btn(icon="mdi-home" to="/")
    v-btn(icon="mdi-format-list-bulleted-square" to="/list")
    v-btn(v-if="alarm.notify" icon="mdi-bell" @click='alarm.changeNotify')
    v-btn(v-else icon="mdi-bell-off" @click='alarm.changeNotify')
    v-btn(icon="mdi-content-save" @click='save')
    v-btn(icon="mdi-dots-vertical" to="/setting")
  v-main
    v-container(fluid)
      router-view(v-slot="{Component}")
        keep-alive(include='HomeView')
          component(:is="Component")
</template>

<script setup>
import {useAlarmStore} from './stores/alarm.js'
import {useDataStore} from './stores/data.js'
const alarm = useAlarmStore()
const dataList = useDataStore()
const save = ()=>{
  if(dataList.lists.length>0){
    localStorage.setItem('oldList',JSON.stringify(dataList.lists))
  }
}
</script>

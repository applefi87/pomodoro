<template lang="pug">
| {{ set }}
v-container.px-0(fluid)
  v-radio-group(v-model='set')
    v-radio(v-for='n in alarm.list' :key='n.id' :label='n.name' :value='n.id')
hr
.text-caption Alarm volume
v-slider(v-model='volume' color="green" append-icon='mdi-alarm')
</template>

<script setup>
import { useAlarmStore } from '../stores/alarm.js'
import {storeToRefs} from 'pinia'
import { watch } from 'vue'
const alarm = useAlarmStore()
const {set,volume} = storeToRefs(alarm)
watch(set, () => {
alarm.playAudio()
})

</script>
<template lang="pug">
transition-group(tag="ul" name="list" type="transition-group")
  draggable.list-group(:list="lists" item-key="id" v-bind="dragOptions" @start="drag = true" @end="drag = false" :key='id' )
    template(#item='{ element }' )
      li.list-group-item
        v-icon.mr-4(icon="mdi-drag-horizontal-variant")
        span.title 名稱:
        span.input {{ element.name }}
        span.title 專案:
        span.input {{ element.name }}      
        v-icon.edit(icon="mdi-pencil") 
        v-icon(icon="mdi-content-duplicate") 
</template>

<script setup>
// import 
import { ref, computed } from 'vue'
import { useDataStore } from '../stores/data.js'
import draggable from 'vuedraggable'

const id = ref('6')
const drag = ref(false)
const data = useDataStore()
const { lists } = data
const dragOptions = computed(() => {
  return {
    animation: 200,
    group: "description",
    disabled: false,
    ghostClass: "ghost"
  }
})
</script>

<style lang="sass" scoped>
li
  vertical-align: middle
  margin: 20px 0 0 0
.title
  font-weight: 700
  font-size: 20px
.input
  width: 120px
  display: inline-block
.edit
  margin-right: 80px


  // 移動清單 (下方調速度未完成)

.flip-list-move 
  transition: transform 2s

.no-move 
  transition: transform 2s

.ghost 
  opacity: 0.5
  background: #c8ebfb

.list-group 
  min-height: 20px

.list-group-item 
  cursor: pointer

.list-group-item i 
  
  cursor: move

</style>
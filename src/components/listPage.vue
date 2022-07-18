<template lang="pug">
div
  .header To do
  transition-group(tag="ul" name="list" type="transition-group" :data="data")
    draggable.list-group(:list="lists" item-key="id" v-bind="dragOptions" @start="drag = true" @end="drag = false" :key='id')
      template(#item='{ element }'  )
        li.list-group-item.f
          v-icon.mr-4.drag(icon="mdi-drag-horizontal-variant")
          div.f
            div.fc
              div.inputDiv.f
                span.input(v-if="!element.edit") {{ element.title }}
                div.title.input(v-else) Title:
                  input(type="text" v-model="data.editTitle" @keydown.esc="data.editCancel(element.id)" @keydown.enter="data.editSubmit(element.id)")
              div.inputDiv.f(v-if="element.project.length > 1 || element.edit") 
                span.input(v-if="!element.edit") {{ element.project }}
                div.title.input(v-else) Task:
                  input(type="text" v-model="data.editProject" @keydown.esc="data.editCancel(element.id)" @keydown.enter="data.editSubmit(element.id)")
            div.btns.f(v-if="!element.edit")
              v-icon.edit( icon="mdi-pencil" @click="data.edit(element.id)")
              v-icon(icon="mdi-content-duplicate" @click="data.duplicate(element.id)")
            div.btns.f(v-else)
              v-icon.editing(icon="mdi-check" @click="data.editSubmit(element.id)") 
              v-icon.editing(icon="mdi-cancel" @click="data.editCancel(element.id)") 

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
<style>
.list-group-item * {
  color: #707070
}
</style>
<style lang="sass" scoped>
@import '@/styles/mixin/_mixin'
*
  font-weight: 700
// flex
.f
  display: flex
  align-items: center
.fc
  display: flex
  align-items: center
  flex-direction: column
// 
.header
  top: 0
  height: 50px
  background: #D97E7E
  font-size: 20px
  line-height: 50px
  padding-left: 20px
  color: white
// 
ul
  height: calc(100% - 50px)
.list-group
  height: 100%
  overflow-y: scroll
    // 移除拖拉欄
  /* for Internet Explorer, Edge */
  -ms-overflow-style: none
  /* for Firefox */
  scrollbar-width: none
  &::-webkit-scrollbar 
    display: none
.list-group-item 
  list-style-type: none
  cursor: default
  vertical-align: middle
  margin: 8px 5px 8px 3px
  padding: 3px 0 3px 3px
  &>div
    width: 100%
    justify-content: space-between
.inputDiv
  overflow: hidden
  width: 100%
  max-width: 300px
  margin: 0 0 5px
  @include phone
    max-width: 300px
  .title
    flex-shrink: 0
    font-weight: 700
    font-size: 18px
    @include phone
      font-size: 18px
    input
      width: 75%
      max-width: 300px
      margin-left: 10px
      border-radius: 5px
      background: white
      outline: none

.input
  overflow: hidden
  width: 100%
  display: inline-block
  @include phone
    font-size: 15px
.input.project
  width: 150px

// 
.btns
  flex-direction: row
  i
    @include phone
      font-size: 20px
.btns
  display: inline-block
  width: 65px
  // 移動清單 (下方調速度未完成)

.flip-list-move 
  transition: transform 2s

// 拖拉時的預覽(插件用)
  .ghost 
  opacity: 0.5
  background: #c8ebfb

.list-group 
  min-height: 20px

.list-group-item .drag 
  color: #aaa
  cursor: move
.list-group-item i 
  font-size: 20px
  width: 25px
  height: 25px
  line-height: 25px
  cursor: pointer
  border-radius: 5px
  transition: font-size 0.2s
  &:hover
    font-size: 23px
</style>
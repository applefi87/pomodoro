<template lang="pug">
transition-group(tag="ul" name="list" type="transition-group" :data="data")
  draggable.list-group(:list="lists" item-key="id" v-bind="dragOptions" @start="drag = true" @end="drag = false" :key='id')
    template(#item='{ element }'  )
      li.list-group-item.f
        v-icon.mr-4.drag(icon="mdi-drag-horizontal-variant")
        div.f
          div.fc
            div.inputDiv.f
              span.title 名稱:
              span.input(v-if="!element.edit") {{ element.title }}
              input.input(v-else type="text" v-model="data.editTitle" @keydown.esc="data.editCancel(element.id)" @keydown.enter="data.editSubmit(element.id)")
            div.inputDiv.f(v-if="element.project.length > 1 || element.edit")
              span.title 專案:
              span.input(v-if="!element.edit") {{ element.project }}
              input.input(v-else  type="text" v-model="data.editProject" @keydown.esc="data.editCancel(element.id)" @keydown.enter="data.editSubmit(element.id)")
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
.list-group-item *{
  color: rgb(255, 255, 255)
}
</style>
<style lang="sass" scoped>
@import '@/styles/mixin/_mixin'
// flex
.f
  display: flex
  align-items: center
.fc
  flex-direction: column
// 
.list-group-item 
  list-style-type: none
  cursor: default
  vertical-align: middle
  margin: 5px 3px
  padding: 3px 0 3px 3px
  border:  1px solid rgb(251, 255, 185)
  border-radius: 3px
  &>div
    width: 100%
    justify-content: space-between
.inputDiv
  width: 100%
  max-width: 400px

  .title
    flex-shrink: 0
    font-weight: 700
    font-size: 20px
    @include phone
      font-size: 18px

.input
  margin:0 10px
  width: 100%
  display: inline-block
  @include phone
    font-size: 15px

.btns
  flex-direction: row
  i
    @include phone
      font-size: 20px

input.input
  border:1px white solid
  border-radius: 5px
.input.project
  width: 150px
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
  cursor: move
.list-group-item i 
  width:30px
  cursor: pointer
  border-radius: 5px
  line-height: 30px
  &:hover
    background: #ddd
    font-size: 27px
</style>
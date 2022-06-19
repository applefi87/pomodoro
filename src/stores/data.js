import { defineStore } from 'pinia'


export const useDataStore = defineStore('data',{
  state: () => ({
      lists:[{ id: 1, name: '製作表單', project: "Vue", totalTime: 0, distractTime: 0, },{ id: 2, name: '製作表單2', project: "Vue", totalTime: 0, distractTime: 0, },{ id: 3, name: '製作表單3', project: "Vue", totalTime: 0, distractTime: 0, },{ id: 4, name: '其他', project: "Vue", totalTime: 0, distractTime: 0 }],
      endLists:[],
      restLists:[{ id: -1, name: '小休息', project: "", totalTime: 0, distractTime: 0, },{ id: -2, name: '大休息', project: "", totalTime: 0, distractTime: 0, },{ id: -3, name: '結束', project: "", totalTime: 0, distractTime: 0, }],
      id:4
    }),
    actions:{
      addlist(name,project){
        this.lists.push(
          {id:this.id++,name,project,totalTime:0,distractTime:0,}
        )
      }
    }
})
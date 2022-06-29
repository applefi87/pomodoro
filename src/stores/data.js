import { defineStore } from 'pinia'


export const useDataStore = defineStore('data', {
  state: () => ({
    lists: [],
    endLists: [],
    restLists: [{ id: -1, title: '小休息', project: "", totalTime: 0, distractTime: 0, startTime:0 }, { id: -2, title: '大休息', project: "", totalTime: 0, distractTime: 0, startTime:0 }, { id: -3, title: '結束', project: "", totalTime: 0, distractTime: 0, startTime:0 }],
    id: 4,
    editTitle: '',
    editProject: ''
  }),
  
  actions: {
    addlist(title, project) {
      this.lists.push(
        { id: this.id++, title, project, edit: false, totalTime: 0, distractTime: 0, startTime:0 }
      )
    },
    findIdx(id) {
      return this.lists.findIndex((it) => { return it.id == id })
    },
    edit(id) {
      this.editCancel()
      const idx = this.findIdx(id)
      this.editTitle = this.lists[idx].title
      this.editProject = this.lists[idx].project
      this.lists[idx].edit = true
    },
    editSubmit(id) {
      const idx = this.findIdx(id)
      this.lists[idx].title = this.editTitle
      this.lists[idx].project = this.editProject
      this.lists[idx].edit = false
    },
    editCancel(id) {
      if (id) {
        const idx = this.findIdx(id)
        this.lists[idx].edit = false
      } else {
        this.lists = this.lists.map(it => {it.edit = false;return it})
      }
    },
    timeFormated(n){
      return Math.floor(n / 60).toString().padStart(2, '0') + ':' + (n % 60).toString().padStart(2, '0')
    }
  },
  persist: {
    key: 'pomotoro-setting'
  }
})
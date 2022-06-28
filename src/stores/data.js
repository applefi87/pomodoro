import { defineStore } from 'pinia'


export const useDataStore = defineStore('data', {
  state: () => ({
    lists: [{ id: 1, title: '製作表單', project: "Vue", edit: false, totalTime: 0, distractTime: 0, }, { id: 2, title: '製作表單2', project: "Vue", edit: false, totalTime: 0, distractTime: 0, }, { id: 3, title: '製作表單3', project: "Vue", edit: false, totalTime: 0, distractTime: 0, }, { id: 4, title: '其他', project: "Vue", edit: false, totalTime: 0, distractTime: 0 }],
    endLists: [],
    restLists: [{ id: -1, title: '小休息', project: "", totalTime: 0, distractTime: 0, }, { id: -2, title: '大休息', project: "", totalTime: 0, distractTime: 0, }, { id: -3, title: '結束', project: "", totalTime: 0, distractTime: 0, }],
    id: 4,
    editTitle: '',
    editProject: ''
  }),
  actions: {
    addlist(title, project) {
      this.lists.push(
        { id: this.id++, title, project, edit: false, totalTime: 0, distractTime: 0, }
      )
    },
    edit(id) {
      const idx = this.lists.findIndex((it) => {return it.id == id })
      this.editTitle = this.lists[idx].title
      this.editProject = this.lists[idx].project
      this.lists[idx].edit = true
    },
    editSubmit(id) {
      const idx = this.lists.findIndex((it) => {return it.id == id })
      this.lists[idx].title = this.editTitle
      this.lists[idx].project = this.editProject
      this.lists[idx].edit = false
    }

  },
  persist: {
    key: 'pomotoro-setting',
    paths: ['lists']
  },
})
import { defineStore } from 'pinia'

export const useAlarmStore = defineStore('alarm', {
  state: () => ({
    set: 1,
    volume: 2,
    notify: false,
    list: [{ id: 1, name: "鈴聲", url: new URL('../assets/alarm.mp3', import.meta.url).href }, { id: 2, name: "歡呼", url: new URL('../assets/yay.mp3', import.meta.url).href }, { id: 3, name: "逼逼逼", url: new URL('../assets/bibibi.mp3', import.meta.url).href }, { id: 4, name: "自然", url: new URL('../assets/nature.mp3', import.meta.url).href }]
  }),
  actions: {
    playAudio(input = this.set) {
      const audio = new Audio()
      audio.src = this.list[this.list.findIndex(it => it.id === input)].url
      audio.volume = this.volume / 100
      audio.play()
    },
    changeNotify() {
      if (!this.notify && 'Notification' in window) {
        Notification.requestPermission(p => {
          if (p === 'granted') {
            this.notify = true
          }
        })
      } else {
        this.notify = false
      }
    }
  },
  persist: {
    key: 'pomotoro-setting',
  },
})
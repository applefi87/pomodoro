import { defineStore } from 'pinia'

export const useAlarmStore = defineStore('alarm',{
  state: () => ({
      set: 1,
      volume: 20,
      list: [{ id: 1, name: "鈴聲", url: new URL('../assets/alarm.mp3', import.meta.url).href }, { id: 2, name: "其他", url: new URL('../assets/yay.mp3', import.meta.url).href }]
    }),
    actions:{
      playVideo(){
        const audio = new Audio()
        audio.src = this.list[this.set - 1].url
        audio.volume = this.volume / 100
        audio.play()
      }
    }
})
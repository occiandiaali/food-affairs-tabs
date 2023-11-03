import {defineStore} from 'pinia'
import {ref} from 'vue'

export const useWeekStatStore = defineStore('weekStats', {
    state: () => ({
        weekDayTotalArray: ref([0, 0, 0, 0, 0, 0])
    }),
    actions: {
        
    }
})
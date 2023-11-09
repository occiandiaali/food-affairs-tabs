<template>
  <ion-page>
    <ion-content :fullscreen="true" class="ion-padding">
      <ion-chip>
    <ion-avatar>
      <img alt="Silhouette of a person's head" src="https://ionicframework.com/docs/img/demos/avatar.svg" />
    </ion-avatar>
    <ion-label>@admin3000</ion-label>
  </ion-chip>
      <div id="loadingWkDiv" v-if="loadingWeekChart">
        <h2>Loading..</h2>
        <p>Trying to fetch current week summary...</p>
        <span id="no-data-grey">(If this takes long, there may be no data to show)</span>
      </div>
      <div class="week-div" v-else>
        <div class="section-header">
          <ion-label>Week Summary</ion-label>
        </div>
        <p id="week-range-row">
          {{ getWeekRange(d).from.toDateString() }} - 
          {{ getWeekRange(d).to.toDateString() }}
        </p>
        
        <Bar :data="weeklySalesData" :options="chartOptions" />
      </div>

      <div class="month-div">
        <div class="section-header">
          <ion-label>Months Summary</ion-label>
        </div>
        <Bar :data="monthlySalesData" :options="chartOptions" />
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue'
import { IonAvatar, IonChip, IonPage, IonLabel, IonContent } from '@ionic/vue';

import {Bar} from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

import {deleteDoc, deleteField, doc, DocumentData, getDoc, updateDoc} from 'firebase/firestore'
import db from './../firebase/init.js'

import {getWeekRange} from './../utils/weekRange'

const daysOfTheWeek = ["Mon", "Tues", "Wed", "Thur", "Fri", "Sat"];

const d = new Date();
const loadingWeekChart = ref(true)
const weekSummary: number[] = []

const weeklySalesData = {
  labels: daysOfTheWeek,
  datasets: [
    {
      label: "Weekly Sales Summary",
      data: weekSummary, //[600, 250, 150, 300, 100, 130],
      backgroundColor: [
        "rgba(255, 205, 86, 0.8)",
        "rgba(75, 192, 192, 0.8)",
        "rgba(54, 162, 235, 0.8)",
        "rgba(153, 102, 255, 0.8)",
        "rgba(201, 203, 207, 0.8)",
        "rgba(75, 192, 192, 0.8)",
      ],
    },
  ],
};

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const monthlySalesData = {
  labels: months,
  datasets: [
    {
      label: "Monthly Summary",
      data: [
        1400, 1250, 1050, 3000, 1000, 1400, 1250, 1050, 3000, 1000, 2500, 6000,
      ],
      backgroundColor: [
        "rgba(255, 99, 132, 0.2)",
        "rgba(255, 159, 64, 0.2)",
        "rgba(255, 205, 86, 0.2)",
        "rgba(75, 192, 192, 0.2)",
        "rgba(54, 162, 235, 0.2)",
        "rgba(153, 102, 255, 0.2)",
        "rgba(201, 203, 207, 0.2)",
        "rgba(255, 99, 132, 0.2)",
        "rgba(255, 159, 64, 0.2)",
        "rgba(255, 205, 86, 0.2)",
        "rgba(75, 192, 192, 0.2)",
        "rgba(54, 162, 235, 0.2)",
      ],
    },
  ],
};

const chartOptions = {
  responsive: true,
};

onMounted(() => {
  const start = getWeekRange(d).from.toDateString()
  const end = getWeekRange(d).to.toDateString()
  const today = new Date().toDateString()
  const isValid = today.substring(4) >= start.substring(4) && today.substring(4) <= end.substring(4)

  const wkArrRef = doc(db, 'week-stats', "WDT")
  if (isValid) {
    // today's date is within the week range - Proceed to fetch
    getDoc(wkArrRef).then((res) => {
    if (res.exists()) {
      console.log('res.data', res.data())
      console.log(`
      Start: ${start}
      End: ${end}
      Today: ${today}
      Validity: ${today.substring(4) >= start.substring(4) && today.substring(4) <= end.substring(4)}
      `)
      const temp = res.data().wkArr
      for (let t in temp) {
        weekSummary[+t] = temp[+t]
      }
      console.log('WeekSummary: ', weekSummary)
      loadingWeekChart.value = false
    } else {
      console.log('No res.data? ', res.data())
      
    }
  }).catch(e => console.log('Does doc even exist? ', e))
  } else {
    // It's a new week - delete week summary doc
    deleteDoc(wkArrRef).then(() => console.log('It is a new week, so old summary data has been deleted!')).catch(e => console.log('Could not delete stale data..', e))
  }
})

</script>

<style scoped>

#loadingWkDiv {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 25%;
}

#no-data-grey {
  color: rgb(150, 146, 146);
  padding: 12px;
  text-wrap: wrap;
}
.section-header {
  display: flex;
  flex-direction: row;
}

.week-div {
  display: flex;
  flex-direction: column;
  margin-top: 28%;
}

.month-div {
  margin-top: 25%;
}

#week-range-row {
  font-size: 12px;
  color: grey;
}
</style>

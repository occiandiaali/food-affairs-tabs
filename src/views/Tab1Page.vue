<template>
  <ion-page>
    <!-- <ion-header>
      <ion-toolbar>
        <ion-title>Tab 1</ion-title>
      </ion-toolbar>
    </ion-header> -->
    <ion-content :fullscreen="true" class="ion-padding">
      <!-- <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Tab 1</ion-title>
        </ion-toolbar>
      </ion-header> -->
      <ion-chip>
    <ion-avatar>
      <img alt="Silhouette of a person's head" src="https://ionicframework.com/docs/img/demos/avatar.svg" />
    </ion-avatar>
    <ion-label>@admin3000</ion-label>
  </ion-chip>

      <!-- <ExploreContainer name="Tab 1 page" /> -->
      <div class="week-div">
        <div class="section-header">
          <ion-label>Week Summary</ion-label>
        </div>
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
import { IonAvatar, IonChip, IonPage, IonHeader, IonIcon, IonLabel, IonToolbar, IonTitle, IonContent } from '@ionic/vue';
import {close, closeCircle} from 'ionicons/icons'
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

//import ExploreContainer from '@/components/ExploreContainer.vue';

const daysOfTheWeek = ["Mon", "Tues", "Wed", "Thur", "Fri", "Sat"];
const weekDayNames = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const d = new Date();

const weeklySalesData = {
  labels: daysOfTheWeek,
  datasets: [
    {
      label: "Weekly Sales Summary",
      data: [600, 250, 150, 300, 100, 130],
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
</script>

<style scoped>
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
</style>

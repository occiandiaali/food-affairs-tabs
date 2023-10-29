<template>
  <ion-page>
    <!-- <ion-header>
      <ion-toolbar>
        <ion-title>Tab 2</ion-title>
      </ion-toolbar>
    </ion-header> -->
    <ion-content :fullscreen="true" class="ion-padding">
      <!-- <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Tab 2</ion-title>
        </ion-toolbar>
      </ion-header> -->
      <div class="section-div">
        <h2>Record new sale</h2>
        <div>Lorem ipsum dolor sit, am qui enim dolorum.</div>
        <ion-item id="radio-item">
          <ion-label>Paid</ion-label>
            <div id="radio-buttons-div">
              <input
                type="radio"
                id="cash"
                value="cash"
                v-model="paymentType"
              />
              <label for="cash" class="radio-label">Cash</label>
              <input
                type="radio"
                id="transfer"
                value="transfer"
                v-model="paymentType"
              />
              <label for="transfer" class="radio-label">Transfer</label>
            </div>
          </ion-item>
          <div id="payment-total-div">
            <p>Payment: {{ paymentType }}</p>
            <p>Total: {{ orderTotal }}</p>
          </div>
          <ion-item v-if="paymentType === 'transfer'">
            <ion-input
              id="transfer-details"
              placeholder="Enter details of transfer payment"
              v-model="transferDetails"
            ></ion-input>
          </ion-item>
          <div class="save-div">
            <ion-button shape="round" :disabled="paymentType === '---'">Save</ion-button>
          </div>
          <ion-searchbar
          show-clear-button="focus"
          v-model="filterTerm"
          placeholder="Search"
        ></ion-searchbar>
      </div>
      <div class="section-div">
        <ion-list>
          <div class="menu-item" v-for="(p, i) in data" :key="i">
            <ion-label>{{ p.title}}</ion-label>
            <span>{{ p.price }}</span>
          </div>
        </ion-list>
      </div>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonInput,
  IonLabel,
  IonList,
  IonMenuButton,
  IonPage,
  IonSearchbar,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonToolbar,
} from "@ionic/vue";

const paymentType = ref("---")
const transferDetails = ref("")
const orderTotal = ref(0)
const filterTerm = ref("")

const data = [
{
        "title": "Egg",
        "price": "150",
        "portion": "1"
      },
      {
        "title": "Ogbono",
        "price": "800",
        "portion": "1"
      },
      {
        "title": "Eba",
        "price": "100",
        "portion": "1"
      },
      {
        "title": "Semovita",
        "price": "100",
        "portion": "1"
      },
      {
        "title": "Spaghetti",
        "price": "200",
        "portion": "1"
      },
]
</script>

<style scoped>
#payment-total-div {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  padding: 8px;
}

.radio-label {
  padding-left: 12px;
  padding-right: 12px;
}

#radio-item {
  display: flex;
  flex-direction: row;
}
</style>

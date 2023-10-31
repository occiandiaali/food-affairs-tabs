<template>
        <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button color="medium" @click="cancel">Cancel</ion-button>
        </ion-buttons>
        <ion-title>History</ion-title>
        <ion-buttons slot="end">
          <ion-button :strong="true" @click="deleteAll">Clear All</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
        <div v-if="loadingRecords" class="content-div">Loading...</div>
        <div v-if="filteredItems.length" id="records-list-div">
            <ion-searchbar
            v-model="filterTerm"
            show-clear-button="focus"
            placeholder="Search.."
          ></ion-searchbar>
          <ion-list v-for="(item, i) in filteredItems" :key="i">
            <ion-item-group>
              <ion-item-divider>
                <ion-icon
                  :icon="closeOutline"
                  id="delete-icon"
                  @click="deleteEntry()"
                ></ion-icon>
                <ion-label>Sale on {{ new Date().getDate() }}</ion-label>
                <ion-checkbox
                  slot="end"
                  :key="i"
                  @ion-change="
                    printReceipt()
                  "
                ></ion-checkbox>
              </ion-item-divider>
              <div class="order-div">
                <ion-item>
                  <ion-text>{{ item.title }}</ion-text>
                </ion-item>
                <!-- <ion-item v-if="item.customer?.length">
                  <ion-label>Customer: {{ item.customer }}</ion-label>
                </ion-item> -->
                <ion-item>
                  <ion-label>Total: NGN {{ item.price }}</ion-label>
                </ion-item>
<!-- 
                <ion-item v-if="item.payment === 'cash'">
                  <ion-label> Paid: {{ item.payment }} </ion-label>
                </ion-item>
                <ion-item v-else>
                  <ion-label id="transfer-block">
                    Transfer: {{ item.transferDetails }}
                    <p>
                      Confirmation:
                      <span id="conf">{{
                        item.transferConfirmed ? "confirmed" : "pending.."
                      }}</span>
                    </p>
                  </ion-label>
                  <ion-button
                    fill="outline"
                    @click="confirmTransaction(item.transferDetails)"
                    :disabled="item.transferConfirmed"
                    >{{ !item.transferConfirmed ? 'Confirm' : 'Done' }}</ion-button
                  >
                </ion-item> -->
              </div>
            </ion-item-group>
            <ion-item-divider></ion-item-divider>
          </ion-list>
        </div>
        <div v-else class="content-div">
            <h3>No records to show...</h3>
            <img src="./../assets/images/logo.jpg" alt="food affairs logo" id="img-placeholder">
        </div>
    </ion-content>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import {
  IonButton,
  IonButtons,
  IonCheckbox,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonItemDivider,
  IonItemGroup,
  IonLabel,
  IonList,
  IonMenuButton,
  IonPage,
  IonSearchbar,
  IonText,
  IonTitle,
  IonToolbar,
  modalController
} from "@ionic/vue";
import { closeOutline } from "ionicons/icons";

import dummydata from './../assets/dummy-menu.json'

const loadingRecords = ref(true)
const orders: any[] = []
//const resultRef: any[] = []
const sortedMenu = dummydata.products.sort((a, b) => {
 let lowerTitA = a.title.toLowerCase(),
lowerTitB = b.title.toLowerCase()

if (lowerTitA < lowerTitB) {
  return -1
}
if (lowerTitA > lowerTitB) {
  return 1
}
return 0
})
const filterTerm = ref("")
const filteredItems = computed(() => {
  return sortedMenu.filter((item) => {
    return (
      item.title.toLowerCase().indexOf(filterTerm.value.toLowerCase()) != -1
    )
  })
})
const cancel = () => modalController.dismiss(null, 'cancel');
//const confirm = () => modalController.dismiss(name.value, 'confirm');
const deleteAll = () => alert("You want to delete the entire menu?")
const confirmTransaction = () => {}
const deleteEntry = () => {}
const printReceipt = () => {}

onMounted(() => {
    setTimeout(() => {
        loadingRecords.value = false
    }, 5000);
})
</script>

<style scoped>
.content-div {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

#img-placeholder {
  width: 250px;
  height: 250px;
  border-radius: 100%;
}

#records-list-div {
    overflow-y: auto;
}
</style>
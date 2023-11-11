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
        <div v-if="resultRef.length" id="records-list-div">
            <ion-searchbar
            v-model="filterTerm"
            show-clear-button="focus"
            placeholder="Search.."
          ></ion-searchbar>
          <ion-list v-for="(item, i) in resultRef.filter((item) => {
    return (
      item.date.indexOf(filterTerm) != -1
    )
  })" :key="i">
            <ion-item-group>
              <ion-item-divider>
                <ion-icon
                  :icon="closeOutline"
                  id="delete-icon"
                  @click="deleteEntry()"
                ></ion-icon>
                <ion-label>Sale on {{ item.date }}</ion-label>
                <ion-checkbox
                  slot="end"
                  :key="i"
                  @ion-change="
                    printReceipt(
                        item.date,
                      JSON.stringify(item.items),
                      item.total,
                      item.customer
                    )
                  "
                ></ion-checkbox>
              </ion-item-divider>
              <div class="order-div">
                <!-- <ion-item>
                  <ion-text>{{ item.items }}</ion-text>
                </ion-item> -->
                <div id="order-items-div">
                  <ion-list>
                    <ion-item v-for="it in item.items">
                      <ion-text>{{it.portion}} portion(s) of</ion-text>
                  <ion-text>{{ it.title }} @ {{ ' ' }}</ion-text>
              <ion-text>NGN {{ it.unit }}</ion-text>
                </ion-item>
                  </ion-list>
                </div>

                <ion-item v-if="item.customer?.length">
                  <ion-label>Customer: {{ item.customer }}</ion-label>
                </ion-item>
                <ion-item>
                  <ion-label>Total: NGN {{ item.total }}</ion-label>
                </ion-item>

                <ion-item v-if="item.payment === 'cash' || item.payment === 'POS'">
                  <ion-label> Paid: {{ item.payment }} </ion-label>
                </ion-item>
                <ion-item v-else>
                  <ion-label id="transfer-block">
                    Transfer: {{ item.transferDetails }}
                    <p>
                      Confirmation:
                      <span id="conf">{{
                        item.transferConfirmed || confirmed ? "confirmed" : "pending.."
                      }}</span>
                    </p>
                  </ion-label>

                  <div v-if="!processingTransfer">
                    <ion-button
                    fill="outline"
                    @click="confirmTransaction(item.transferDetails)"
                    :disabled="item.transferConfirmed || confirmed"
                    >
                    {{  !item.transferConfirmed || !confirmed ? 'Confirm' : 'Done' }}</ion-button
                  >
                  </div>
                  <div v-else>
                    <p>Please wait...</p>
                  </div>
                </ion-item>
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
import {
  query,
  collection,
  getDocs,
  doc,
  updateDoc,
  where,
  DocumentData,
  orderBy
} from "firebase/firestore";
import db from './../firebase/init.js'
import {usePDF} from 'vue3-pdfmake'

const pdfmake = usePDF()
const loadingRecords = ref(true)
const orders: DocumentData[] = []
const resultRef = ref<DocumentData[]>([])
const processingTransfer = ref(false)
// const sortedMenu = resultRef.value.sort((a, b) => {
//  let lowerTitA = a.title.toLowerCase(),
// lowerTitB = b.title.toLowerCase()

// if (lowerTitA < lowerTitB) {
//   return -1
// }
// if (lowerTitA > lowerTitB) {
//   return 1
// }
// return 0
// })
// const filterTerm = ref("")
// const filteredItems = computed(() => {
//   return sortedMenu.filter((item) => {
//     return (
//       item.title.toLowerCase().indexOf(filterTerm.value.toLowerCase()) != -1
//     )
//   })
// })
const ordered = resultRef.value.sort((a, b) => {
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
  return ordered.filter((item) => {
    return (
      item.date.indexOf(filterTerm.value) != -1
    )
  })
})
const cancel = () => modalController.dismiss(null, 'cancel');
//const confirm = () => modalController.dismiss(name.value, 'confirm');
const deleteAll = () => alert("You want to delete the entire menu?")

const confirmed = ref(false)
const confirmTransaction = async (details: string) => {
  const q = query(
    collection(db, "orders"),
    where("transferDetails", "==", details)
    );
    const qSnap = await getDocs(q);
    qSnap.forEach((doc) => {
      console.log("B4: ", doc.data());
      updateDoc(doc.ref, {
        transferConfirmed: true,
      });
      processingTransfer.value = true
    //  console.log(doc.id, " => ", doc.data())
    console.log("After: ", doc.data());
  });
  processingTransfer.value = false;
  confirmed.value = true;
}

const deleteEntry = () => {}
const printReceipt = (date: any, items: any, amt: any, client: any) => {
    if (
    confirm(`
  Print out:
  Date: ${date}
  Order: ${items}
  Total: ${amt}
  Customer: ${client}
  `)
  ) {
    pdfmake
      .createPdf({
        content: [
          `
          <h1>Food Affairs</h1>
          <h2>Invoice</h2>
          <ul>
      <li>Date: ${date}</li>
      <li>Order: ${items}</li>
      <li>Total: ${amt}</li>
      <li>Customer: ${client}</li>
  </ul>
      `,
        ],
      })
      .download();
  }
}

const getOrders = async () => {
    //const querySnap = await getDocs(collection(db, "orders"))
    const querySnap = await getDocs(query(collection(db, "orders"), orderBy('date')))
    querySnap.forEach((doc) => {
        console.log("doc: ", JSON.stringify(doc.data()))
        orders.push(doc.data())
        loadingRecords.value = false;
    })
    return orders.reverse();
}

onMounted(async () => {
    try {
        const result = await getOrders()
      //  console.log('Fetched orders: ', JSON.stringify(result))
        resultRef.value = result
    } catch (error) {
        console.log('Error fetching orders...', error)
    }
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

ion-text {
  padding-right: 8px;
}

#orders {
  text-wrap: wrap;
  padding: 6px;
}

.order-div {
  display: flex;
  flex-direction: column;
}

#order-items-div {
display: flex;
flex-direction: column;
justify-content: space-evenly;
border: 1px solid rgb(189, 150, 189);
border-radius: 8px;
margin: 4px;
padding: 4px;
}

#records-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

#transfer-block {
  display: flex;
  flex-direction: column;
}

#records-list-div {
    overflow-y: auto;
}
</style>
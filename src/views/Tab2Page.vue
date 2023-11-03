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
        <!-- <h2>Record new sale</h2> -->
        <div class="order-items-div">
          <ion-list class="order-items-div-list" v-if="order.length">
 
            <ion-item class="order-item" v-for="(item, i) in order" :key="i">
              <ion-text>{{ item.title }}</ion-text>
              <ion-text>{{item.portion}} portions</ion-text>
              <ion-text>NGN {{ item.unit }}</ion-text>
            </ion-item>
          </ion-list>
          <div v-else>
            <ion-item class="order-item">
              <ion-label>What was sold shows here...</ion-label>
            </ion-item>
          </div>
        </div>
        <ion-item id="radio-item">
          <!-- <ion-label>Paid</ion-label> -->
            <div id="radio-buttons-div">
              <label for="cash" class="radio-label">Cash</label>
              <input
                type="radio"
                id="cash"
                value="cash"
                v-model="paymentType"
              />
              <label for="transfer" class="radio-label">Transfer</label>
              <input
                type="radio"
                id="transfer"
                value="transfer"
                v-model="paymentType"
              />
              <label for="pos" class="radio-label">POS</label>
              <input
                type="radio"
                id="POS"
                value="POS"
                v-model="paymentType"
              />
            </div>
          </ion-item>
          <div id="payment-total-div">
            <p>Payment: {{ paymentType }}</p>
            <p>Total: {{ totalMsg }}</p>
          </div>
          <div v-if="paymentType === 'transfer'">
          <ion-item>
            <ion-input
              id="transfer-details"
              placeholder="Enter details of transfer payment"
              v-model="transferDetails"
            ></ion-input>
          </ion-item>
          <a href="sms:+2348033487558?body=You%20have%20a%20new%20transfer%20payment" id="sms-tag">SMS will be sent to admin</a>
        </div>
          <ion-item>
            <ion-input
              id="customer-contact"
              label="Customer contact"
              type="tel"
              placeholder="888-888-8888"
              v-model="customerPhone"
            ></ion-input>
          </ion-item>
          <div class="save-div">
            <ion-button shape="round" :disabled="(!transferDetails || paymentType === '--') && !order.length" @click="saveOrderEntry">{{ savingEntry ? "Wait.." : "Save" }}</ion-button>
            <!-- <ion-button shape="round" :disabled="(!transferDetails || paymentType === '--') && !order.length" @click="showTotal">Total</ion-button> -->
            <div v-if="paymentType !== '--' || transferDetails.length || order.length">
            <ion-icon @click="orderClear" :icon="trashOutline" color="danger"></ion-icon>
          </div>
          </div>
          <!-- <ion-searchbar
          show-clear-button="focus"
          v-model="filterTerm"
          placeholder="Search"
        ></ion-searchbar> -->
      </div>
      <div class="menu-section-div" v-if="resultRef.length">
        <ion-list>
          <div class="menu-item" v-for="(p, i) in resultRef" :key="i">
            <div id="item-price-col">
              <ion-label id="item-label">{{ p.title}}</ion-label>
            <span id="unit-cost">NGN {{ p.price }}</span>
            </div>
            <ion-list>
              <ion-item>
                <label>qty <input :name="p.title" style="width: 100px; margin-top: 6px;" type="number" placeholder="portion" v-model="p.portions" /></label>
              </ion-item>
            </ion-list>
            <input
              type="checkbox"
              aria-label="menu item"
              :id="i.toString()"
              @change="menuItemCheckAction($event, p.price, p.title, p.portions)"
            />
          </div>
        </ion-list>
      </div>
      <div v-else id="no-internet-div">
        <h2>Internet connection issue..</h2>
        <span id="internet-out-advice">Make sure you're connected, then refresh this page</span>
        <ion-icon :icon="wifiOutline" color="danger" id="internet-out-icon"></ion-icon>
      </div>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { computed, ComputedRef, onMounted, ref } from "vue";
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
  IonText,
  IonTextarea,
  IonToolbar,
} from "@ionic/vue";
import { globeOutline, trashOutline, wifiOutline } from "ionicons/icons";
//import dummydata from './../assets/dummy-menu.json'
import { addDoc, collection, doc, DocumentData, getDoc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import db from "./../firebase/init.js";
import {useWeekStatStore} from './../stores/weekStatStore'

const store = useWeekStatStore()
const today = new Date().getDay()

const paymentType = ref("--")
const transferDetails = ref("")
const customerPhone = ref('')
const orderTotalArray: number[] = []
const orderTotal = ref(0)
const totalMsg = computed(() => orderTotal.value)
const dailyTotal = ref(0)

const tempArr: DocumentData[] = [];
const resultRef = ref<DocumentData[]>([])
//let sortedMenu: DocumentData[] = [];
const loadingFromFirestore = ref(true)
let savingEntry = ref(false)
let weekTotalsArr = [0, 0, 0, 0, 0, 0]


// sortedMenu = resultRef.value.sort((a, b) => {
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

const order = ref<{
  title: string,
  unit: string,
  portion: string
}[]>([])

const orderClear = () => {
  orderTotal.value = 0
  paymentType.value = '--'
  transferDetails.value = ""
  customerPhone.value = ""
  order.value = []
 // location.reload()
}

const checkedItem = (price: string, title: string, portion: string) => {
 // const total: number = +portion * +price 
 const itemAmt = (+portion * +price)
 orderTotalArray.push(itemAmt )
  orderTotal.value = orderTotalArray.reduce((acc, curr) => {
    return acc + curr
  }, 0)
  order.value.push({title, unit: price, portion})
}
const uncheckedItem = (price: string, title: string, portion: string) => {
  orderTotal.value -= +portion * +price
 orderTotalArray.splice(orderTotalArray.indexOf(+portion * +price), 1)
 orderTotal.value = orderTotalArray.reduce((acc, curr) => {
    return acc + curr
  }, 0)
  order.value.splice(
    order.value.findIndex((v) => v.title === title), 1
  )
}

const goodToGo = ref(false)
const portionInput = (ev: any) => {
  if (ev.target.value) {
    goodToGo.value = true
  } 
  goodToGo.value = false
}



const menuItemCheckAction = (event: any, price: string, title: string, portion: string) => {
  if (event.target.checked) {
    checkedItem(price, title, portion)
    console.log(`Checked ${portion} portion(s) of ${title}`)
  } else {
    uncheckedItem(price, title, portion)
    console.log(`Unchecked ${portion} portion(s) of ${title}`)
  }
}

// const showTotal = () => {
//   totalSumSet.value = !totalSumSet.value
//  return totalMsg.value = computed(() => orderTotal.value)
//   // = 
// }

const saveOrderEntry = async () => {
  savingEntry.value = true;
  
  const recordRef = collection(db, "orders")
  const weekStatsRef = collection(db, 'week-stats')

  // create new data as obj to send to firestore
  const dataObj = {
    date: new Date().toLocaleString(),
    items: order.value,
    payment: paymentType.value,
    total: orderTotal.value,
    customer: customerPhone.value,
    transferDetails: transferDetails.value ?? null,
    transferConfirmed: false,
  }

  
  const sum = dataObj.total
  dailyTotal.value += sum;
  weekTotalsArr[today - 1] += dailyTotal.value
  console.log('Created week totals', weekTotalsArr)
  const statObj = {
    wkArr: weekTotalsArr
  }

  await addDoc(recordRef, dataObj)
  await setDoc(doc(db, 'week-stats', "WDT"), statObj)
  
  

  savingEntry.value = false
  console.log(`
  Entry: Total: ${totalMsg.value}
  Order: ${JSON.stringify(dataObj)}
  Paid via: ${paymentType.value}
  Customer: ${customerPhone.value}
  `)
  orderClear()
  document.getElementById("sms-tag")?.click()// [TODO]: Uncomment to send sms notification
 // location.reload()
}

const getMenuFromFirestore = async () => {
  const querySnap = await getDocs(collection(db, "menu"));
  querySnap.forEach((doc) => {
  //  console.log("doc: ", JSON.stringify(doc.data()))
    tempArr.push(doc.data());
    loadingFromFirestore.value = false;
  });
  return tempArr;
}

const wkArrRef = doc(db, 'week-stats', "WDT")



onMounted(async () => {
  try {
   const res = await getMenuFromFirestore();

  resultRef.value = res.sort((a, b) => {
 let lowerTitA = a.title.toLowerCase(),
lowerTitB = b.title.toLowerCase()

if (lowerTitA < lowerTitB) {
  return -1
}
if (lowerTitA > lowerTitB) {
  return 1
}
return 0
});

const wkSnap = await getDoc(wkArrRef)
if (wkSnap.exists()) {
  weekTotalsArr = wkSnap.data().wkArr
}

 } catch (error) {
  console.log(e => console.log('Error fetching..', e))
 }
})
</script>

<style scoped>
#internet-out-advice {
  color: grey;
  text-wrap: wrap;
}

#internet-out-icon {
  font-size: 150px;
}

ion-text {
  margin-left: 4px;
}

#item-label {
  font-size: 18px;
  font-weight: bold;

}

#item-price-col {
  display: flex;
  flex-direction: column;
}

.menu-item {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  height: 68px;
  border: 1px solid rgb(77, 71, 83);
  border-left: 3px solid rgb(150, 40, 150);
  border-radius: 6px;
  padding: 6px;
  margin: 4px 0px 8px 0px;
}

.menu-section-div {
  width: 90vw;
  max-height: 350px;
  /* border: 1px solid rgb(221, 185, 185); */
  
  margin-top: 6px;
  padding: 4px;
  overflow-y: auto;
}

#no-internet-div {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-top: 10%;
  padding-left: 5%;
  padding-right: 5%;
}

.order-item {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  border: 1px solid rgb(189, 185, 185);
  border-radius: 6px;
  margin: 2px 0px 4px 0px;
}
.order-items-div {
  width: 90vw;
  max-height: 180px;
  /* border: 1px solid rgb(235, 150, 150); */
  padding: 6px;
}

.order-items-div-list {
  max-height: 120px;
  overflow-y: auto;
}

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
  justify-content: space-evenly;
}

.save-div {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
  margin: 6px;
}

#sms-tag {
  color: grey;
  margin-left: 25%;
  font-size: small;
  text-decoration: none;
}

#transfer-info-sms {
  color: grey;
}

#unit-cost {
  color: grey;
}
</style>

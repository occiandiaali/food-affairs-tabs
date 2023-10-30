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
            <!-- <ion-item class="order-item">
              <ion-text>Egg roll</ion-text>
              <ion-text>2 portions</ion-text>
              <ion-text>300 NGN</ion-text>
            </ion-item>
            <ion-item class="order-item">
              <ion-text>Ogbono</ion-text>
              <ion-text>1 portion(s)</ion-text>
              <ion-text>800 NGN</ion-text>
            </ion-item>
            <ion-item class="order-item">
              <ion-text>Egg roll</ion-text>
              <ion-text>2 portions</ion-text>
              <ion-text>300 NGN</ion-text>
            </ion-item>
            <ion-item class="order-item">
              <ion-text>Ogbono</ion-text>
              <ion-text>1 portion(s)</ion-text>
              <ion-text>800 NGN</ion-text>
            </ion-item> -->
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
            <p>Total: {{ totalMsg }}</p>
          </div>
          <ion-item v-if="paymentType === 'transfer'">
            <ion-input
              id="transfer-details"
              placeholder="Enter details of transfer payment"
              v-model="transferDetails"
            ></ion-input>
          </ion-item>
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
            <ion-button shape="round" :disabled="paymentType === '--'" @click="saveOrderEntry">{{ savingEntry ? "Wait.." : "Save" }}</ion-button>
            <div v-if="paymentType !== '--' || transferDetails.length || order.length">
            <ion-icon @click="orderClear" :icon="trashOutline" color="danger"></ion-icon>
          </div>
          </div>
          <ion-searchbar
          show-clear-button="focus"
          v-model="filterTerm"
          placeholder="Search"
        ></ion-searchbar>
      </div>
      <div class="menu-section-div">
        <ion-list>
          <div class="menu-item" v-for="(p, i) in filteredItems" :key="i">
            <div id="item-price-col">
              <ion-label id="item-label">{{ p.title}}</ion-label>
            <span id="unit-cost">NGN {{ p.price }}</span>
            </div>
            <ion-list>
              <ion-item>
                <input :name="p.title" @input="portionInput($event)" style="width: 100px; margin-top: 6px;" type="number" placeholder="portion" v-model="p.portion" />
              </ion-item>
            </ion-list>
            <input
              type="checkbox"
              aria-label="menu item"
              :id="i.toString()"
              :disabled="goodToGo === false"
              @change="menuItemCheckAction($event, p.price, p.title, p.portion)"
            />
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
  IonText,
  IonTextarea,
  IonToolbar,
} from "@ionic/vue";
import { trashOutline } from "ionicons/icons";
import dummydata from './../assets/dummy-menu.json'

const paymentType = ref("--")
const transferDetails = ref("")
const customerPhone = ref('')
const orderTotal = ref(0)
const totalMsg = computed(() => orderTotal.value)

let savingEntry = false


const filterTerm = ref("")
const filteredItems = computed(() => {
  return dummydata.products.filter((item) => {
    return (
      item.title.toLowerCase().indexOf(filterTerm.value.toLowerCase()) != -1
    )
  })
})

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
}

const checkedItem = (price: string, title: string, portion: string) => {
  const total: number = +portion * +price 
  orderTotal.value += total;
  order.value.push({title, unit: price, portion})
}
const uncheckedItem = (price: string, title: string, portion: string) => {
  orderTotal.value -= +portion * +price
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

const saveOrderEntry = async () => {
  savingEntry = true;
setTimeout(() => {
  console.log(`
  Entry: Total: ${totalMsg.value}
  Order: ${JSON.stringify(order.value)}
  Paid via: ${paymentType.value}
  Customer: ${customerPhone.value}
  `)
  orderClear()
  window.location.reload()
  savingEntry = false
}, 5000)
}
</script>

<style scoped>
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
  border-radius: 6px;
  padding: 6px;
  margin: 4px 0px 8px 0px;
}

.menu-section-div {
  width: 90vw;
  max-height: 280px;
  /* border: 1px solid rgb(221, 185, 185); */
  margin-top: 6px;
  padding: 4px;
  overflow-y: auto;
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
}

.save-div {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
  margin: 6px;
}

#unit-cost {
  color: grey;
}
</style>

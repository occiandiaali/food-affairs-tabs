<template>
    <ion-content>
        <div id="new-item-div">
            <ion-item>
          <ion-input
            label="Enter new item name"
            label-placement="stacked"
            ref="input"
            type="text"
            v-model="newItem"
            placeholder="e.g. Spaghetti"
          ></ion-input>
        </ion-item>
        <ion-item>
          <ion-input
            label="Enter new item price"
            label-placement="stacked"
            ref="input"
            type="text"
            v-model="newPrice"
            placeholder="e.g. 200"
          ></ion-input>
        </ion-item>
        <ion-button shape="round">Add</ion-button>
        </div>
        <ion-searchbar show-clear-button="focus" v-model="filterTerm" placeholder="Search"></ion-searchbar>
        <div id="menu-list-div">
            <ion-list>
          <div v-for="result in filteredItems.sort()" :key="result.id">
            <ion-item>
            <ion-input label="Item:" type="text" v-model="result.title" :disabled="selected !== result.id" :placeholder="result.title"></ion-input>
            <ion-input label="Price:" type="number" v-model="result.price" :disabled="selected !== result.id" :placeholder="result.price"></ion-input>
            </ion-item>
            <ion-item >
              <ion-button @click="selected !== result.id ? editor(result.id) : updateMenuItem(result.id, result.title, result.price)">{{ selected !== result.id ? 'Edit' : 'Save' }}</ion-button>
            <ion-icon slot="end" :icon="trashOutline" color="danger" style="margin-left: 12px;" @click="deleteItemFromMenu(result.id)"></ion-icon>
            </ion-item>
          </div>
        </ion-list>
        </div>
    </ion-content>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonFab,
  IonFabButton,
  IonFabList,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonMenuButton,
  IonModal,
  IonPage,
  IonSearchbar,
  IonToggle,
  IonToolbar,
} from "@ionic/vue";
import {
  list,
  listOutline,
  mailOutline,
  micOutline,
  personOutline,
  trashOutline,
} from "ionicons/icons";

const resultRef = ref([
    {
        id: 1,
        title: 'egusi',
        price: "800"
    },
    {
        id: 2,
        title: 'beans',
        price: '200'
    },
    {
        id: 3,
        title: 'water',
        price: '100'
    },
    {
        id: 4,
        title: 'rice (white)',
        price: '200'
    },
])
const filterTerm = ref("")
const filteredItems = computed(() => {
  return resultRef.value.filter((item) => {
    return (
      item.title.toLowerCase().indexOf(filterTerm.value.toLowerCase()) != -1
    )
  })
})
const newItem = ref("")
const newPrice = ref("")
const selected = ref(null)
const editor = (idx: any) => {
  selected.value = idx
} 

const updateMenuItem = async (id: any, item: string, cost: string) => {
//   const itemRef = doc(db, 'menu', id)
//   await updateDoc(itemRef, {
//     title: item,
//     price: cost
//   })
  alert(`Updating: ${item} -> ${cost}`)
}

const deleteItemFromMenu = async (id: any) => {
 // await deleteDoc(doc(db, 'menu', id))
  alert(`Deleting item ID: ${id}`)
}

</script>

<style scoped>
#menu-list-div {
    overflow-y: auto;
    width: 90vw;
  max-height: 360px;
  border: 1px solid rgb(221, 185, 185);
  margin-top: 6px;
  padding: 4px;
}

#new-item-div {
    margin: 8px;
    padding: 4px;
    border: 1px solid rgb(165, 148, 165);
    border-radius: 8px;
}
</style>
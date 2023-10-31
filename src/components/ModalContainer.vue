<template>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button color="medium" @click="cancel">Cancel</ion-button>
        </ion-buttons>
        <ion-title>Menu Editor</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="deleteAll" :strong="true">Delete All</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <!-- <ion-item>
        <ion-input label-placement="stacked" label="Enter your name" v-model="name" placeholder="Your name"></ion-input>
      </ion-item> -->
      <MenuContainer />
    </ion-content>
  </template>

<script lang="ts" setup>
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonButton,
  IonItem,
  IonInput,
  modalController,
} from '@ionic/vue';
import { defineComponent, ref } from 'vue';

import MenuContainer from './MenuContainer.vue';

const name = ref();

const cancel = () => modalController.dismiss(null, 'cancel');
//const confirm = () => modalController.dismiss(name.value, 'confirm');
const deleteAll = () => alert("You want to delete the entire menu?")
</script>
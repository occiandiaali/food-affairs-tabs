<template>
  <ion-page>
    <!-- <ion-header>
      <ion-toolbar>
        <ion-title>Tab 3</ion-title>
      </ion-toolbar>
    </ion-header> -->
    <ion-content :fullscreen="true" class="ion-padding">
      <!-- <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Tab 3</ion-title>
        </ion-toolbar>
      </ion-header> -->

      <!-- <ExploreContainer name="Tab 3 page" /> -->
      <div class="content">
      <ion-avatar>
    <img alt="Silhouette of a person's head" src="https://ionicframework.com/docs/img/demos/avatar.svg" />
    <span>@admin3000</span>
  </ion-avatar>
  <div id="btn-div-grid">
    <div class="btn-div" aria-roledescription="button" @click="setOpen(true)">
      <ion-icon :icon="menuOutline" color="warning" size="large"></ion-icon>
      <ion-label>Menu</ion-label>
    </div>
    <div class="btn-div" aria-roledescription="button">
      <ion-icon :icon="fileTrayFullOutline" color="warning" size="large"></ion-icon>
      <ion-label>History</ion-label>
    </div>
    <div class="btn-div" aria-roledescription="button">
      <ion-icon :icon="chatboxOutline" color="warning" size="large"></ion-icon>
      <ion-label>Chats</ion-label>
    </div>
    <div class="btn-div" aria-roledescription="button">
      <ion-icon :icon="settingsOutline" color="warning" size="large"></ion-icon>
      <ion-label>Settings</ion-label>
    </div>
  </div>
</div>
<ion-modal :is-open="isOpen">
      <ion-header>
        <ion-toolbar>
          <ion-title>Modal</ion-title>
          <ion-buttons slot="end">
            <ion-button @click="setOpen(false)">Close</ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni illum quidem recusandae ducimus quos
          reprehenderit. Veniam, molestias quos, dolorum consequuntur nisi deserunt omnis id illo sit cum qui. Eaque,
          dicta.
        </p>
      </ion-content>
    </ion-modal>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
 import { IonAvatar, IonPage, IonButtons, IonButton, IonIcon, IonModal, IonHeader, IonLabel, IonToolbar, IonContent, IonTitle } from '@ionic/vue';
  import { ref } from 'vue';
  import {menuOutline, fileTrayFullOutline, settingsOutline, chatboxOutline} from 'ionicons/icons'
//import ExploreContainer from '@/components/ExploreContainer.vue';

const isOpen = ref(false);

const setOpen = (open: boolean) => (isOpen.value = open);
</script>

<style scoped>

.btn-div {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 150px;
  height: 150px;
  border-radius: 100%;
  background-color: rgb(78, 42, 78);
  cursor: pointer;
}
.btn-div > ion-label {
  color: white;
}

#btn-div-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  margin-top: 30%;
}
.content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
ion-avatar {
  margin-top: 26%;
}

ion-label {
  padding-top: 6px;
}
</style>

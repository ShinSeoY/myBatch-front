<script setup lang="ts">
import { ref } from 'vue'

const tab = ref('bookmarks')
</script>

<template>
  <div class="q-pa-md">
    <q-layout view="lHh lpr lFf" container style="height: 800px" class="shadow-2 rounded-borders">
      <q-header elevated class="my-q-header">
        <!-- <q-toolbar> -->
          <!-- <q-btn flat round dense icon="menu" class="q-mr-sm" /> -->
          <!-- <q-toolbar-title> </q-toolbar-title> -->

          <!-- <q-btn flat round dense icon="whatshot" /> -->
        <!-- </q-toolbar> -->

        <q-tabs v-model="tab">
          <q-route-tab to="/bookmarks" name="bookmarks" label="관심 환율" />
          <q-route-tab to="/calculator" name="calculator" label="환율 계산기" />
          <q-route-tab to="/notification" name="notification" label="알림 설정" />
        </q-tabs>
      </q-header>

      <q-page-container>
        <router-view />
      </q-page-container>
    </q-layout>
  </div>
</template>

<style scoped>
.my-q-header{
  padding-top: 10px;
}
</style>

<script setup lang="ts">
import { url } from 'inspector'
import { ref } from 'vue'

const tab = ref('bookmarks')
</script>

<template>
  <div class="q-pa-md">
    <q-layout view="lHh lpr lFf" container style="height: 800px" class="shadow-2 rounded-borders">
      <q-header elevated class="my-q-header">
        <q-img src="../assets/banner.png" style="height: 140px"></q-img>
        <q-tabs v-model="tab">
          <q-route-tab class="tab" to="/bookmarks" name="bookmarks" label="관심 환율" />
          <q-route-tab class="tab" to="/calculator" name="calculator" label="환율 계산기" />
          <q-route-tab class="tab" to="/notification" name="notification" label="알림 서비스" />
        </q-tabs>
      </q-header>

      <q-page-container>
        <router-view />
      </q-page-container>
    </q-layout>
  </div>
</template>

<style scoped>
.my-q-header {
  padding-top: 10px;
}
.tab {
  width: 150px;
}
</style>

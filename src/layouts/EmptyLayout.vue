<script setup lang="ts">
import { url } from 'inspector'
import { ref } from 'vue'

const tab = ref('bookmarks')
</script>

<template>
  <div class="q-pa-md">
    <q-layout view="lHh lpr lFf" container style="height: 800px" class="shadow-2 rounded-borders">
      <q-header elevated class="my-q-header">
        <q-img src="../assets/banner.png" style="height: 230px"></q-img>
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

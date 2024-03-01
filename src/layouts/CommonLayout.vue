<script setup lang="ts">
import { ref } from 'vue'

const tab = ref('bookmarks')

</script>

<template>
  <!-- <div class="header">
    <h1>오늘의 환율</h1>
    <router-link to="/bookmarks">관심 환율</router-link>
    <router-link to="/calculator">계산기</router-link>
    <router-link to="/notification">Question</router-link>
  </div> -->
  <div class="q-pa-md">
    <q-layout view="lHh lpr lFf" container style="height: 800px" class="shadow-2 rounded-borders">
      <q-header elevated>
        <q-toolbar>
          <q-btn flat round dense icon="menu" class="q-mr-sm" />
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg">
          </q-avatar>

          <q-toolbar-title>Quasar Framework</q-toolbar-title>

          <q-btn flat round dense icon="whatshot" />
        </q-toolbar>

        <q-tabs v-model="tab">
          <q-route-tab to="/bookmarks" name="bookmarks" label="관심 환율" />
          <q-route-tab to="/calculator" name="calculator" label="환율 계산기" />
          <q-route-tab to="/notification" name="notification" label="알림 설정" />
        </q-tabs>
      </q-header>

      <q-page-container>
        <router-view/>
      </q-page-container>
    </q-layout>
  </div>
</template>



<style scoped>
/* .header {
  text-align: center;
  background-color: lightgray;
}

a {
  color: #42b983;
} */
</style>

<script setup lang="ts"></script>

<template>
  <div class="header">
    <h1>Header</h1>
    <router-link to="/myHome">Home</router-link> / <router-link to="/testBar">Go to Bar</router-link> /

    <router-link to="/question">Question</router-link>
  </div>
</template>

<style scoped>
.header {
  text-align: center;
  background-color: lightgray;
}

a {
  color: #42b983;
}
</style>

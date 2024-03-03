<script setup lang="ts">
import { ref } from 'vue'

const columns:any = [
  {
    name: 'index',
    label: '#',
    field: 'index'
  },
  {
    name: 'name',
    required: true,
    label: '',  // 나라명 + 통화명 ex) 한국(원), 미국(달러) ..
    align: 'left',
    field: (row: any) => row.name
  },
  { name: 'unit', align: 'center', label: '단위', field: (row: any) => row.name}, //ex) USD, KRW, ..
  { name: 'dealBasR', label: '거래 기준 환율', field: (row: any) => row.dealBasR},
  { name: 'exchangeRate', label: 'Exchange Rate Per 1000 KRW', field: (row: any) => row.exchangeRate}, // = 전환금액/거래기준환율
  { name: 'ttb', label: '전신외환 살 때 환율', field: (row: any) => row.ttb},
  { name: 'tts', label: '전신외환 팔 때 환율', field: (row: any) => row.tts}
]

const rows:any = ref([
  {
    index:1,
    name: '한국 (원)',
    unit: 'KRW',
    dealBasR: 0,
    exchangeRate: 0,
    favorite: true,
    ttb: 0,
    tts: 0
  },
  {
    index:2,
    name: '미국 (달러)',
    unit: 'USD',
    dealBasR: 0,
    exchangeRate: 0,
    favorite: true,
    ttb: 0,
    tts: 0
  },
  {
    index:3,
    name: '일본 (엔)',
    unit: 'YEN',
    dealBasR: 0,
    exchangeRate: 0,
    favorite: true,
    ttb: 0,
    tts: 0
  }
])

const selected = ref([])
const getSelectedString = () => {
    return selected.value.length === 0 ? '' : `${selected.value.length} record${selected.value.length > 1 ? 's' : ''} selected of ${rows.value.length}`
  }
const clickFavorite = () => {
  console.log(selected)
}
</script>

<template>
  <div id="app">
    <q-page class="q-pa-md">
      <h1>계산기</h1>
      <q-table
      flat bordered
      title="오늘의 환율"
      :rows="rows"
      :columns="columns"
      row-key="name"
      :selected-rows-label="getSelectedString"
      selection="multiple"
      v-model:selected="selected"
    >
      <template v-slot:top-right>
        <q-btn icon="add" label="즐겨찾기 추가" @click="clickFavorite()" />
      </template>
    </q-table>

    <div class="q-mt-md">
      Selected: {{ JSON.stringify(selected) }}
    </div>
    </q-page>
  </div>
</template>

<style>
#app {
  text-align: center;
  color: #2c3e50;
}
</style>

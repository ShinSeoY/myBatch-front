<script setup lang="ts">
import dayjs from 'dayjs'
import { axios } from 'src/boot/axios'
import { onMounted, ref } from 'vue'

const columns: any = [
  {
    name: 'id',
    label: '#',
    field: 'id'
  },
  {
    name: 'name',
    required: true,
    label: '', // 나라명 + 통화명 ex) 한국(원), 미국(달러) ..
    align: 'left',
    field: (row: any) => row.name
  },
  { name: 'unit', align: 'center', label: '단위', field: (row: any) => row.unit }, //ex) USD, KRW, ..
  { name: 'dealBasR', label: '거래 기준 환율', field: (row: any) => row.dealBasR },
  { name: 'exchangeRate', label: 'Exchange Rate Per 1000 KRW', field: (row: any) => row.exchangeRate }, // = 전환금액/거래기준환율
  { name: 'ttb', label: '전신외환 살 때 환율', field: (row: any) => row.ttb },
  { name: 'tts', label: '전신외환 팔 때 환율', field: (row: any) => row.tts }
]

const rows: any = ref([
  // {
  //   index: 1,
  //   name: '한국 (원)',
  //   unit: 'KRW',
  //   dealBasR: 0,
  //   exchangeRate: 0,
  //   favorite: true,
  //   ttb: 0,
  //   tts: 0
  // },
  // {
  //   index: 2,
  //   name: '미국 (달러)',
  //   unit: 'USD',
  //   dealBasR: 0,
  //   exchangeRate: 0,
  //   favorite: true,
  //   ttb: 0,
  //   tts: 0
  // },
  // {
  //   index: 3,
  //   name: '일본 (엔)',
  //   unit: 'YEN',
  //   dealBasR: 0,
  //   exchangeRate: 0,
  //   favorite: true,
  //   ttb: 0,
  //   tts: 0
  // }
])

const baseDate = ref(dayjs().format('YYYY-MM-DD HH:mm:ss'))
const selectedFav = ref([])
const originAmount = ref()
const chagnedAmount = ref()
const dense = ref(false)
const selectedItem = ref({ name: '미국', unit: 'USD', dealBasR: 1066.9, krUnit: '달러' })
const selectOptions: any[] = [
  { name: '한국', unit: 'KRW', dealBasR: 1, krUnit: '원' },
  { name: '미국', unit: 'USD', dealBasR: 1066.9, krUnit: '달러' },
  { name: '태국', unit: 'THB', dealBasR: 32.9, krUnit: '바트' },
  { name: '중국', unit: 'CNH', dealBasR: 163.65, krUnit: '위엔' }
]

const clickFavorite = async () => {
  await axios.post('/member/fav', selectedFav.value.map((it:any)=>it.unit))
}

const calcChangedAmount = () => {
  if (originAmount.value) {
    chagnedAmount.value = originAmount.value / selectedItem.value.dealBasR + ' ' + selectedItem.value.krUnit
  } else {
    chagnedAmount.value = null
  }
}

const setData = async () => {
  const result = await axios.get('/exchange')
  switch (result.data.code) { 
    case '1000':
      rows.value = result.data.exchangeDtoList;
  }
}

onMounted(async () => {
  setData()
})
</script>

<template>
  <div id="app">
    <q-page class="q-pa-md parent-container">
      <div class="calc">
        <div class="calc_title">환율 계산기</div>
        <div class="base-date" style="text-align: left">기준 날짜 : {{ baseDate }}</div>
        <div class="input-container">
          <q-input class="custom-input" outlined v-model="originAmount" label="환전 전 금액 (원)" :dense="dense" @update:model-value="calcChangedAmount" />
          <img class="spacer" src="/public/icons/exchange.png">
          <q-input class="custom-input" outlined v-model="chagnedAmount" readonly label="환전 후 금액" :dense="dense" />
          <q-select v-model="selectedItem" :options="selectOptions" option-label="unit" outlined @update:model-value="calcChangedAmount" />
        </div>
      </div>

      <q-table
        flat
        bordered
        title="오늘의 환율"
        :rows="rows"
        :columns="columns"
        row-key="name"
        selection="multiple"
        v-model:selected="selectedFav"
      >
        <template v-slot:top-right>
          <q-btn icon="add" label="즐겨찾기 추가" @click="clickFavorite" />
        </template>
      </q-table>
    </q-page>
  </div>
</template>

<style>
#app {
  text-align: center;
  color: #2c3e50;
}
.calc {
  border: 1px solid rgba(0, 0, 0, 0.12);
  padding: 1%;
  margin-top: 5%;
  margin-bottom: 5%;
}
.calc_title {
  text-align: left;
  font-size: 20px;
  letter-spacing: 0.005em;
  font-weight: 400;
  margin-bottom: 2%;
}
.spacer {
  width: 50px; 
  height: 50px; 
  margin: 0px 20px;
}
.input-container {
  display: flex;
}
.custom-input {
  width: 40%;
  flex: 1;
  margin-right: auto;
  margin-left: auto;
  margin-bottom: 50px;
}
</style>

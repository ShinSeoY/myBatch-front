<script setup lang="ts">
import dayjs from 'dayjs'
import { useQuasar } from 'quasar'
import { axios } from 'src/boot/axios'
import { onMounted, ref } from 'vue'

const $q = useQuasar()

const columns: any = [
  { name: 'name', label: '국가명', align: 'center', field: (row: any) => row.name },
  { name: 'unit', align: 'center', label: '단위', field: (row: any) => row.unit },
  { name: 'dealBasR', align: 'right', label: '거래 기준 환율', field: (row: any) => row.dealBasR },
  { name: 'exchangeRate', align: 'right', label: 'Exchange Rate Per 1000 KRW', field: (row: any) => row.exchangeRate + `  ${row.krUnit}` }, // = 전환금액/거래기준환율
  { name: 'ttb', label: '송금 받을 때 환율', field: (row: any) => row.ttb },
  { name: 'tts', label: '송금 보낼 때 환율', field: (row: any) => row.tts }
]

const rows: any = ref([])

const baseDate = ref(dayjs().format('YYYY-MM-DD HH:mm:ss'))
const selectedFav = ref([])
const originAmount = ref()
const chagnedAmount = ref()
const dense = ref(false)
const selectedItem = ref()
const selectOptions: any = ref([])

const clickFavorite = async () => {
  $q.dialog({ title: '알림', message: '즐겨찾기에 추가하시겠습니까?', ok: '예', cancel: '아니오' }).onOk(async () => {
    await axios.post(
      '/member/fav',
      selectedFav.value.map((it: any) => it.unit)
    )
    selectedFav.value = []
  })
}

const calcChangedAmount = () => {
  if (originAmount.value) {
    let times = 1
    // 일본, 인도네시아는 * 100
    if (['IDR', 'JPY'].includes(selectedItem.value.unit)) {
      times = 100
    }
    chagnedAmount.value = Math.floor((originAmount.value / selectedItem.value.dealBasR) * times * 100) / 100.0 + ' ' + selectedItem.value.krUnit
  } else {
    chagnedAmount.value = null
  }
}

const setData = async () => {
  const result = await axios.get('/exchange')
  switch (result.data.code) {
    case '1000':
      baseDate.value = dayjs(result.data.exchangeDtoList[0]?.updatedAt).format('YYYY-MM-DD HH:mm:ss')
      rows.value = result.data.exchangeDtoList
      selectOptions.value = result.data.exchangeDtoList.map((it: any) => {
        const name = it.unit == 'EUR' ? it.name : it.name + ' ' + it.krUnit
        if (it.unit == 'USD') {
          selectedItem.value = { name: name, unit: it.unit, dealBasR: it.dealBasR, krUnit: it.krUnit }
        }
        return { name: name, unit: it.unit, dealBasR: it.dealBasR, krUnit: it.krUnit }
      })
  }
}

onMounted(async () => {
  setData()
})
</script>

<template>
  <div id="app">
    <q-page class="q-pa-md">
      <div class="q-pa-md child" style="min-width: 800px">
        <div class="calc">
          <div class="calc_title">환율 계산기</div>
          <div class="base-date" style="text-align: left">기준 날짜 : {{ baseDate }}</div>
          <div class="input-container">
            <q-input class="custom-input" outlined v-model="originAmount" label="환전 전 금액 (원)" :dense="dense" @update:model-value="calcChangedAmount" />
            <img class="spacer" src="/icons/exchange.png" />
            <q-input class="custom-input" outlined v-model="chagnedAmount" disable readonly label="환전 후 금액" :dense="dense" />
            <q-select v-model="selectedItem" :options="selectOptions" option-label="name" outlined @update:model-value="calcChangedAmount" />
          </div>
        </div>

        <q-table flat bordered title="오늘의 환율" :rows="rows" :columns="columns" row-key="name" selection="multiple" v-model:selected="selectedFav">
          <template v-slot:top-right>
            <q-btn icon="add" label="즐겨찾기 추가" @click="clickFavorite" />
          </template>
        </q-table>
      </div>
    </q-page>
  </div>
</template>

<style>
#app {
  text-align: center;
  color: #2c3e50;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.q-table__title {
  color: #2c3e50;
  text-align: left;
  font-size: 27px;
  letter-spacing: 0.005em;
  font-weight: bold;
  margin-bottom: 2%;
}

.calc {
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 5px;
  padding: 3%;
  margin-bottom: 5%;
}
.calc_title {
  text-align: left;
  font-size: 27px;
  letter-spacing: 0.005em;
  font-weight: bold;
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
